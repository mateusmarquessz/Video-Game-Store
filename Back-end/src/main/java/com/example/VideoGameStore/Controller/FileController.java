package com.example.VideoGameStore.Controller;

import com.example.VideoGameStore.Service.FileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            fileService.saveFile(file);
            return new ResponseEntity<>("Arquivo Criado com Sucesso", HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>("Erro ao salvar o arquivo.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/file")
    public ResponseEntity<String> getFile(@RequestParam String filename) {
        try {
            String base64File = fileService.getFileAsBase64(filename);
            return ResponseEntity.ok(base64File);
        } catch (IOException e) {
            return new ResponseEntity<>("Erro ao recuperar o arquivo.", HttpStatus.NOT_FOUND);
        }
    }
}
