package com.zidio.keystone.controller;

import com.zidio.keystone.domain.entity.User;
import com.zidio.keystone.dto.CreateUserRequest;
import com.zidio.keystone.dto.UserResponse;
import com.zidio.keystone.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @Valid @RequestBody CreateUserRequest request
    ) {
        if (userService.existsByEmail(request.email())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(request.password());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setRole(request.role());
        user.setEnabled(true);

        User savedUser = userService.createUser(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(savedUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                toResponse(userService.getUserByIdOrThrow(id))
        );
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}


