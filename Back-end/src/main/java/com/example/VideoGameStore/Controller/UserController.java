package com.example.VideoGameStore.Controller;

import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Repository.UsersRepository;
import com.example.VideoGameStore.Service.UserService;
import org.hibernate.sql.Update;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/listar")
   public ResponseEntity<List<Users>> getUsers() {
        var users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public Optional<Users> getUserById(@PathVariable long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/register")
    public ResponseEntity<Users> createUser(@RequestBody Users user) {
        Users CreateUser = userService.CreateUser(user);
        return ResponseEntity.ok(CreateUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Users> deleteUser(@PathVariable long id) {
        return  userService.deleteUser(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Users> updateUser(@PathVariable long id, @RequestBody Users user) {
        Users updatedUser = userService.updateUser(id, user);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
