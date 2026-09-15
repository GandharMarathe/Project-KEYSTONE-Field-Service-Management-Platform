package com.zidio.keystone.repository;

import com.zidio.keystone.domain.entity.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {

    boolean existsByWorkOrderId(Long workOrderId);

    List<TimeLog> findByWorkOrderId(Long workOrderId);

    List<TimeLog> findByTechnicianId(Long technicianId);

    List<TimeLog> findByWorkOrderIdAndTechnicianId(
            Long workOrderId,
            Long technicianId
    );
}


