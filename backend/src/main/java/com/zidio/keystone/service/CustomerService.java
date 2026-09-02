package com.zidio.keystone.service;

import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.domain.entity.Customer;
import com.zidio.keystone.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public List<Customer> searchCustomers(String name) {
        return customerRepository.findByNameContainingIgnoreCase(name);
    }

    public Customer updateCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    public boolean existsById(Long id) {
        return customerRepository.existsById(id);
    }

    public Customer getCustomerByIdOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Customer not found with id: " + id
                        )
                );
    }
}


