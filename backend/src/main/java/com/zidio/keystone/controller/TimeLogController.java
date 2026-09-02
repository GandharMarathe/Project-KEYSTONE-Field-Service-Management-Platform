package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.TimeLog;
import com.zidio.keystone.service.TimeLogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/time-logs")
public class TimeLogController {

    private final TimeLogService timeLogService;

    public TimeLogController(TimeLogService timeLogService) {
        this.timeLogService = timeLogService;
    }

    @PostMapping
    public ResponseEntity<TimeLog> createTimeLog(
            @Valid @RequestBody TimeLog timeLog
    ) {
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
                        new IllegalArgumentException(
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


