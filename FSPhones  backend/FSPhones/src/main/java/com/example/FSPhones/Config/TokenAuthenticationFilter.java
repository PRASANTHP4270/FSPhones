package com.example.FSPhones.Config;

import com.example.FSPhones.Service.AdminSessionStore;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final AdminSessionStore adminSessionStore;

    public TokenAuthenticationFilter(AdminSessionStore adminSessionStore) {
        this.adminSessionStore = adminSessionStore;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request);

        if (token != null) {
            Authentication authentication = adminSessionStore.getAuthentication(token);
            if (authentication != null) {
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                context.setAuthentication(authentication);
                SecurityContextHolder.setContext(context);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            String token = bearer.substring(7).trim();
            if (!token.isBlank()) {
                return token;
            }
        }

        String sessionHeader = request.getHeader("X-Session-Id");
        if (sessionHeader != null && !sessionHeader.isBlank()) {
            return sessionHeader.trim();
        }

        return null;
    }
}
