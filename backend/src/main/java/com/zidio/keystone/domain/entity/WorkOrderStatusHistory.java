package com.zidio.keystone.domain.entity;

import com.zidio.keystone.domain.enums.WorkOrderStatus;
import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "work_order_status_history",
        indexes = {
                @Index(name = "idx_status_history_work_order", columnList = "work_order_id"),
                @Index(name = "idx_status_history_changed_at", columnList = "changed_at")
        }
)
public class WorkOrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "work_order_id", nullable = false)
    private WorkOrder workOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 30)
    private WorkOrderStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 30)
    private WorkOrderStatus toStatus;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "changed_by", nullable = false)
    private User changedBy;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(name = "changed_at", nullable = false)
    private OffsetDateTime changedAt;

    public WorkOrderStatusHistory() {
    }

    @PrePersist
    protected void onCreate() {
        changedAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public WorkOrder getWorkOrder() {
        return workOrder;
    }

    public void setWorkOrder(WorkOrder workOrder) {
        this.workOrder = workOrder;
    }

    public WorkOrderStatus getFromStatus() {
        return fromStatus;
    }

    public void setFromStatus(WorkOrderStatus fromStatus) {
        this.fromStatus = fromStatus;
    }

    public WorkOrderStatus getToStatus() {
        return toStatus;
    }

    public void setToStatus(WorkOrderStatus toStatus) {
        this.toStatus = toStatus;
    }

    public User getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(User changedBy) {
        this.changedBy = changedBy;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public OffsetDateTime getChangedAt() {
        return changedAt;
    }
}

