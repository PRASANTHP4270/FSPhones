package com.example.FSPhones.Controller;

import com.example.FSPhones.Service.StorageService;
import com.example.FSPhones.Service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/storage")
public class StorageController {

    @Autowired
    private final StorageService storageService;

    public StorageController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(
            @RequestParam("image") MultipartFile image) {

        try {

            String imageUrl = storageService.uploadImage(image);

            return ResponseEntity.ok(imageUrl);

        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Image upload failed: " + e.getMessage());
        }
    }
}