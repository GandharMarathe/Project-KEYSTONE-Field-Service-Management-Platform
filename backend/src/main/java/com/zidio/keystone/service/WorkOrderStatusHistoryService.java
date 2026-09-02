package com.zidio.keystone.service;

import com.zidio.keystone.domain.entity.WorkOrderStatusHistory;
import com.zidio.keystone.repository.WorkOrderStatusHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkOrderStatusHistoryService {

    private final WorkOrderStatusHistoryRepository workOrderStatusHistoryRepository;

    public WorkOrderStatusHistoryService(
            WorkOrderStatusHistoryRepository workOrderStatusHistoryRepository
    ) {
        this.workOrderStatusHistoryRepository =
                workOrderStatusHistoryRepository;
    }

    public WorkOrderStatusHistory createHistory(
            WorkOrderStatusHistory history
    ) {
        return workOrderStatusHistoryRepository.save(history);
    }

    public Optional<WorkOrderStatusHistory> getHistoryById(Long id) {
        return workOrderStatusHistoryRepository.findById(id);
    }

    public List<WorkOrderStatusHistory> getHistoryByWorkOrderId(
            Long workOrderId
    ) {
        return workOrderStatusHistoryRepository
                .findByWorkOrderIdOrderByChangedAtAsc(workOrderId);
    }

    public List<WorkOrderStatusHistory> getAllHistory() {
        return workOrderStatusHistoryRepository.findAll();
    }
}


