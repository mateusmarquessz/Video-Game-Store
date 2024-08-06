package com.example.VideoGameStore.Service;


import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UsersRepository UsersRepository;

    public UserService(UsersRepository usersRepository) {
        this.UsersRepository = usersRepository;
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
