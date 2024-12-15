package com.example.VideoGameStore.Service;

import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Image.ImageUtils;
import com.example.VideoGameStore.Repository.GameRepository;
import com.example.VideoGameStore.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;
    @Autowired
    private UserRepository userRepository;

    public GameService() {
        this.gameRepository = gameRepository;
    }

    // Método para retornar todos os jogos com imagem em base64
    public List<Game> getAllGames() {
        List<Game> games = gameRepository.findAll();
        for (Game game : games) {
            if (game.getImage() != null) {
                String base64Image = ImageUtils.convertToBase64String(game.getImage());
                game.setImageUrl("data:image/jpeg;base64," + base64Image); // Ajuste o tipo de imagem conforme necessário
            }
        }
        return games;
    }

    // Método para retornar um jogo específico com imagem em base64
    public Game getGameById(Long id) {
        Game game = gameRepository.findById(id).orElseThrow();
        if (game.getImage() != null) {
            String base64Image = ImageUtils.convertToBase64String(game.getImage());
            game.setImageUrl("data:image/jpeg;base64," + base64Image); // Ajuste o tipo de imagem conforme necessário
        }
        return game;
    }

    //Cria Jogo
    public Game createGame(Game game, MultipartFile file) throws IOException {
        game.setCreatedAt(LocalDateTime.now());
        if (file != null && !file.isEmpty()) {
            game.setImage(file.getBytes());
        }
        return gameRepository.save(game);
    }

    //Deleta jogo pelo Id
    public ResponseEntity<Game> deleteGame(long gameId){
        gameRepository.deleteById(gameId);
        return null;
    }

//    //Update jogo pelo Id
//    public Game updateGame(long id, Game game, MultipartFile file) throws IOException{
//        Optional<Game> existingGame = gameRepository.findById(id);
//        if (existingGame.isPresent()) {
//            Game updatedGame = existingGame.get();
//            updatedGame.setName(game.getName());
//            updatedGame.setGenre(game.getGenre());
//            updatedGame.setTypeOfSupport(game.getTypeOfSupport());
//            updatedGame.setPrice(game.getPrice());
//            if (file != null && !file.isEmpty()) {
//                game.setImage(file.getBytes());
//            }
//            updatedGame.setUpdatedAt(LocalDateTime.now());
//            return gameRepository.save(updatedGame);
//        } else {
//            return null;
//        }
//    }

    @Transactional
    public Game updateGame(long id, Game game){
        Optional<Game> existingGame = gameRepository.findById(id);

        if (existingGame.isPresent()) {
            Game updatedGame = existingGame.get();

            //Atualiza campos do jogo
            updatedGame.setDescription(game.getDescription());
            updatedGame.setAgeRating(game.getAgeRating());
            updatedGame.setSystemRequirements(game.getSystemRequirements());

            return gameRepository.save(updatedGame);
        } else {
            return null;
        }
    }

}
