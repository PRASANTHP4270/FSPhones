package com.example.FSPhones.Config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpServletResponseWrapper;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class PartitionedCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        HttpServletResponseWrapper responseWrapper = new HttpServletResponseWrapper(response) {
            @Override
            public void addHeader(String name, String value) {
                super.addHeader(name, appendPartitioned(name, value));
            }

            @Override
            public void setHeader(String name, String value) {
                super.setHeader(name, appendPartitioned(name, value));
            }

            private String appendPartitioned(String name, String value) {
                if ("Set-Cookie".equalsIgnoreCase(name) && value != null) {
                    if (value.toLowerCase().contains("samesite=none") && !value.toLowerCase().contains("partitioned")) {
                        return value + "; Partitioned";
                    }
                }
                return value;
            }
        };

        filterChain.doFilter(request, responseWrapper);
    }
}
