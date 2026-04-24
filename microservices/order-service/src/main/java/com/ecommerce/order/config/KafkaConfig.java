package com.ecommerce.order.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.*;
import org.springframework.kafka.listener.CommonErrorHandler;
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer;
import org.springframework.kafka.listener.DefaultErrorHandler;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;
import org.springframework.util.backoff.FixedBackOff;

import java.util.HashMap;
import java.util.Map;

/**
 * Kafka config for Order Service.
 *
 * ─── Interview Point: Retry + DLQ ───
 * "What happens if a Kafka consumer fails to process a message?"
 * → We have a 3-retry policy with 1-second backoff.
 *   If all retries fail, the message goes to a Dead Letter Topic (DLT).
 *   DLT messages can be monitored and reprocessed manually or via automation.
 */
@Slf4j
@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    // ── Topics ──

    @Bean
    public NewTopic orderCreatedTopic() {
        return TopicBuilder.name("order-created")
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic orderCreatedDltTopic() {
        return TopicBuilder.name("order-created.DLT")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic paymentSuccessDltTopic() {
        return TopicBuilder.name("payment-success.DLT")
                .partitions(1)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic paymentFailedDltTopic() {
        return TopicBuilder.name("payment-failed.DLT")
                .partitions(1)
                .replicas(1)
                .build();
    }

    // ── Producer ──

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        config.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, false);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    // ── Consumer with Retry + DLQ ──

    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "order-service-group");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setCommonErrorHandler(errorHandler());
        return factory;
    }

    /**
     * Error handler with retry policy and Dead Letter Topic.
     * - 3 retries with 1-second interval
     * - On failure: publish to DLT (Dead Letter Topic)
     */
    @Bean
    public CommonErrorHandler errorHandler() {
        DeadLetterPublishingRecoverer recoverer = new DeadLetterPublishingRecoverer(kafkaTemplate());

        DefaultErrorHandler errorHandler = new DefaultErrorHandler(
                recoverer,
                new FixedBackOff(1000L, 3L)  // 3 retries, 1 second apart
        );

        errorHandler.setRetryListeners((record, ex, deliveryAttempt) -> {
            log.warn("[ORDER-SERVICE DLQ] Retry attempt {} for topic={}, key={}, error={}",
                    deliveryAttempt, record.topic(), record.key(), ex.getMessage());
        });

        return errorHandler;
    }
}
