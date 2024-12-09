package com.example.VideoGameStore.Controller;

import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/games")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    // Método para converter byte[] para String base64
    private String convertToBase64String(byte[] imageBytes) {
        return Base64.getEncoder().encodeToString(imageBytes);
    }

    // Busca jogo por ID
    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        Game game = gameService.getGameById(id);
        if (game.getImage() != null) {
            String base64Image = convertToBase64String(game.getImage());
            String imageUrl = "data:image/png;base64," + base64Image;
            game.setImageUrl(imageUrl);
        }
        return new ResponseEntity<>(game, HttpStatus.OK);
    }

    // Lista todos os jogos
    @GetMapping
    public ResponseEntity<List<Game>> getAllGames() {
        List<Game> games = gameService.getAllGames();
        for (Game game : games) {
            if (game.getImage() != null) {
                String base64Image = convertToBase64String(game.getImage());
                String imageUrl = "data:image/png;base64," + base64Image;
                game.setImageUrl(imageUrl);
            }
        }
        return new ResponseEntity<>(games, HttpStatus.OK);
    }

    // Deleta jogo pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Criação de Jogo com upload de imagem
    @PostMapping
    public ResponseEntity<Game> createGame(@RequestParam("name") String name,
                                           @RequestParam("genre") String genre,
                                           @RequestParam("typeOfSupport") String typeOfSupport,
                                           @RequestParam("price") Double price,
                                           @RequestParam("image") MultipartFile file) {
        try {
            Game game = new Game();
            game.setName(name);
            game.setGenre(genre);
            game.setTypeOfSupport(typeOfSupport);
            game.setPrice(price);
            Game createdGame = gameService.createGame(game, file);
            return new ResponseEntity<>(createdGame, HttpStatus.CREATED);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Atualiza jogo pelo ID com opção de atualizar a imagem
//    @PutMapping("/{id}")
//    public ResponseEntity<Game> updateGame(@PathVariable Long id,
//                                           @RequestParam("name") String name,
//                                           @RequestParam("genre") String genre,
//                                           @RequestParam("typeOfSupport") String typeOfSupport,
//                                           @RequestParam("price") Double price,
//                                           @RequestParam(value = "image", required = false) MultipartFile image) {
//        try {
//            Game existingGame = gameService.getGameById(id);
//
//            existingGame.setName(name);
//            existingGame.setGenre(genre);
//            existingGame.setTypeOfSupport(typeOfSupport);
//            existingGame.setPrice(price);
//
//            // Se uma nova imagem foi fornecida, atualiza a imagem
//            Game updatedGame = gameService.updateGame(id, existingGame, image);
//            if (updatedGame.getImage() != null) {
//                String base64Image = convertToBase64String(updatedGame.getImage());
//                String imageUrl = "data:image/png;base64," + base64Image;
//                updatedGame.setImageUrl(imageUrl);
//            }
//            return new ResponseEntity<>(updatedGame, HttpStatus.OK);
//        } catch (IOException e) {
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    //Atualiza dados do Jogo
    @PutMapping("/{id}")
    public ResponseEntity<Game> updateGame(@PathVariable Long id,@RequestBody Game updatedGame) {
        Game game = gameService.updateGame(id, updatedGame);
        return  ResponseEntity.ok(game);
    }
}
