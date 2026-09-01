package come.zidio.keystone.repository;

import com.zidio.keystone.domain.entity.WorkOrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkOrderStatusHistoryRepository
        extends JpaRepository<WorkOrderStatusHistoryRepository, Long> {
    List<WorkOrderStatusHistoryRepository> findByWorkOrderIdOrderByChangedAtAsc(Long workOrderId);

    List<WorkOrderStatusHistoryRepository> findByWorkOrderIdOrderByChangedAtDesc(Long workOrderId);

    List<WorkOrderStatusHistoryRepository> findByChangedById(Long userId);
}


