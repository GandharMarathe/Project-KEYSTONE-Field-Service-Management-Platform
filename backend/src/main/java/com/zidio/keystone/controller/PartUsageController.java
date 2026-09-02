package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.PartUsage;
import com.zidio.keystone.service.PartUsageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/part-usages")
public class PartUsageController {

    private final PartUsageService partUsageService;

    public PartUsageController(PartUsageService partUsageService) {
        this.partUsageService = partUsageService;
    }

    @PostMapping
    public ResponseEntity<PartUsage> createPartUsage(
            @Valid @RequestBody PartUsage partUsage
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(partUsageService.createPartUsage(partUsage));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PartUsage> getPartUsage(
            @PathVariable Long id
    ) {
        PartUsage partUsage = partUsageService.getPartUsageById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Part usage not found with id: " + id
                        )
                );

        return ResponseEntity.ok(partUsage);
    }

    @GetMapping
    public ResponseEntity<List<PartUsage>> getPartUsages(
            @RequestParam(required = false) Long workOrderId,
            @RequestParam(required = false) Long partId,
            @RequestParam(required = false) Long usedById
    ) {
        if (workOrderId != null) {
            return ResponseEntity.ok(
                    partUsageService.getPartUsagesByWorkOrderId(workOrderId)
            );
        }

        if (partId != null) {
            return ResponseEntity.ok(
                    partUsageService.getPartUsagesByPartId(partId)
            );
        }

        if (usedById != null) {
            return ResponseEntity.ok(
                    partUsageService.getPartUsagesByUserId(usedById)
            );
        }

        return ResponseEntity.badRequest().build();
    }
}


