package com.zidio.keystone.service;

import com.zidio.keystone.domain.entity.User;
import com.zidio.keystone.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthService(
            UserService userService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    public String login(String email, String password) {

        User user = userService.getUserByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid email or password")
                );

        if (!user.isEnabled()) {
            throw new IllegalArgumentException("User account is disabled");
        }

        if (!userService.matchesPassword(
                password,
                user.getPasswordHash()
        )) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        return jwtService.generateToken(user.getEmail());
    }
}