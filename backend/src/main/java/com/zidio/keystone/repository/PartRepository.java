package com.zidio.keystone.repository;

import com.zidio.keystone.domain.entity.Part;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PartRepository extends JpaRepository<Part, Long> {

    Optional<Part> findByPartNumber(String partNumber);

    boolean existsByPartNumber(String partNumber);

    List<Part> findByNameContainingIgnoreCase(String name);

    List<Part> findByActiveTrue();

    List<Part> findByActiveTrueAndNameContainingIgnoreCase(String name);
}


