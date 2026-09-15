package com.zidio.keystone.service;

import com.zidio.keystone.domain.entity.Part;
import com.zidio.keystone.domain.entity.PartUsage;
import com.zidio.keystone.repository.PartUsageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PartUsageService {

    private final PartUsageRepository partUsageRepository;
    private final PartService partService;

    public PartUsageService(
            PartUsageRepository partUsageRepository,
            PartService partService
    ) {
        this.partUsageRepository = partUsageRepository;
        this.partService = partService;
    }

    @Transactional
    public PartUsage createPartUsage(PartUsage partUsage) {
        Part part = partUsage.getPart();

        if (partUsage.getQuantity() > part.getStockQuantity()) {
            throw new IllegalArgumentException(
                    "Insufficient stock for part " + part.getPartNumber()
                        + ": requested " + partUsage.getQuantity()
                        + ", available " + part.getStockQuantity()
            );
        }

        part.setStockQuantity(part.getStockQuantity() - partUsage.getQuantity());
        partService.updatePart(part);
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

    public boolean existsByPartId(Long partId) {
        return partUsageRepository.existsByPartId(partId);
    }

    public boolean existsByWorkOrderId(Long workOrderId) {
        return partUsageRepository.existsByWorkOrderId(workOrderId);
    }
}


