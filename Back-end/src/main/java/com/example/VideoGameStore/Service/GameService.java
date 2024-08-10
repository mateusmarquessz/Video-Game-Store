package com.example.VideoGameStore.Service;

import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Entity.Users;
import com.example.VideoGameStore.Repository.GameRepository;
import com.example.VideoGameStore.Resource.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;
    public GameService() {
        this.gameRepository = gameRepository;
    }

    //Cria Jogo
    public Game createGame (Game game){
        return gameRepository.save(game);
    }

    //Lista todos os jogos
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    //Lista jogos por Id
    public Game getGameById(Long id) {
        return gameRepository.findById(id).orElseThrow();
    }

    //Cria Jogo
    public Game CreateGame(Game game) {
        game.setCreatedAt(LocalDateTime.now());
        return gameRepository.save(game);
    }

    //Deleta jogo pelo Id
    public ResponseEntity<Game> deleteGame(long gameId){
        gameRepository.deleteById(gameId);
        return null;
    }

    //Update jogo pelo Id
    public Game updateGame(long id, Game game) {
        Optional<Game> existingGame = gameRepository.findById(id);
        if (existingGame.isPresent()) {
            Game updatedGame = existingGame.get();
            updatedGame.setName(game.getName());
            updatedGame.setGenre(game.getGenre());
            updatedGame.setTypeOfSupport(game.getTypeOfSupport());
            updatedGame.setPrice(game.getPrice());
            updatedGame.setUpdatedAt(LocalDateTime.now());
            return gameRepository.save(updatedGame);
        } else {
            return null;
        }
    }
}
