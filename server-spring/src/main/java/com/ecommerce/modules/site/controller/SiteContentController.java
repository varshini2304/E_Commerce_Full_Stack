package com.ecommerce.modules.site.controller;

import com.ecommerce.modules.site.dto.ContactInfoDto;
import com.ecommerce.modules.site.dto.ContactSubmissionRequest;
import com.ecommerce.modules.site.dto.AboutContentDto;
import com.ecommerce.modules.site.dto.PolicyContentDto;
import com.ecommerce.modules.site.service.SiteContentService;
import com.ecommerce.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/site")
@RequiredArgsConstructor
public class SiteContentController {

    private final SiteContentService siteContentService;

    @GetMapping("/contact")
    public ResponseEntity<ApiResponse<ContactInfoDto>> getContactInfo() {
        return ResponseEntity.ok(ApiResponse.success("Contact details fetched", siteContentService.getContactInfo()));
    }

    @PostMapping("/contact")
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitContact(
            @Valid @RequestBody ContactSubmissionRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success("Message submitted successfully", siteContentService.submitContact(request)));
    }

    @GetMapping("/privacy-policy")
    public ResponseEntity<ApiResponse<PolicyContentDto>> getPrivacyPolicy() {
        return ResponseEntity.ok(ApiResponse.success("Privacy policy fetched", siteContentService.getPrivacyPolicy()));
    }

    @GetMapping("/terms")
    public ResponseEntity<ApiResponse<PolicyContentDto>> getTerms() {
        return ResponseEntity.ok(ApiResponse.success("Terms fetched", siteContentService.getTerms()));
    }

    @GetMapping("/about")
    public ResponseEntity<ApiResponse<AboutContentDto>> getAbout() {
        return ResponseEntity.ok(ApiResponse.success("About content fetched", siteContentService.getAbout()));
    }
}
