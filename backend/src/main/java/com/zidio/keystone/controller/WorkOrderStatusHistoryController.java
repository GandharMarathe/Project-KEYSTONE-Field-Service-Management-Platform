package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.WorkOrderStatusHistory;
import com.zidio.keystone.service.WorkOrderStatusHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-order-status-history")
public class WorkOrderStatusHistoryController {

    private final WorkOrderStatusHistoryService historyService;

    public WorkOrderStatusHistoryController(
            WorkOrderStatusHistoryService historyService
    ) {
        this.historyService = historyService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderStatusHistory> getHistory(
            @PathVariable Long id
    ) {
        WorkOrderStatusHistory history =
                historyService.getHistoryById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
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


