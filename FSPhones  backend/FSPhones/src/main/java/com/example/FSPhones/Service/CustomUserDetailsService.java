
package com.example.FSPhones.Service;

import com.example.FSPhones.Model.AdminUser;
import com.example.FSPhones.Repo.AdminUserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    public CustomUserDetailsService(
            AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        AdminUser admin = adminUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Admin not found"));

        String role = admin.getRole();
        if (role != null && role.toUpperCase().startsWith("ROLE_")) {
            role = role.substring(5);
        }

        return User.withUsername(admin.getUsername())
                .password(admin.getPassword())
                .roles(role != null && !role.isBlank() ? role.toUpperCase() : "ADMIN")
                .build();
    }
}
