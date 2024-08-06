package com.example.VideoGameStore.Service;

import com.example.VideoGameStore.Entity.GameKey;
import com.example.VideoGameStore.Repository.GameKeyRepository;
import com.example.VideoGameStore.Resource.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameKeyService {
    @Autowired
    private GameKeyRepository gameKeyRepository;

    public GameKey createGameKey(GameKey gameKey) {
        return gameKeyRepository.save(gameKey);
    }

    public GameKey getGameKeyById(Long id) {
        return gameKeyRepository.findById(id).orElseThrow();
    }

    public List<GameKey> getAllGameKeys() {
        return gameKeyRepository.findAll();
    }

    public List<GameKey> getGameKeysByGameId(Long gameId) {
        return gameKeyRepository.findByGameId(gameId);
    }

    public void deleteGameKey(Long id) {
        gameKeyRepository.deleteById(id);
    }

    public GameKey updateGameKey(Long id, GameKey gameKeyDetails) {
        GameKey gameKey = gameKeyRepository.findById(id).orElseThrow();
        gameKey.setKeyCode(gameKeyDetails.getKeyCode());
        gameKey.setActive(gameKeyDetails.isActive());
        gameKey.setGame(gameKeyDetails.getGame());
        return gameKeyRepository.save(gameKey);
    }
}

