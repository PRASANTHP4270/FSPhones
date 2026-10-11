package com.example.FSPhones.DTO;

import com.example.FSPhones.Model.Phone;

public class PhoneMapper {

    public static PhoneDTO toDTO(Phone phone) {

        PhoneDTO dto = new PhoneDTO();

        dto.setId(phone.getId());
        dto.setBrand(phone.getBrand());
        dto.setModel(phone.getModel());
        dto.setCondition(phone.getCondition());
        dto.setPrice(phone.getPrice());
        dto.setRam(phone.getRam());
        dto.setStorage(phone.getStorage());
        dto.setDescription(phone.getDescription());
        dto.setImageUrl(phone.getImageUrl());

        return dto;
    }
}