package com.example.FSPhones.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;


@Entity
@Data
@Table(name = "phones")
public class Phone {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String brand;

        private String model;

        private String condition;

        private BigDecimal price;

        private String ram;

        private String storage;

        private String description;

        @Column(name = "image_url")
        private String imageUrl;
    }

