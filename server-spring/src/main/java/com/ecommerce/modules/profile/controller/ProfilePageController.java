package com.ecommerce.modules.profile.controller;

import com.ecommerce.modules.profile.service.ProfilePageService;
import com.ecommerce.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/profile-page")
@RequiredArgsConstructor
public class ProfilePageController {

    private final ProfilePageService profilePageService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfilePage(
            @RequestParam(required = false) String email
    ) {
        Map<String, Object> data = profilePageService.getProfilePageData(email);
        return ResponseEntity.ok(ApiResponse.success("Profile page data fetched", data));
    }
}
