package com.example.VideoGameStore.Service;

import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Image.ImageUtils;
import com.example.VideoGameStore.Repository.GameRepository;
import com.example.VideoGameStore.Repository.UsersRepository;
import com.example.VideoGameStore.dto.UserDTO;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

import static com.example.VideoGameStore.Image.ImageUtils.convertToBase64String;

@Service
public class UserService {

    private final UsersRepository usersRepository;
    private final GameRepository gameRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UsersRepository usersRepository, PasswordEncoder passwordEncoder, GameRepository gameRepository) {
        this.usersRepository = usersRepository;
        this.passwordEncoder = passwordEncoder;
        this.gameRepository = gameRepository;
    }

    @Transactional
    public Map<String, Object> getUserById(Long userId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Criar o mapa para armazenar os dados específicos
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("fullname", user.getFullname());
        userData.put("email", user.getEmail());
        userData.put("username", user.getUsername());
        userData.put("role", user.getRole());
        userData.put("bio", user.getBio());
        return userData;
    }

    @Transactional
    public String getProfileImageByUserId(Long userId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProfileImage() != null) {
            return convertToBase64String(user.getProfileImage());
        } else {
            throw new RuntimeException("Profile image not found");
        }
    }



    public ResponseEntity<Void> deleteUser(long userId) {
        usersRepository.deleteById(userId);
        return ResponseEntity.noContent().build();
    }

    @Transactional
    public Users updateUser(long id, Users user) {
        // Tenta encontrar o usuário no banco de dados
        Optional<Users> existingUserOptional = usersRepository.findById(id);

        if (existingUserOptional.isPresent()) {
            // Recupera o usuário existente
            Users existingUser = existingUserOptional.get();

            // Atualiza os campos com os dados recebidos
            existingUser.setFullname(user.getFullname());
            existingUser.setUsername(user.getUsername());
            existingUser.setBio(user.getBio());

            // Salva o usuário atualizado
            usersRepository.save(existingUser);

            // Recarrega o usuário atualizado do banco para garantir que os dados mais recentes sejam retornados
            return usersRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        } else {
            throw new RuntimeException("User not found");
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

    @Transactional
    public void addFavoriteGame(Long userId, Long gameId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Game not found"));

        // Verifica se o jogo não está na lista de favoritos do usuário
        if (user.getFavorites().stream().noneMatch(g -> g.getId().equals(gameId))) {
            user.getFavorites().add(game);  // Adiciona o jogo à lista de favoritos
            usersRepository.save(user);  // Salva o usuário
        }
    }

    @Transactional
    public void removeFavoriteGame(Long userId, Long gameId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Game not found"));

        // Remove o jogo da lista de favoritos do usuário
        user.getFavorites().remove(game);
        usersRepository.save(user);  // Salva o usuário
    }

    @Transactional(readOnly = true)
    public List<Game> getFavorites(Long userId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return Collections.unmodifiableList(new ArrayList<>(user.getFavorites()));
    }

    //Logica do Carinho

    @Transactional
    public void addCartGame(Long userId, Long gameId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Game not found"));

        if(user.getCart().stream().noneMatch(g -> g.getId().equals(gameId))) {
            user.getCart().add(game);
            usersRepository.save(user);
        }
    }

    @Transactional
    public void removeCartGame(Long userId, Long gameId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Game game = gameRepository.findById(gameId).orElseThrow(() -> new EntityNotFoundException("Game not found"));

        user.getCart().remove(game);
        usersRepository.save(user);
    }

    @Transactional
    public List<Game> getCart(long userId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        return Collections.unmodifiableList(new ArrayList<>(user.getCart()));
    }

    @Transactional
    public void transferToPurchasedGames(Long userId, Long gameId) {
        Users user = usersRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
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
            usersRepository.save(user);
        } else {
            throw new RuntimeException("Game not in cart");
        }
    }


    @Transactional
    public List<Game> PurchasedGames(long userId){
        Users user = usersRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not Found"));
        return Collections.unmodifiableList(new ArrayList<>(user.getUser_purchased_games()));
    }

}
