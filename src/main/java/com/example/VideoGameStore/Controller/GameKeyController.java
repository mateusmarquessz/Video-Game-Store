package com.example.VideoGameStore.Controller;

import com.example.VideoGameStore.Entity.GameKey;
import com.example.VideoGameStore.Service.GameKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gamekeys")
public class GameKeyController {
    @Autowired
    private GameKeyService gameKeyService;

    @PostMapping
    public ResponseEntity<GameKey> createGameKey(@RequestBody GameKey gameKey) {
        GameKey createdGameKey = gameKeyService.createGameKey(gameKey);
        return new ResponseEntity<>(createdGameKey, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameKey> getGameKeyById(@PathVariable Long id) {
        GameKey gameKey = gameKeyService.getGameKeyById(id);
        return new ResponseEntity<>(gameKey, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<GameKey>> getAllGameKeys() {
        List<GameKey> gameKeys = gameKeyService.getAllGameKeys();
        return new ResponseEntity<>(gameKeys, HttpStatus.OK);
    }

    @GetMapping("/game/{gameId}")
    public ResponseEntity<List<GameKey>> getGameKeysByGameId(@PathVariable Long gameId) {
        List<GameKey> gameKeys = gameKeyService.getGameKeysByGameId(gameId);
        return new ResponseEntity<>(gameKeys, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGameKey(@PathVariable Long id) {
        gameKeyService.deleteGameKey(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameKey> updateGameKey(@PathVariable Long id, @RequestBody GameKey gameKey) {
        GameKey updatedGameKey = gameKeyService.updateGameKey(id, gameKey);
        return new ResponseEntity<>(updatedGameKey, HttpStatus.OK);
    }
}
