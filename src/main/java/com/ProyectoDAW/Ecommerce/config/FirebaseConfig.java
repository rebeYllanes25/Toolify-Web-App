package com.ProyectoDAW.Ecommerce.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            String firebaseConfig = System.getenv("FIREBASE_CONFIG_JSON");

            System.out.println("FIREBASE CONFIG: " + (firebaseConfig != null ? "Cargado" : "NULL"));

            if (firebaseConfig == null) {
                throw new RuntimeException("FIREBASE_CONFIG_JSON es NULL");
            }

            
            byte[] decodeBytes = java.util.Base64.getDecoder().decode(firebaseConfig);
            ByteArrayInputStream stream = new ByteArrayInputStream(decodeBytes);
            
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(stream))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase INITIALIZADO correctamente");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
