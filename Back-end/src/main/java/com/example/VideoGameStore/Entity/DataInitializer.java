package com.example.VideoGameStore.Entity;

import com.example.VideoGameStore.Roles.Role;
import com.example.VideoGameStore.Service.UserService;
import com.example.VideoGameStore.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Autowired
    private UserService userService;

    @Bean
    public CommandLineRunner loadData() {
        return args -> {
            // Verifica se o usuário padrão já existe
            if (userService.getUserByEmail("gestorpadrao@gmail.com.br") == null) {
                UserDTO userDTO = new UserDTO();
                userDTO.setFullName("Gestor Padrão");
                userDTO.setEmail("gestorpadrao@gmail.com.br");
                userDTO.setPassword("teste123");
                userDTO.setRole(Role.ROLE_ADMIN);

                userService.registerFirstManager(userDTO);
            }
        };
    }
}
