package com.zidio.keystone.service;

import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.domain.entity.Part;
import com.zidio.keystone.repository.PartRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartService {

    private final PartRepository partRepository;

    public PartService(PartRepository partRepository) {
        this.partRepository = partRepository;
    }

    public Part createPart(Part part) {
        return partRepository.save(part);
    }

    public Optional<Part> getPartById(Long id) {
        return partRepository.findById(id);
    }

    public Part getPartByIdOrThrow(Long id) {
        return partRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Part not found with id: " + id
                        )
                );
    }

    public Optional<Part> getPartByPartNumber(String partNumber) {
        return partRepository.findByPartNumber(partNumber);
    }

    public List<Part> getAllParts() {
        return partRepository.findAll();
    }

    public List<Part> getActiveParts() {
        return partRepository.findByActiveTrue();
    }

    public List<Part> searchParts(String name) {
        return partRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Part> searchActiveParts(String name) {
        return partRepository.findByActiveTrueAndNameContainingIgnoreCase(name);
    }

    public Part updatePart(Part part) {
        return partRepository.save(part);
    }

    public boolean existsById(Long id) {
        return partRepository.existsById(id);
    }

    public boolean existsByPartNumber(String partNumber) {
        return partRepository.existsByPartNumber(partNumber);
    }
}


