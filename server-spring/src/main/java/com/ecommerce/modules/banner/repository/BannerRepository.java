package com.ecommerce.modules.banner.repository;

import com.ecommerce.modules.banner.model.Banner;
import com.ecommerce.modules.banner.model.BannerType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    @Query("SELECT b FROM Banner b WHERE b.isActive = true " +
           "AND b.type = :type " +
           "AND (b.startDate IS NULL OR b.startDate <= :now) " +
           "AND (b.endDate IS NULL OR b.endDate >= :now) " +
           "ORDER BY b.position ASC")
    List<Banner> findActiveBannersByType(@Param("type") BannerType type, @Param("now") LocalDateTime now);

    @Query("SELECT b FROM Banner b WHERE b.isActive = true " +
           "AND (b.startDate IS NULL OR b.startDate <= :now) " +
           "AND (b.endDate IS NULL OR b.endDate >= :now) " +
           "ORDER BY b.position ASC")
    List<Banner> findAllActiveBanners(@Param("now") LocalDateTime now);
}
