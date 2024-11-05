package com.example.VideoGameStore.dto;
import com.example.VideoGameStore.Roles.Role;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public class UserDTO {

    private long id;
    private String fullName;
    private String email;
    private String password;
    private Role role;
    // Getters e Setters


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
