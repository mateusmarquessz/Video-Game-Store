package com.example.VideoGameStore.dto;

import com.example.VideoGameStore.Roles.Role;

public record ResponseDTO(String username, String token, long userId, Role role) { }
