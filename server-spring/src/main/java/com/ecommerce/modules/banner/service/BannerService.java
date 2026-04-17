package com.ecommerce.modules.banner.service;

import com.ecommerce.modules.banner.model.Banner;
import com.ecommerce.modules.banner.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public List<Banner> getActiveBanners() {
        return bannerRepository.findAllActiveBanners(LocalDateTime.now());
    }
}
