package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.Part;
import com.zidio.keystone.service.PartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
public class PartController {

    private final PartService partService;

    public PartController(PartService partService) {
        this.partService = partService;
    }

    @PostMapping
    public ResponseEntity<Part> createPart(
            @Valid @RequestBody Part part
    ) {
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
}


