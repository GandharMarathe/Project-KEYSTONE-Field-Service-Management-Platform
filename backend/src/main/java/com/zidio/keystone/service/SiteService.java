package com.zidio.keystone.service;

import com.zidio.keystone.exception.ResourceNotFoundException;
import com.zidio.keystone.domain.entity.Site;
import com.zidio.keystone.repository.SiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SiteService {

    private final SiteRepository siteRepository;

    public SiteService(SiteRepository siteRepository) {
        this.siteRepository = siteRepository;
    }

    public Site createSite(Site site) {
        return siteRepository.save(site);
    }

    public Optional<Site> getSiteById(Long id) {
        return siteRepository.findById(id);
    }

    public Site getSiteByIdOrThrow(Long id) {
        return siteRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Site not found with id: " + id
                        )
                );
    }

    public List<Site> getAllSites() {
        return siteRepository.findAll();
    }

    public List<Site> getSitesByCustomerId(Long customerId) {
        return siteRepository.findByCustomerId(customerId);
    }

    public List<Site> searchSites(String name) {
        return siteRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Site> searchSitesByCustomer(Long customerId, String name) {
        return siteRepository.findByCustomerIdAndNameContainingIgnoreCase(
                customerId,
                name
        );
    }

    public Site updateSite(Site site) {
        return siteRepository.save(site);
    }

    public boolean existsById(Long id) {
        return siteRepository.existsById(id);
    }
}

