package com.example.VideoGameStore.Entity;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Game {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private String genre;
        private String typeOfSupport;
        private Double price;

        @Transient
        private String imageUrl;

        @Lob
        private byte[] image;

        @Column(length = 5000, columnDefinition = "TEXT")
        private String systemRequirements;

        private String ageRating;

        @Column(length = 5000, columnDefinition = "TEXT")
        private String description;

        // Getters and setters

        public String getSystemRequirements() {
                return systemRequirements;
        }

        public void setSystemRequirements(String systemRequirements) {
                this.systemRequirements = systemRequirements;
        }

        public String getAgeRating() {
                return ageRating;
        }

        public void setAgeRating(String ageRating) {
                this.ageRating = ageRating;
        }

        public String getDescription() {
                return description;
        }

        public void setDescription(String description) {
                this.description = description;
        }

        public String getImageUrl() {
                return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
                this.imageUrl = imageUrl;
        }

        public byte[] getImage(){
                return image;
        }

        public void setImage(byte[] image){
                this.image = image;
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
