package com.zidio.keystone.dto;

import com.zidio.keystone.domain.enums.Role;

public record CreateUserRequest(
        String email,
        String password,
        String firstName,
        String lastName,
        Role role
) {
}