package com.example.VideoGameStore.Service;

import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Image.ImageUtils;
import com.example.VideoGameStore.Repository.UsersRepository;
import com.example.VideoGameStore.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    private final UsersRepository usersRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UsersRepository usersRepository, PasswordEncoder passwordEncoder) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Users getUserById(Long userId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if(user.getProfileImage() != null) {
            String base64Image = ImageUtils.convertToBase64String(user.getProfileImage());
            user.setImageUrl("data:image/jpeg;base64," + base64Image);
        }
        return user;
    }

    public void createBio(Long userId, String bio) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBio(bio);
        usersRepository.save(user);
    }


    public ResponseEntity<Void> deleteUser(long userId) {
        usersRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }

    public Users updateUser(long id, Users user) {
        Optional<Users> existingUser = usersRepository.findById(id);
        if (existingUser.isPresent()) {
            Users updatedUser = existingUser.get();
            updatedUser.setUsername(user.getUsername() != null ? user.getUsername() : updatedUser.getUsername());
            updatedUser.setFullName(user.getFullName() != null ? user.getFullName() : updatedUser.getFullName());
            updatedUser.setUpdatedAt(LocalDateTime.now());
            return usersRepository.save(updatedUser);
        } else {
            return null;
        }
    }

    //Cria Profile Image
    public Users saveProfileImage(Long userId, MultipartFile file) throws IOException {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (file != null && !file.isEmpty()) {
            user.setProfileImage(file.getBytes());
        }
        return usersRepository.save(user);
    }

    public Users getUserByEmail(String email) {
        return usersRepository.findByEmail(email).orElse(null);
    }

    public void registerFirstManager(UserDTO userDTO) {
        Users user = new Users();
        user.setUsername(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(userDTO.getRole());
        usersRepository.save(user);
    }
}
