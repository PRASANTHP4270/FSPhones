
package com.example.FSPhones.Config;

import java.util.List;
import java.util.function.Supplier;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private static final class SpaCsrfTokenRequestHandler
            implements CsrfTokenRequestHandler {

        private final CsrfTokenRequestHandler plain =
                new CsrfTokenRequestAttributeHandler();

        private final CsrfTokenRequestHandler xor =
                new XorCsrfTokenRequestAttributeHandler();

        SpaCsrfTokenRequestHandler() {
            ((XorCsrfTokenRequestAttributeHandler) this.xor)
                    .setCsrfRequestAttributeName(null);
        }

        @Override
        public void handle(
                HttpServletRequest request,
                HttpServletResponse response,
                Supplier<CsrfToken> csrfToken) {

            this.xor.handle(request, response, csrfToken);

            // Force token generation so the cookie can be written.
            csrfToken.get();
        }

        @Override
        public String resolveCsrfTokenValue(
                HttpServletRequest request,
                CsrfToken csrfToken) {

            String headerValue =
                    request.getHeader(csrfToken.getHeaderName());
            if (headerValue == null || headerValue.isBlank()) {
                headerValue = request.getHeader("X-XSRF-TOKEN");
            }
            if (headerValue == null || headerValue.isBlank()) {
                headerValue = request.getHeader("X-CSRF-TOKEN");
            }

            return (headerValue != null && !headerValue.isBlank()
                    ? this.plain
                    : this.xor)
                    .resolveCsrfTokenValue(request, csrfToken);
        }
    }

    @Bean
    public CsrfTokenRepository csrfTokenRepository() {
        CookieCsrfTokenRepository repository =
                CookieCsrfTokenRepository.withHttpOnlyFalse();
        repository.setCookieCustomizer(customizer -> customizer
                .sameSite("None")
                .secure(true)
                .path("/")
        );

        return repository;
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            CsrfTokenRepository csrfTokenRepository,
            SecurityContextRepository securityContextRepository,
            TokenAuthenticationFilter tokenAuthenticationFilter) throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .addFilterBefore(
                tokenAuthenticationFilter,
                org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class
            )
            .csrf(csrf -> csrf
                .csrfTokenRepository(csrfTokenRepository)
                .csrfTokenRequestHandler(
                    new SpaCsrfTokenRequestHandler()
                )
                .ignoringRequestMatchers("/auth/login")
                .ignoringRequestMatchers(request -> {
                    String auth = request.getHeader("Authorization");
                    String sess = request.getHeader("X-Session-Id");
                    return (auth != null && auth.startsWith("Bearer ")) ||
                           (sess != null && !sess.isBlank());
                })
            )
            .securityContext(context -> context
                .securityContextRepository(securityContextRepository)
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(
                    SessionCreationPolicy.IF_REQUIRED
                )
                .sessionFixation(fixation ->
                    fixation.changeSessionId()
                )
            )
            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                    HttpMethod.OPTIONS, "/**"
                ).permitAll()

                // Allow error dispatch so internal errors aren't masked as 403
                .requestMatchers(
                    "/error"
                ).permitAll()

                // Public login, CSRF token retrieval, and session verification
                .requestMatchers(
                    HttpMethod.GET, "/auth/csrf", "/auth/me"
                ).permitAll()

                .requestMatchers(
                    HttpMethod.POST, "/auth/login"
                ).permitAll()

                // Public phone viewing
                .requestMatchers(
                    HttpMethod.GET, "/phones", "/phones/**"
                ).permitAll()

                // Admin-only phone creation and image uploads
                .requestMatchers(
                    HttpMethod.POST, "/phones"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.POST, "/phones/*/with-image"
                ).hasRole("ADMIN")

                // Admin-only phone updates and deletion
                .requestMatchers(
                    HttpMethod.PUT, "/phones/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.PATCH, "/phones/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    HttpMethod.DELETE, "/phones/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                    "/admin/**"
                ).hasRole("ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
            "https://fsphones-frontend.onrender.com",
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        ));

        configuration.setAllowCredentials(true);

        configuration.setAllowedMethods(List.of(
            "GET", "POST", "PUT", "PATCH",
            "DELETE", "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of(
            "Content-Type",
            "X-XSRF-TOKEN",
            "X-CSRF-TOKEN",
            "Authorization",
            "X-Session-Id",
            "Accept"
        ));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**", configuration
        );

        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }
}
