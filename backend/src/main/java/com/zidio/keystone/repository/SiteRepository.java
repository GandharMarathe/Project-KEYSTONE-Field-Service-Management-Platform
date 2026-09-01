package com.zidio.keystone.repository;

import com.zidio.keystone.domain.entity.Customer;
import com.zidio.keystone.domain.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SiteRepository extends JpaRepository<Site, Long> {
    List<Site> findByCustomer(Customer customer);

    List<Site> findByCustomerId(Long customerId);

    List<Site> findByNameContainingIgnoreCase(String name);

    List<Site> findByCustomerIdAndNameContainingIgnoreCase(
            Long customerId,
            String name
    );
}


