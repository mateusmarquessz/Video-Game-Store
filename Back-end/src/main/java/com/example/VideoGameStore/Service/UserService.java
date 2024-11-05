package com.example.VideoGameStore.Service;


import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Repository.UsersRepository;
import com.example.VideoGameStore.dto.UserDTO;
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
    @Autowired
    private UsersRepository usersRepository;

    public UserService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.UsersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void addFavorite(Long userId, Game game) {
        Users user = UsersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getFavorites().add(game);
        UsersRepository.save(user);
    }

    public void removeFavorite(Long userId, Long gameId) {
        Users user = UsersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.getFavorites().removeIf(game -> game.getId().equals(gameId));
        UsersRepository.save(user);
    }


    public void createBio(Long userId) {
        Users user = UsersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBio("nova bio");
        usersRepository.save(user);
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

    //Pega dados do Usuario pelo Email
    public Users getUserByEmail(String email) {
        Users user = usersRepository.findByEmail(email).orElse(null);
        return usersRepository.findByEmail(email)
                .orElse(null);
    }

    public void registerFirstManager(UserDTO userDTO) {
        // Converta o UserDTO para a entidade User
        Users user  = new Users();
        user.setUsername(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        // Encode a senha antes de salvar
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        // Defina a role GESTOR
        user.setRole(userDTO.getRole());

        // Salve o usuário no banco de dados
        usersRepository.save(user);
    }

}
