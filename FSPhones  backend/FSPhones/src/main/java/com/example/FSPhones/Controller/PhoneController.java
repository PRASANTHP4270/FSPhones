package com.example.FSPhones.Controller;


import com.example.FSPhones.Model.Phone;
import com.example.FSPhones.Service.PhoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/phones")
public class PhoneController {

        private final PhoneService phoneService;

        public PhoneController(PhoneService phoneService) {
            this.phoneService = phoneService;
        }

        // Get all phones
        @GetMapping
        public List<Phone> getAllPhones() {
            return phoneService.getAllPhones();
        }

        // Get phone by ID
        @GetMapping("/{id}")
        public Phone getPhoneById(@PathVariable Long id) {
            return phoneService.getPhoneById(id);
        }

        // Add phone
        @PostMapping
        public Phone addPhone(@RequestBody Phone phone) {
            return phoneService.addPhone(phone);
        }

        // Update phone
        @PutMapping("/{id}")
        public Phone updatePhone(
                @PathVariable Long id,
                @RequestBody Phone phone) {

            return phoneService.updatePhone(id, phone);
        }

        // Delete phone
        @DeleteMapping("/{id}")
        public String deletePhone(@PathVariable Long id) {

            phoneService.deletePhone(id);

            return "Phone deleted successfully";
        }

    @PostMapping(
            value = "/with-image",
            consumes = "multipart/form-data"
    )
    public Phone addPhoneWithImage(
            @RequestParam String brand,
            @RequestParam String model,
            @RequestParam String condition,
            @RequestParam BigDecimal price,
            @RequestParam String ram,
            @RequestParam String storage,
            @RequestParam String description,
            @RequestParam MultipartFile image
    ) throws IOException {

        return phoneService.addPhoneWithImage(
                brand,
                model,
                condition,
                price,
                ram,
                storage,
                description,
                image
        );
    }

    @PutMapping(
            value = "/{id}/with-image",
            consumes = "multipart/form-data"
    )
    public Phone updatePhoneWithImage(
            @PathVariable Long id,
            @RequestParam String brand,
            @RequestParam String model,
            @RequestParam String condition,
            @RequestParam BigDecimal price,
            @RequestParam String ram,
            @RequestParam String storage,
            @RequestParam String description,
            @RequestParam MultipartFile image
    ) throws IOException {

        return phoneService.updatePhoneWithImage(
                id,
                brand,
                model,
                condition,
                price,
                ram,
                storage,
                description,
                image
        );
    }

    @GetMapping("/search")
    public List<Phone> searchPhones(
            @RequestParam String keyword) {

        return phoneService.searchPhones(keyword);
    }

    @GetMapping("/condition")
    public List<Phone> searchByCondition(
            @RequestParam String condition) {

        System.out.println("Controller received: [" + condition + "]");

        return phoneService.searchByCondition(condition);
    }


//    @PutMapping("/{id}/image")
//    public Phone updateImage(
//            @PathVariable Long id,
//            @RequestParam String imageUrl) {
//
//        return phoneService.updateImage(id, imageUrl);
//    }
    }

