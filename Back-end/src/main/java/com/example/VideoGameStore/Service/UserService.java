package com.example.VideoGameStore.Service;

import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Image.ImageUtils;
import com.example.VideoGameStore.Repository.GameRepository;
import com.example.VideoGameStore.Repository.UserRepository;
import com.example.VideoGameStore.dto.UserDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, GameRepository gameRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.gameRepository = gameRepository;
    }

    public Users getUserById(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if(user.getProfileImage() != null) {
            String base64Image = ImageUtils.convertToBase64String(user.getProfileImage());
            user.setImageUrl("data:image/jpeg;base64," + base64Image);
        }
        return user;
    }


    public ResponseEntity<Void> deleteUser(long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }

    @Transactional
        public Users updateUser(long id, Users user) {
        Optional<Users> existingUserOptional = userRepository.findById(id);

        if (existingUserOptional.isPresent()) {
            Users existingUser = existingUserOptional.get();

            // Atualize os campos do usuário com os novos dados
            existingUser.setFullname(user.getFullname());
            existingUser.setUsername(user.getUsername());
            existingUser.setBio(user.getBio());
            // Adicione outros campos conforme necessário

            // Salve o usuário atualizado no banco de dados
            return userRepository.save(existingUser);
        } else {
            return null; // Usuário não encontrado
        }
    }


    //Cria Profile Image
    public Users saveProfileImage(Long userId, MultipartFile file) throws IOException {
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        if (file != null && !file.isEmpty()) {
            user.setProfileImage(file.getBytes());
        }
        return userRepository.save(user);
    }

    public Users getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public void registerFirstManager(UserDTO userDTO) {
        Users user = new Users();
        user.setUsername(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole(userDTO.getRole());
        userRepository.save(user);
    }

    @Transactional
    public void addFavoriteGame(Long userId, Long gameId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Game not found"));

        // Verifica se o jogo não está na lista de favoritos do usuário
        if (user.getFavorites().stream().noneMatch(g -> g.getId().equals(gameId))) {
            user.getFavorites().add(game);  // Adiciona o jogo à lista de favoritos
            userRepository.save(user);  // Salva o usuário
        }
    }

    @Transactional
    public void removeFavoriteGame(Long userId, Long gameId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Game not found"));

        // Remove o jogo da lista de favoritos do usuário
        user.getFavorites().remove(game);
        userRepository.save(user);  // Salva o usuário
    }

    @Transactional(readOnly = true)
    public List<Game> getFavorites(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return Collections.unmodifiableList(new ArrayList<>(user.getFavorites()));
    }

    //Logica do Carinho

    @Transactional
    public void addCartGame(Long userId, Long gameId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Game not found"));

        if(user.getCart().stream().noneMatch(g -> g.getId().equals(gameId))) {
            user.getCart().add(game);
            userRepository.save(user);
        }
    }

    @Transactional
    public void removeCartGame(Long userId, Long gameId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Game not found"));

        user.getCart().remove(game);
        userRepository.save(user);
    }

    @Transactional
    public List<Game> getCart(long userId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return Collections.unmodifiableList(new ArrayList<>(user.getCart()));
    }

    @Transactional
    public void transferToPurchasedGames(Long userId, Long gameId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Game not found"));

        // Verifica se o jogo está no carrinho antes de transferir
        if (user.getCart().contains(game)) {
            // Remove o jogo do carrinho
            user.getCart().remove(game);

            // Adiciona o jogo à lista de jogos comprados
            if (!user.getUser_purchased_games().contains(game)) {
                user.getUser_purchased_games().add(game);
            }

            // Salva as alterações no banco
            userRepository.save(user);
        } else {
            throw new RuntimeException("Game not in cart");
        }
    }


    @Transactional
    public List<Game> PurchasedGames(long userId){
        Users user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not Found"));
        return Collections.unmodifiableList(new ArrayList<>(user.getUser_purchased_games()));
    }

}
