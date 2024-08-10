package com.example.VideoGameStore.Controller;

import com.example.VideoGameStore.Service.FileService;
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
        return ResponseEntity.ok("Arquivo Criado com Sucesso");
    }

    @GetMapping("/file")
    public String getFile(@RequestParam String filename) {
        try {
            return fileService.getFileAsBase64(filename);
        } catch (IOException e) {
            e.printStackTrace();
            return "Erro ao recuperar o arquivo.";
        }
    }
}
