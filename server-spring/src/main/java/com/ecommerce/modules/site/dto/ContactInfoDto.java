package com.ecommerce.modules.site.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ContactInfoDto {
    private String title;
    private String subtitle;
    private String address;
    private String phone;
    private String email;
    private String mapEmbedUrl;
    private List<SocialLinkDto> socialLinks = new ArrayList<>();
}
