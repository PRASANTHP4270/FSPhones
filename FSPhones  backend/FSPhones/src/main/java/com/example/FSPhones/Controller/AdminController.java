package com.example.FSPhones.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    @GetMapping("/admin/check")
    public String checkAdmin() {
        return "Admin authenticated successfully";
    }
}