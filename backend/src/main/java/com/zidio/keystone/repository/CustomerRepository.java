package com.zidio.keystone.repository;

import com.zidio.keystone.domain.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    List<Customer> findByNameContainingIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);
}


