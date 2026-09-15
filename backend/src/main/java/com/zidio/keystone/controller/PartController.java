package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.Part;
import com.zidio.keystone.service.PartService;
import com.zidio.keystone.service.PartUsageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
public class PartController {

    private final PartService partService;
    private final PartUsageService partUsageService;

    public PartController(
            PartService partService,
            PartUsageService partUsageService
    ) {
        this.partService = partService;
        this.partUsageService = partUsageService;
    }

    @PostMapping
    public ResponseEntity<Part> createPart(
            @Valid @RequestBody Part part
    ) {
        if (partService.existsByPartNumber(part.getPartNumber())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(partService.createPart(part));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Part> getPart(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                partService.getPartByIdOrThrow(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Part>> getParts(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "false") boolean active
    ) {
        if (name != null && !name.isBlank() && active) {
            return ResponseEntity.ok(
                    partService.searchActiveParts(name)
            );
        }

        if (name != null && !name.isBlank()) {
            return ResponseEntity.ok(
                    partService.searchParts(name)
            );
        }

        if (active) {
            return ResponseEntity.ok(
                    partService.getActiveParts()
            );
        }

        return ResponseEntity.ok(
                partService.getAllParts()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Part> updatePart(
            @PathVariable Long id,
            @Valid @RequestBody Part part
    ) {
        Part existing = partService.getPartByIdOrThrow(id);

        boolean partNumberChanged = !existing.getPartNumber().equals(part.getPartNumber());
        if (partNumberChanged && partService.existsByPartNumber(part.getPartNumber())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        existing.setPartNumber(part.getPartNumber());
        existing.setName(part.getName());
        existing.setDescription(part.getDescription());
        existing.setUnitCost(part.getUnitCost());
        existing.setStockQuantity(part.getStockQuantity());
        existing.setActive(part.isActive());

        return ResponseEntity.ok(
                partService.updatePart(existing)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePart(
            @PathVariable Long id
    ) {
        partService.getPartByIdOrThrow(id);

        if (partUsageService.existsByPartId(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        partService.deletePart(id);
        return ResponseEntity.noContent().build();
    }
}


