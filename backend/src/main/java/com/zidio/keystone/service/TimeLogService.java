package com.zidio.keystone.service;

import com.zidio.keystone.domain.entity.TimeLog;
import com.zidio.keystone.repository.TimeLogRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TimeLogService {

    private final TimeLogRepository timeLogRepository;

    public TimeLogService(TimeLogRepository timeLogRepository) {
        this.timeLogRepository = timeLogRepository;
    }

    public TimeLog createTimeLog(TimeLog timeLog) {
        return timeLogRepository.save(timeLog);
    }

    public Optional<TimeLog> getTimeLogById(Long id) {
        return timeLogRepository.findById(id);
    }

    public List<TimeLog> getTimeLogsByWorkOrderId(Long workOrderId) {
        return timeLogRepository.findByWorkOrderId(workOrderId);
    }

    public List<TimeLog> getTimeLogsByTechnicianId(Long technicianId) {
        return timeLogRepository.findByTechnicianId(technicianId);
    }

    public List<TimeLog> getTimeLogsByWorkOrderAndTechnician(
            Long workOrderId,
            Long technicianId
    ) {
        return timeLogRepository.findByWorkOrderIdAndTechnicianId(
                workOrderId,
                technicianId
        );
    }

    public TimeLog updateTimeLog(TimeLog timeLog) {
        return timeLogRepository.save(timeLog);
    }

    public void deleteTimeLog(Long id) {
        timeLogRepository.deleteById(id);
    }

    public boolean existsById(Long id) {
        return timeLogRepository.existsById(id);
    }
}


