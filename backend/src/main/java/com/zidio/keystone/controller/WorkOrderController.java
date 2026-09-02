package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.Customer;
import com.zidio.keystone.domain.entity.Site;
import com.zidio.keystone.domain.entity.WorkOrder;
import com.zidio.keystone.service.CustomerService;
import com.zidio.keystone.service.SiteService;
import com.zidio.keystone.service.WorkOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;
    private final CustomerService customerService;
    private final SiteService siteService;

    public WorkOrderController(
            WorkOrderService workOrderService,
            CustomerService customerService,
            SiteService siteService
    ) {
        this.workOrderService = workOrderService;
        this.customerService = customerService;
        this.siteService = siteService;
    }

    @PostMapping
    public ResponseEntity<WorkOrder> createWorkOrder(
            @Valid @RequestBody WorkOrder workOrder
    ) {
        Customer customer = customerService.getCustomerByIdOrThrow(
                workOrder.getCustomer().getId()
        );

        Site site = siteService.getSiteByIdOrThrow(
                workOrder.getSite().getId()
        );

        workOrder.setCustomer(customer);
        workOrder.setSite(site);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(workOrderService.createWorkOrder(workOrder));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrder> getWorkOrder(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                workOrderService.getWorkOrderByIdOrThrow(id)
        );
    }

    @GetMapping
    public ResponseEntity<List<WorkOrder>> getWorkOrders(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long siteId,
            @RequestParam(required = false) Long assignedToId
    ) {
        if (customerId != null) {
            return ResponseEntity.ok(
                    workOrderService.getWorkOrdersByCustomerId(customerId)
            );
        }

        if (siteId != null) {
            return ResponseEntity.ok(
                    workOrderService.getWorkOrdersBySiteId(siteId)
            );
        }

        if (assignedToId != null) {
            return ResponseEntity.ok(
                    workOrderService.getWorkOrdersByAssignedToId(assignedToId)
            );
        }

        return ResponseEntity.ok(
                workOrderService.getAllWorkOrders()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkOrder> updateWorkOrder(
            @PathVariable Long id,
            @Valid @RequestBody WorkOrder workOrder
    ) {
        WorkOrder existing = workOrderService.getWorkOrderByIdOrThrow(id);

        existing.setCode(workOrder.getCode());
        existing.setTitle(workOrder.getTitle());
        existing.setDescription(workOrder.getDescription());
        existing.setPriority(workOrder.getPriority());
        existing.setSlaDueAt(workOrder.getSlaDueAt());

        return ResponseEntity.ok(
                workOrderService.updateWorkOrder(existing)
        );
    }
}


