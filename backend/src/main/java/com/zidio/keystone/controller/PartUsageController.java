package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.Part;
import com.zidio.keystone.domain.entity.PartUsage;
import com.zidio.keystone.domain.entity.User;
import com.zidio.keystone.domain.entity.WorkOrder;
import com.zidio.keystone.service.PartService;
import com.zidio.keystone.service.PartUsageService;
import com.zidio.keystone.service.UserService;
import com.zidio.keystone.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/part-usages")
public class PartUsageController {

    private final PartUsageService partUsageService;
    private final WorkOrderService workOrderService;
    private final PartService partService;
    private final UserService userService;

    public PartUsageController(
            PartUsageService partUsageService,
            WorkOrderService workOrderService,
            PartService partService,
            UserService userService
    ) {
        this.partUsageService = partUsageService;
        this.workOrderService = workOrderService;
        this.partService = partService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<PartUsage> createPartUsage(
            @Valid @RequestBody PartUsage partUsage
    ) {
        WorkOrder workOrder = workOrderService.getWorkOrderByIdOrThrow(
                partUsage.getWorkOrder().getId()
        );
        Part part = partService.getPartByIdOrThrow(
                partUsage.getPart().getId()
        );

        String currentUserEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        User usedBy = userService.getUserByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalStateException(
                        "Authenticated user not found: " + currentUserEmail
                ));

        partUsage.setWorkOrder(workOrder);
        partUsage.setPart(part);
        partUsage.setUsedBy(usedBy);

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


