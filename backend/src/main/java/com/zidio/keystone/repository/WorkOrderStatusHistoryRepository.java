package com.zidio.keystone.repository;

import com.zidio.keystone.domain.entity.WorkOrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkOrderStatusHistoryRepository
        extends JpaRepository<WorkOrderStatusHistory, Long> {

    boolean existsByWorkOrderId(Long workOrderId);

    List<WorkOrderStatusHistory> findByWorkOrderIdOrderByChangedAtAsc(
            Long workOrderId
    );
}


