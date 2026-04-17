package com.ecommerce.modules.home.controller;

import com.ecommerce.modules.home.service.HomeService;
import com.ecommerce.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHomePage() {
        Map<String, Object> data = homeService.getHomePageData();
        return ResponseEntity.ok(ApiResponse.success("Home page data fetched", data));
    }
}
