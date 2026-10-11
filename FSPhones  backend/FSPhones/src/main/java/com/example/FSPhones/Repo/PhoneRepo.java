package com.example.FSPhones.Repo;

import com.example.FSPhones.Model.Phone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhoneRepo extends JpaRepository<Phone,Long> {
    List<Phone> findByBrandContainingIgnoreCase(String brand);

    List<Phone> findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(
            String brand,
            String model
    );

    @Query("SELECT p FROM Phone p WHERE p.condition = :condition")
    List<Phone> findPhonesByCondition(@Param("condition") String condition);
}
