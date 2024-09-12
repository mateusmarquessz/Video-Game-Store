package com.example.VideoGameStore.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.time.LocalDateTime;

@Entity
public class Game {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private String genre;
        private String typeOfSupport;
        private Double price;
        private String imageUrl;

        // Getters and setters
        public String getImageUrl() {
                return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
                this.imageUrl = imageUrl;
        }
        public String getTypeOfSupport() {
                return typeOfSupport;
        }

        public void setTypeOfSupport(String typeOfSupport) {
                this.typeOfSupport = typeOfSupport;
        }
        public Long getId() {
                return id;
        }

        public void setId(Long id) {
                this.id = id;
        }

        public String getName() {
                return name;
        }

        public void setName(String name) {
                this.name = name;
        }

        public String getGenre() {
                return genre;
        }

        public void setGenre(String genre) {
                this.genre = genre;
        }

        public Double getPrice() {
                return price;
        }

        public void setPrice(Double price) {
                this.price = price;
        }

        public void setCreatedAt(LocalDateTime now) {
        }

        public void setUpdatedAt(LocalDateTime now) {

        }
}
