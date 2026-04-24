package com.ecommerce.inventory.controller;

import com.ecommerce.inventory.model.Inventory;
import com.ecommerce.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> getInventory(@PathVariable String productId) {
        Inventory inventory = inventoryService.getInventory(productId);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", true);
        response.put("message", "Inventory fetched");
        response.put("data", inventory);

        return ResponseEntity.ok(response);
    }
}
