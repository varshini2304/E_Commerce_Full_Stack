package com.ecommerce.modules.site.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AboutContentDto {
    private String title;
    private String subtitle;
    private String heroImage;
    private String story;
    private String mission;
    private String vision;
    private List<String> values = new ArrayList<>();
    private List<AboutStatDto> stats = new ArrayList<>();
}
