package com.zidio.keystone.repository;

import com.zidio.keystone.domain.entity.PartUsage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PartUsageRepository extends JpaRepository<PartUsage, Long> {

    List<PartUsage> findByWorkOrderId(Long workOrderId);

    List<PartUsage> findByPartId(Long partId);

    List<PartUsage> findByUsedById(Long userId);
}