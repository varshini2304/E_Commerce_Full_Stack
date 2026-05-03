package com.ecommerce.vendor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class VendorServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(VendorServiceApplication.class, args);
    }
}
