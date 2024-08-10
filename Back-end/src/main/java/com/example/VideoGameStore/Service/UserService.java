package com.example.VideoGameStore.Service;


import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private final UsersRepository UsersRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.UsersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    //Lista Usuarios
    public List<Users> getAllUsers() {
        return UsersRepository.findAll();
    }

    //Lista Usuario por Id
    public Optional<Users> getUserById(long id) {
        return UsersRepository.findById(id);
    }

    //Cria Usuario
    public Users CreateUser(Users user) {
        Optional<Users> usersOptional = UsersRepository.findByUsername(user.getUsername());
        if (usersOptional.isPresent()) {
            throw new IllegalArgumentException("User already exists");
        }

        Optional<Users> existingEmail = UsersRepository.findByEmail(user.getEmail());
        if (existingEmail.isPresent()) {
            throw new IllegalArgumentException("Email already exists.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("ROLE_USER");
        user.setCreatedAt(LocalDateTime.now());
        return UsersRepository.save(user);
    }

    //Deleta Usuario pelo Id
    public ResponseEntity<Users> deleteUser(long userId){
        UsersRepository.deleteById(userId);
        return null;
    }

    //Update Usuario pelo Id

    public Users updateUser(long id, Users user) {
        Optional<Users> existingUser = UsersRepository.findById(id);
        if (existingUser.isPresent()) {
            Users updatedUser = existingUser.get();
            updatedUser.setUsername(user.getUsername());
            updatedUser.setPassword(user.getPassword());
            // Update other fields as necessary
            updatedUser.setUpdatedAt(LocalDateTime.now());
            return UsersRepository.save(updatedUser);
        } else {
            return null;
        }
    }
}
