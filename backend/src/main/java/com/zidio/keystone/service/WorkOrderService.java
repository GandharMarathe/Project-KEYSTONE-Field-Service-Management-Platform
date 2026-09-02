package com.zidio.keystone.service;

import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.domain.entity.WorkOrder;
import com.zidio.keystone.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WorkOrderService {

    private final WorkOrderRepository workOrderRepository;

    public WorkOrderService(
            WorkOrderRepository workOrderRepository
    ) {
        this.workOrderRepository = workOrderRepository;
    }

    public WorkOrder createWorkOrder(WorkOrder workOrder) {
        return workOrderRepository.save(workOrder);
    }

    public Optional<WorkOrder> getWorkOrderById(Long id) {
        return workOrderRepository.findById(id);
    }

    public WorkOrder getWorkOrderByIdOrThrow(Long id) {
        return workOrderRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Work order not found with id: " + id
                        )
                );
    }

    public Optional<WorkOrder> getWorkOrderByCode(String code) {
        return workOrderRepository.findByCode(code);
    }

    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll();
    }

    public List<WorkOrder> getWorkOrdersByCustomerId(Long customerId) {
        return workOrderRepository.findByCustomerId(customerId);
    }

    public List<WorkOrder> getWorkOrdersBySiteId(Long siteId) {
        return workOrderRepository.findBySiteId(siteId);
    }

    public List<WorkOrder> getWorkOrdersByAssignedToId(Long userId) {
        return workOrderRepository.findByAssignedToId(userId);
    }

    public WorkOrder updateWorkOrder(WorkOrder workOrder) {
        return workOrderRepository.save(workOrder);
    }

    public boolean existsById(Long id) {
        return workOrderRepository.existsById(id);
    }
}


