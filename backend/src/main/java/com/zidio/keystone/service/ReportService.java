package com.zidio.keystone.service;

import com.zidio.keystone.domain.enums.WorkOrderStatus;
import com.zidio.keystone.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class ReportService {

    private final WorkOrderRepository workOrderRepository;

    public ReportService(WorkOrderRepository workOrderRepository) {
        this.workOrderRepository = workOrderRepository;
    }

    public Map<String, Long> getSummary() {
        Map<String, Long> summary = new LinkedHashMap<>();

        summary.put("total", workOrderRepository.count());
        summary.put("new", countByStatus(WorkOrderStatus.NEW));
        summary.put("assigned", countByStatus(WorkOrderStatus.ASSIGNED));
        summary.put("inProgress", countByStatus(WorkOrderStatus.IN_PROGRESS));
        summary.put("onHold", countByStatus(WorkOrderStatus.ON_HOLD));
        summary.put("completed", countByStatus(WorkOrderStatus.COMPLETED));
        summary.put("closed", countByStatus(WorkOrderStatus.CLOSED));
        summary.put("cancelled", countByStatus(WorkOrderStatus.CANCELLED));

        return summary;
    }

    private long countByStatus(WorkOrderStatus status) {
        return workOrderRepository.findByStatus(status).size();
    }
}


