package com.example.VideoGameStore.Entity;

import jakarta.persistence.*;

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

        @Transient
        private String imageUrl;

        @Lob
        private byte[] image;

        // Getters and setters

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
