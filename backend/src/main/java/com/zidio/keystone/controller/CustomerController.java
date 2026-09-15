package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.Customer;
import com.zidio.keystone.service.CustomerService;
import com.zidio.keystone.service.SiteService;
import com.zidio.keystone.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final SiteService siteService;
    private final WorkOrderService workOrderService;

    public CustomerController(
            CustomerService customerService,
            SiteService siteService,
            WorkOrderService workOrderService
    ) {
        this.customerService = customerService;
        this.siteService = siteService;
        this.workOrderService = workOrderService;
    }

    @PostMapping
    public ResponseEntity<Customer> createCustomer(
            @Valid @RequestBody Customer customer
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(customerService.createCustomer(customer));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomer(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                customerService.getCustomerByIdOrThrow(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getCustomers(
            @RequestParam(required = false) String name
    ) {
        if (name != null && !name.isBlank()) {
            return ResponseEntity.ok(
                    customerService.searchCustomers(name)
            );
        }

        return ResponseEntity.ok(
                customerService.getAllCustomers()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody Customer customer
    ) {
        Customer existing = customerService.getCustomerByIdOrThrow(id);

        existing.setName(customer.getName());
        existing.setEmail(customer.getEmail());
        existing.setPhone(customer.getPhone());
        existing.setAddress(customer.getAddress());
        existing.setActive(customer.isActive());

        return ResponseEntity.ok(
                customerService.updateCustomer(existing)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(
            @PathVariable Long id
    ) {
        customerService.getCustomerByIdOrThrow(id);

        boolean hasDependents = siteService.existsByCustomerId(id)
                || workOrderService.existsByCustomerId(id);

        if (hasDependents) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}


