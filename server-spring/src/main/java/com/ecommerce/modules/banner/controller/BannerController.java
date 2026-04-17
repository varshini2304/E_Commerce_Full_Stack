package com.ecommerce.modules.banner.controller;

import com.ecommerce.modules.banner.model.Banner;
import com.ecommerce.modules.banner.service.BannerService;
import com.ecommerce.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Banner>>> getBanners() {
        List<Banner> data = bannerService.getActiveBanners();
        return ResponseEntity.ok(ApiResponse.success("Banners fetched", data));
    }
}
