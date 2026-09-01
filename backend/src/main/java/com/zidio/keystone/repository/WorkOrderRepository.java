package com.zidio.keystone.repository;

import com.zidio.keystone.domain.entity.WorkOrder;
import com.zidio.keystone.domain.enums.WorkOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    Optional<WorkOrder> findByCode(String code);

    boolean existsByCode(String code);

    List<WorkOrder> findByCustomerId(Long customerId);

    List<WorkOrder> findBySiteId(Long siteId);

    List<WorkOrder> findByAssignedToId(Long technicianId);

    List<WorkOrder> findByStatus(WorkOrderStatus status);

    List<WorkOrder> findByCustomerIdAndStatus(
            Long customerId,
            WorkOrderStatus status
    );

    List<WorkOrder> findByAssignedToIdAndStatus(
            Long technicianId,
            WorkOrderStatus status
    );
}


