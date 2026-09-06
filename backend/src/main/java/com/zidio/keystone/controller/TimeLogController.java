package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.TimeLog;
import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.domain.entity.User;
import com.zidio.keystone.domain.entity.WorkOrder;
import com.zidio.keystone.service.TimeLogService;
import com.zidio.keystone.service.UserService;
import com.zidio.keystone.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/time-logs")
public class TimeLogController {

    private final TimeLogService timeLogService;
    private final WorkOrderService workOrderService;
    private final UserService userService;

    public TimeLogController(
            TimeLogService timeLogService,
            WorkOrderService workOrderService,
            UserService userService
    ) {
        this.timeLogService = timeLogService;
        this.workOrderService = workOrderService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<TimeLog> createTimeLog(
            @Valid @RequestBody TimeLog timeLog
    ) {

        WorkOrder workOrder = workOrderService.getWorkOrderByIdOrThrow(
                timeLog.getWorkOrder().getId()
        );

        String currentUserEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        User technician = userService.getUserByEmail(currentUserEmail)
                .orElseThrow(() -> new IllegalStateException(
                        "Authenticated user not found: " + currentUserEmail
                ));

        timeLog.setWorkOrder(workOrder);
        timeLog.setTechnician(technician);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(timeLogService.createTimeLog(timeLog));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeLog> getTimeLog(
            @PathVariable Long id
    ) {
        TimeLog timeLog = timeLogService.getTimeLogById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Time log not found with id: " + id
                        )
                );

        return ResponseEntity.ok(timeLog);
    }

    @GetMapping
    public ResponseEntity<List<TimeLog>> getTimeLogs(
            @RequestParam(required = false) Long workOrderId,
            @RequestParam(required = false) Long technicianId
    ) {
        if (workOrderId != null && technicianId != null) {
            return ResponseEntity.ok(
                    timeLogService.getTimeLogsByWorkOrderAndTechnician(
                            workOrderId,
                            technicianId
                    )
            );
        }

        if (workOrderId != null) {
            return ResponseEntity.ok(
                    timeLogService.getTimeLogsByWorkOrderId(workOrderId)
            );
        }

        if (technicianId != null) {
            return ResponseEntity.ok(
                    timeLogService.getTimeLogsByTechnicianId(technicianId)
            );
        }

        return ResponseEntity.badRequest().build();
    }
}


