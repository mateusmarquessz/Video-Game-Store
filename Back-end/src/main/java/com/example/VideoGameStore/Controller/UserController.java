package com.example.VideoGameStore.Controller;

import java.io.IOException;
import java.util.Base64;
import java.util.Map;
import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Repository.UsersRepository;
import com.example.VideoGameStore.Service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final UsersRepository usersRepository;

    public UserController(UserService userService, UsersRepository usersRepository) {
        this.userService = userService;
        this.usersRepository = usersRepository;
    }

    @PostMapping("/{id}/bio")
    public ResponseEntity<String> createBio(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        String bio = requestBody.get("bio");

        // Obtém o usuário autenticado
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();

        // Verifica se o usuário autenticado é o mesmo do `id` ou possui uma role administrativa
        if (!user.getId().equals(id)) {
            return ResponseEntity.status(403).body("Acesso negado!");
        }

        userService.createBio(id, bio);
        return ResponseEntity.ok("Bio criada com sucesso!");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PutMapping("/{id}")
    public ResponseEntity<Users> updateUser(@PathVariable long id, @RequestBody Users user) {
        Users updatedUser = userService.updateUser(id, user);

        // Se a atualização for bem-sucedida, retorne o usuário atualizado
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @GetMapping("/profile/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        Users user = userService.getUserById(id);
        if (user.getProfileImage() != null) {
            String base64Image = convertToBase64String(user.getProfileImage());
            String imageUrl = "data:image/png;base64," + base64Image;
            user.setImageUrl(imageUrl);
        }

        return ResponseEntity.ok(user);
    }

    @PutMapping("/{userId}/profile-image")
    public ResponseEntity<String> saveProfileImage(
            @PathVariable Long userId, // Corrigido para userId
            @RequestParam("image") MultipartFile image) throws IOException {

        // Verifica a autorização do usuário
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users authenticatedUser = (Users) authentication.getPrincipal();

        // Permite acesso apenas ao próprio perfil ou a um administrador
        if (!authenticatedUser.getId().equals(userId) && !authenticatedUser.getRole().equals("ADMIN")) {
            return ResponseEntity.status(403).body("Forbidden");
        }

        // Salva ou atualiza a imagem de perfil
        Users updatedUser = userService.saveProfileImage(userId, image); // Certifique-se de que o método updateUser lida com o MultipartFile

        // Se a imagem for salva, converta-a para Base64 e crie a URL
        if (updatedUser.getProfileImage() != null) {
            String base64Image = convertToBase64String(updatedUser.getProfileImage()); // Certifique-se de que o campo profileImage armazene a imagem em byte[]
            String imageUrl = "data:image/png;base64," + base64Image;
            updatedUser.setImageUrl(imageUrl);
        }

        return ResponseEntity.ok("Profile image updated successfully. Image URL: " + updatedUser.getImageUrl());
    }


    // Método para converter byte[] para String base64
    private String convertToBase64String(byte[] imageBytes) {
        return Base64.getEncoder().encodeToString(imageBytes);
    }

}
