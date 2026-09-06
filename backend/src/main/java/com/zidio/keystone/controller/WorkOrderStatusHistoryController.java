package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.User;
import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.domain.entity.WorkOrder;
import com.zidio.keystone.domain.entity.WorkOrderStatusHistory;
import com.zidio.keystone.service.UserService;
import com.zidio.keystone.service.WorkOrderService;
import com.zidio.keystone.service.WorkOrderStatusHistoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-order-status-history")
public class WorkOrderStatusHistoryController {

    private final WorkOrderStatusHistoryService historyService;
    private final WorkOrderService workOrderService;
    private final UserService userService;

    public WorkOrderStatusHistoryController(
            WorkOrderStatusHistoryService historyService,
            WorkOrderService workOrderService,
            UserService userService
    ) {
        this.historyService = historyService;
        this.workOrderService = workOrderService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<WorkOrderStatusHistory> createHistory(
            @Valid @RequestBody WorkOrderStatusHistory history
    ) {
        WorkOrder workOrder = workOrderService.getWorkOrderByIdOrThrow(
                history.getWorkOrder().getId()
        );

        String currentUserEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User changedBy = userService.getUserByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalStateException(
                        "Authenticated user not found: " + currentUserEmail
                ));

        history.setWorkOrder(workOrder);
        history.setChangedBy(changedBy);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(historyService.createHistory(history));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderStatusHistory> getHistory(
            @PathVariable Long id
    ) {
        WorkOrderStatusHistory history =
                historyService.getHistoryById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Status history not found with id: " + id
                                )
                        );

        return ResponseEntity.ok(history);
    }

    @GetMapping
    public ResponseEntity<List<WorkOrderStatusHistory>> getHistoryList(
            @RequestParam(required = false) Long workOrderId
    ) {
        if (workOrderId != null) {
            return ResponseEntity.ok(
                    historyService.getHistoryByWorkOrderId(workOrderId)
            );
        }

        return ResponseEntity.ok(
                historyService.getAllHistory()
        );
    }
}


