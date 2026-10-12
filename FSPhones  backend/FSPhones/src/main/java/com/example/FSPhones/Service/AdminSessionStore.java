package com.example.FSPhones.Service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AdminSessionStore {

    public static class SessionRecord {
        private final Authentication authentication;
        private final Instant createdAt;

        public SessionRecord(Authentication authentication) {
            this.authentication = authentication;
            this.createdAt = Instant.now();
        }

        public Authentication getAuthentication() {
            return authentication;
        }

        public Instant getCreatedAt() {
            return createdAt;
        }
    }

    private final Map<String, SessionRecord> store = new ConcurrentHashMap<>();

    public String createToken(Authentication authentication) {
        String token = UUID.randomUUID().toString();
        store.put(token, new SessionRecord(authentication));
        return token;
    }

    public void store(String token, Authentication authentication) {
        if (token != null && !token.isBlank() && authentication != null) {
            store.put(token, new SessionRecord(authentication));
        }
    }

    public Authentication getAuthentication(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        SessionRecord record = store.get(token);
        if (record == null) {
            return null;
        }
        return record.getAuthentication();
    }

    public void remove(String token) {
        if (token != null) {
            store.remove(token);
        }
    }
}
