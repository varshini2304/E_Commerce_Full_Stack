package com.ecommerce.modules.site.service;

import com.ecommerce.modules.site.dto.ContactInfoDto;
import com.ecommerce.modules.site.dto.ContactSubmissionRequest;
import com.ecommerce.modules.site.dto.AboutContentDto;
import com.ecommerce.modules.site.dto.PolicyContentDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SiteContentService {

    private final ObjectMapper objectMapper;

    public ContactInfoDto getContactInfo() {
        return readJson("site/contact.json", new TypeReference<>() {});
    }

    public Map<String, Object> submitContact(ContactSubmissionRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("ticketId", "CNT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        response.put("submittedAt", OffsetDateTime.now().format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        response.put("name", request.getName());
        response.put("email", request.getEmail());
        return response;
    }

    public PolicyContentDto getPrivacyPolicy() {
        return readJson("site/privacy-policy.json", new TypeReference<>() {});
    }

    public PolicyContentDto getTerms() {
        return readJson("site/terms.json", new TypeReference<>() {});
    }

    public AboutContentDto getAbout() {
        return readJson("site/about.json", new TypeReference<>() {});
    }

    private <T> T readJson(String path, TypeReference<T> typeReference) {
        try {
            ClassPathResource resource = new ClassPathResource(path);
            try (InputStream inputStream = resource.getInputStream()) {
                return objectMapper.readValue(inputStream, typeReference);
            }
        } catch (IOException exception) {
            throw new IllegalStateException("Failed to load site content from: " + path, exception);
        }
    }
}
