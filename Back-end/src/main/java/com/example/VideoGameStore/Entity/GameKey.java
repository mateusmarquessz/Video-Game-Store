package com.example.VideoGameStore.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class GameKey {
    @Id
    private Long id;

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
