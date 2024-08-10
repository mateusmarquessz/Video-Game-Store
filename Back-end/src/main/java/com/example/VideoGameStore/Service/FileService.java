package com.example.VideoGameStore.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@Service
public class FileService {

    private final Path rootLocation = Paths.get("");

    public String saveFile(MultipartFile file) throws IOException {
        // Cria o diretório se não existir
        if (!Files.exists(rootLocation)) {
            Files.createDirectories(rootLocation);
        }

        Path filePath = this.rootLocation.resolve(file.getOriginalFilename());
        Files.copy(file.getInputStream(), filePath);
        return filePath.toString();
    }

    public String getFileAsBase64(String filename) throws IOException {
        Path filePath = this.rootLocation.resolve(filename);
        if (!Files.exists(filePath)) {
            throw new IOException("File not found: " + filename);
        }

        byte[] fileBytes = Files.readAllBytes(filePath);
        String base64Encoded = Base64.getEncoder().encodeToString(fileBytes);

        // Determina o tipo MIME com base na extensão do arquivo
        String mimeType = Files.probeContentType(filePath);
        if (mimeType == null) {
            mimeType = "application/octet-stream"; // Tipo padrão se não for possível determinar
        }

        return "data:" + mimeType + ";base64," + base64Encoded;
    }
}
