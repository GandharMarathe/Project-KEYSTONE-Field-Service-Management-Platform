package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.Customer;
import com.zidio.keystone.domain.entity.Site;
import com.zidio.keystone.service.CustomerService;
import com.zidio.keystone.service.SiteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
public class SiteController {

    private final SiteService siteService;
    private final CustomerService customerService;

    public SiteController(
            SiteService siteService,
            CustomerService customerService
    ) {
        this.siteService = siteService;
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<Site> createSite(
            @Valid @RequestBody Site site
    ) {
        Customer customer = customerService.getCustomerByIdOrThrow(
                site.getCustomer().getId()
        );

        site.setCustomer(customer);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(siteService.createSite(site));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Site> getSite(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                siteService.getSiteByIdOrThrow(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<Site>> getSites(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String name
    ) {
        if (customerId != null && name != null && !name.isBlank()) {
            return ResponseEntity.ok(
                    siteService.searchSitesByCustomer(customerId, name)
            );
        }

        if (customerId != null) {
            return ResponseEntity.ok(
                    siteService.getSitesByCustomerId(customerId)
            );
        }

        if (name != null && !name.isBlank()) {
            return ResponseEntity.ok(
                    siteService.searchSites(name)
            );
        }

        return ResponseEntity.ok(
                siteService.getAllSites()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Site> updateSite(
            @PathVariable Long id,
            @Valid @RequestBody Site site
    ) {
        Site existing = siteService.getSiteByIdOrThrow(id);

        existing.setName(site.getName());
        existing.setAddressLine1(site.getAddressLine1());
        existing.setAddressLine2(site.getAddressLine2());
        existing.setCity(site.getCity());
        existing.setState(site.getState());
        existing.setCountry(site.getCountry());
        existing.setActive(site.isActive());

        return ResponseEntity.ok(
                siteService.updateSite(existing)
        );
    }
}