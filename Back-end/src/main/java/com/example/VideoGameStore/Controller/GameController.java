package com.example.VideoGameStore.Controller;

import com.example.VideoGameStore.Entity.Game;
import com.example.VideoGameStore.Service.FileService;
import com.example.VideoGameStore.Service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/games")
@CrossOrigin(origins = "*")
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private FileService fileService;

    @PostMapping
    public ResponseEntity<Game> createGame(@RequestParam("name") String name,
                                           @RequestParam("genre") String genre,
                                           @RequestParam("typeOfSupport") String typeOfSupport,
                                           @RequestParam("price") Double price,
                                           @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Game game = new Game();
            game.setName(name);
            game.setGenre(genre);
            game.setTypeOfSupport(typeOfSupport);
            game.setPrice(price);

            if (image != null && !image.isEmpty()) {
                String imageUrl = fileService.saveFile(image);
                game.setImageUrl(imageUrl);
            }

            Game createdGame = gameService.createGame(game);
            return new ResponseEntity<>(createdGame, HttpStatus.CREATED);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Game> getGameById(@PathVariable Long id) {
        Game game = gameService.getGameById(id);
        return new ResponseEntity<>(game, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Game>> getAllGames() {
        List<Game> games = gameService.getAllGames();
        return new ResponseEntity<>(games, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        gameService.deleteGame(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> updateGame(@PathVariable Long id,
                                           @RequestParam("name") String name,
                                           @RequestParam("genre") String genre,
                                           @RequestParam("typeOfSupport") String typeOfSupport,
                                           @RequestParam("price") Double price,
                                           @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Game existingGame = gameService.getGameById(id);

            existingGame.setName(name);
            existingGame.setGenre(genre);
            existingGame.setTypeOfSupport(typeOfSupport);
            existingGame.setPrice(price);

            if (image != null && !image.isEmpty()) {
                String imageUrl = fileService.saveFile(image);
                existingGame.setImageUrl(imageUrl);
            }

            Game updatedGame = gameService.updateGame(id, existingGame);
            return new ResponseEntity<>(updatedGame, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(params = {"category", "platform"})
    public ResponseEntity<List<Game>> getAllGames(
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) List<String> platform,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        List<Game> games = gameService.getFilteredGames(category, platform, minPrice, maxPrice);
        return new ResponseEntity<>(games, HttpStatus.OK);
    }

}
