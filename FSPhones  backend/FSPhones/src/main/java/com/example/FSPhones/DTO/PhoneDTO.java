package com.example.FSPhones.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PhoneDTO {

    private Long id;
    private String brand;
    private String model;
    private String condition;
    private BigDecimal price;
    private String ram;
    private String storage;
    private String description;
    private String imageUrl;
}