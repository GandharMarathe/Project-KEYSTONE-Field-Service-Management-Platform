package com.zidio.keystone.dto;

import com.zidio.keystone.domain.enums.Role;

import java.time.OffsetDateTime;

public record UserResponse(
        Long id,
        String email,
        String firstName,
        String lastName,
        Role role,
        boolean enabled,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}