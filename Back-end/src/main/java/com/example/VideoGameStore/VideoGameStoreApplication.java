package com.example.VideoGameStore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
public class VideoGameStoreApplication {

	public static void main(String[] args) {
		SpringApplication.run(VideoGameStoreApplication.class, args);
	}

}
