package com.example.FSPhones.Config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordHashGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "Prasanth@2026";
        String hashedPassword = encoder.encode(password);

        System.out.println("BCrypt hash:");
        System.out.println(hashedPassword);
    }
}