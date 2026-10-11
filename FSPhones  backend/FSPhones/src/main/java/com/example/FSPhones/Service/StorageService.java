package com.example.FSPhones.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class StorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.key}")
    private String supabaseKey;

    @Value("${supabase.bucket}")
    private String bucket;

    private final RestTemplate restTemplate = new RestTemplate();

    public String uploadImage(MultipartFile file) throws IOException {

        String fileName = UUID.randomUUID() + "-" + file.getOriginalFilename();

        String uploadUrl = supabaseUrl
                + "/storage/v1/object/"
                + bucket
                + "/"
                + fileName;

        HttpHeaders headers = new HttpHeaders();

        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.setContentType(
                MediaType.parseMediaType(file.getContentType())
        );

        HttpEntity<byte[]> request = new HttpEntity<>(
                file.getBytes(),
                headers
        );

        restTemplate.exchange(
                uploadUrl,
                HttpMethod.POST,
                request,
                String.class
        );

        return supabaseUrl
                + "/storage/v1/object/public/"
                + bucket
                + "/"
                + fileName;
    }

    public void deleteImage(String imageUrl) {

        System.out.println("IMAGE URL TO DELETE: " + imageUrl);

        String fileName = imageUrl.substring(
                imageUrl.lastIndexOf("/") + 1
        );

        String deleteUrl = supabaseUrl
                + "/storage/v1/object/"
                + bucket
                + "/"
                + fileName;

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseKey);
        headers.set("Authorization", "Bearer " + supabaseKey);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        restTemplate.exchange(
                deleteUrl,
                HttpMethod.DELETE,
                request,
                String.class
        );
    }
}