package com.zidio.keystone.service;

import com.zidio.keystone.domain.entity.PartUsage;
import com.zidio.keystone.repository.PartUsageRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartUsageService {

    private final PartUsageRepository partUsageRepository;

    public PartUsageService(PartUsageRepository partUsageRepository) {
        this.partUsageRepository = partUsageRepository;
    }

    public PartUsage createPartUsage(PartUsage partUsage) {
        return partUsageRepository.save(partUsage);
    }

    public Optional<PartUsage> getPartUsageById(Long id) {
        return partUsageRepository.findById(id);
    }

    public List<PartUsage> getPartUsagesByWorkOrderId(Long workOrderId) {
        return partUsageRepository.findByWorkOrderId(workOrderId);
    }

    public List<PartUsage> getPartUsagesByPartId(Long partId) {
        return partUsageRepository.findByPartId(partId);
    }

    public List<PartUsage> getPartUsagesByUserId(Long userId) {
        return partUsageRepository.findByUsedById(userId);
    }

    public PartUsage updatePartUsage(PartUsage partUsage) {
        return partUsageRepository.save(partUsage);
    }

    public void deletePartUsage(Long id) {
        partUsageRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return partUsageRepository.existsById(id);
    }
}


