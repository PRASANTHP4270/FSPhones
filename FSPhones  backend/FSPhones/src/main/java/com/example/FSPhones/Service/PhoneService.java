package com.example.FSPhones.Service;

import com.example.FSPhones.Model.Phone;
import com.example.FSPhones.Repo.PhoneRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@Service

public class PhoneService {

        private final PhoneRepo phoneRepository;

    private final StorageService storageService;

        public PhoneService(PhoneRepo phoneRepository, StorageService storageService) {
            this.phoneRepository = phoneRepository;
            this.storageService = storageService;
        }

        // Get all phones
        public List<Phone> getAllPhones() {
            return phoneRepository.findAll();
        }

        // Get phone by ID
        public Phone getPhoneById(Long id) {
            return phoneRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Phone not found"));
        }

        // Add phone
        public Phone addPhone(Phone phone) {
            return phoneRepository.save(phone);
        }

        // Update phone
        public Phone updatePhone(Long id, Phone phone) {

            Phone existingPhone = phoneRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Phone not found"));

            if (phone.getBrand() != null) {
                existingPhone.setBrand(phone.getBrand());
            }

            if (phone.getModel() != null) {
                existingPhone.setModel(phone.getModel());
            }

            if (phone.getCondition() != null) {
                existingPhone.setCondition(phone.getCondition());
            }

            if (phone.getPrice() != null) {
                existingPhone.setPrice(phone.getPrice());
            }

            if (phone.getRam() != null) {
                existingPhone.setRam(phone.getRam());
            }

            if (phone.getStorage() != null) {
                existingPhone.setStorage(phone.getStorage());
            }

            if (phone.getDescription() != null) {
                existingPhone.setDescription(phone.getDescription());
            }

            return phoneRepository.save(existingPhone);
        }

        // Delete phone
        public void deletePhone(Long id) {

            Phone phone = phoneRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Phone not found"));

            if (phone.getImageUrl() != null &&
                    !phone.getImageUrl().isBlank()) {

                storageService.deleteImage(phone.getImageUrl());
            }

            phoneRepository.delete(phone);
        }

    public Phone addPhoneWithImage(
            String brand,
            String model,
            String condition,
            BigDecimal price,
            String ram,
            String storage,
            String description,
            MultipartFile image
    ) throws IOException {

        String imageUrl = storageService.uploadImage(image);

        Phone phone = new Phone();

        phone.setBrand(brand);
        phone.setModel(model);
        phone.setCondition(condition);
        phone.setPrice(price);
        phone.setRam(ram);
        phone.setStorage(storage);
        phone.setDescription(description);
        phone.setImageUrl(imageUrl);

        return phoneRepository.save(phone);
    }

    public Phone updatePhoneWithImage(
            Long id,
            String brand,
            String model,
            String condition,
            BigDecimal price,
            String ram,
            String storage,
            String description,
            MultipartFile image
    ) throws IOException {

        Phone existingPhone = phoneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Phone not found"));

        // Save old image URL
        String oldImageUrl = existingPhone.getImageUrl();

        // Upload new image
        String newImageUrl = storageService.uploadImage(image);

        // Update phone details
        existingPhone.setBrand(brand);
        existingPhone.setModel(model);
        existingPhone.setCondition(condition);
        existingPhone.setPrice(price);
        existingPhone.setRam(ram);
        existingPhone.setStorage(storage);
        existingPhone.setDescription(description);

        // Update image URL
        existingPhone.setImageUrl(newImageUrl);

        // Delete old image
        if (oldImageUrl != null) {
            storageService.deleteImage(oldImageUrl);
        }

        return phoneRepository.save(existingPhone);
    }


    public List<Phone> searchPhones(String keyword) {

        return phoneRepository
                .findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(
                        keyword,
                        keyword
                );
    }

    public List<Phone> searchByCondition(String condition) {

        System.out.println("Condition received: [" + condition + "]");

        return phoneRepository.findPhonesByCondition(condition);
    }


//    public Phone updateImage(Long id, String imageUrl) {
//
//        if (imageUrl == null || imageUrl.isBlank()) {
//            throw new RuntimeException("Image URL cannot be empty");
//        }
//
//        Phone existingPhone = phoneRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Phone not found"));
//
//        existingPhone.setImageUrl(imageUrl);
//
//        return phoneRepository.save(existingPhone);
//    }


    }

