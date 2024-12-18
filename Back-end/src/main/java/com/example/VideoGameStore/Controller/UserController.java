package com.example.VideoGameStore.Controller;

import java.io.IOException;
import java.util.Base64;

import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Repository.GameRepository;
import com.example.VideoGameStore.Repository.UsersRepository;
import com.example.VideoGameStore.Service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final UsersRepository usersRepository;
    private final GameRepository gameRepository;


    @Autowired
    public UserController(UserService userService, UsersRepository usersRepository, GameRepository gameRepository) {
        this.userService = userService;
        this.usersRepository = usersRepository;
        this.gameRepository = gameRepository;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build(); // 204 No Content
    }

    @PutMapping("/{id}")
    public ResponseEntity<Users> updateUser(@PathVariable Long id, @RequestBody Users updatedUser) {
        Users user = userService.updateUser(id, updatedUser);
        return ResponseEntity.ok(user);  // Certifique-se de que o fullname seja retornado
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

    //Logica de favoritar os jogos

    // Adiciona um jogo aos favoritos do usuário
    @PostMapping("/{userId}/favorites/{gameId}")
    public ResponseEntity<String> addFavorite(@PathVariable Long userId, @PathVariable Long gameId) {
        try {
            userService.addFavoriteGame(userId, gameId);
            return ResponseEntity.ok("Game added to favorites");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding favorite");
        }
    }

    // Retorna a lista de jogos favoritos do usuário
    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<Game>> getFavorites(@PathVariable Long userId) {
        try {
            List<Game> favorites = userService.getFavorites(userId);
            return ResponseEntity.ok(favorites);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Remove um jogo dos favoritos do usuário
    @DeleteMapping("/{userId}/favorites/{gameId}")
    public ResponseEntity<String> removeFavorite(@PathVariable Long userId, @PathVariable Long gameId) {
        try {
            userService.removeFavoriteGame(userId, gameId);
            return ResponseEntity.ok("Game removed from favorites");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while removing favorite");
        }
    }

    //Logica do Carinho
    @GetMapping("/{userId}/Cart")
    public ResponseEntity<List<Game>> getCart(@PathVariable Long userId) {
     try{
         List<Game> cart = userService.getCart(userId);
         return ResponseEntity.ok(cart);
     } catch (EntityNotFoundException e) {
         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
     } catch (Exception e) {
         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
     }
    }

    @PostMapping("/{userId}/Cart/{gameId}")
    public ResponseEntity<String> addCart(@PathVariable Long userId, @PathVariable Long gameId) {
        try {
            userService.addCartGame(userId, gameId);
            return ResponseEntity.ok("Game added to Cart");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding cart");
        }
    }

    @DeleteMapping("/{userId}/Cart/{gameId}")
    public ResponseEntity<String> removeCart(@PathVariable Long userId, @PathVariable Long gameId) {
        try{
            userService.removeCartGame(userId, gameId);
            return ResponseEntity.ok("Game removed from cart");
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while removing cart");
        }
    }

    @PostMapping("/{userId}/checkout/{gameIds}")
    public ResponseEntity<String> transferToPurchasedGames(@PathVariable Long userId, @PathVariable String gameIds) {
        try {
            String[] gameIdArray = gameIds.split(",");
            for (String gameId : gameIdArray) {
                userService.transferToPurchasedGames(userId, Long.parseLong(gameId));
            }
            return ResponseEntity.ok("Games transferred to purchased");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred");
        }
    }


    @GetMapping("/{userId}/purchasedGame")
    public ResponseEntity<List<Game>> PurchasedGames(@PathVariable Long userId) {
        try{
            List<Game> gamesAd = userService.PurchasedGames(userId);
            return ResponseEntity.ok(gamesAd);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

