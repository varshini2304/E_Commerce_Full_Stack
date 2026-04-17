package com.ecommerce.modules.site.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PolicyContentDto {
    private String lastUpdated;
    private List<PolicySectionDto> sections = new ArrayList<>();
}
