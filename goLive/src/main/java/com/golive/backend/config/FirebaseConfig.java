package com.golive.backend.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initFirebase() {
        try {
            InputStream serviceAccount = getClass()
                    .getClassLoader()
                    .getResourceAsStream("firebase/firebase-config.json");

            if (serviceAccount == null) {
                throw new RuntimeException(" Firebase config file not found.");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            FirebaseApp.initializeApp(options);
            System.out.println("✅ Firebase initialized successfully.");

        } catch (Exception e) {
            throw new RuntimeException(" Failed to initialize Firebase", e);
        }
    }
}
