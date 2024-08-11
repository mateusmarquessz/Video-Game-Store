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
