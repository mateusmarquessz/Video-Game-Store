package com.example.VideoGameStore.Controller;

import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Repository.UserRepository;
import com.example.VideoGameStore.Roles.Role;
import com.example.VideoGameStore.SecurityConfig.TokenService;
import com.example.VideoGameStore.dto.LoginRequestDTO;
import com.example.VideoGameStore.dto.RegisterRequestDTO;
import com.example.VideoGameStore.dto.ResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(@RequestBody LoginRequestDTO body) {
        Users user = this.repository.findByEmail(body.email()).orElseThrow(() -> new RuntimeException("User not found"));
        if (passwordEncoder.matches(body.password(), user.getPassword())) {
            String token = this.tokenService.generateToken(user);

            // Retorne o papel do usuário na resposta
            return ResponseEntity.ok(new ResponseDTO(user.getUsername(), token, user.getId(), user.getRole()));
        }
        return ResponseEntity.badRequest().build();
    }


    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> register(@RequestBody RegisterRequestDTO body) {
        Optional<Users> user = this.repository.findByEmail(body.email());

        if (user.isEmpty()) {
            Users newUser = new Users();
            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setEmail(body.email());
            newUser.setUsername(body.username());

            // Define a role padrão como ROLE_USER
            newUser.setRole(Role.ROLE_USER);

            this.repository.save(newUser);
            String token = this.tokenService.generateToken(newUser);

            // Adicione a role ao ResponseDTO
            return ResponseEntity.ok(new ResponseDTO(newUser.getUsername(), token, newUser.getId(), newUser.getRole()));
        }
        return ResponseEntity.badRequest().build();
    }


}