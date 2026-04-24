package com.ecommerce.order.kafka;

import com.ecommerce.order.event.OrderCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderEventProducer {

    private static final String TOPIC = "order-created";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Publishes an order-created event to Kafka.
     */
    public void publishOrderCreated(OrderCreatedEvent event) {
        log.info("Publishing order-created event for orderId={}", event.getOrderId());
        kafkaTemplate.send(TOPIC, event.getOrderId(), event);
        log.info("Successfully published order-created event for orderId={}", event.getOrderId());
    }
}
