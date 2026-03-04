package com.ProyectoDAW.Ecommerce.service;

import com.google.firebase.messaging.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class FcmService {

    public void enviarNotificacionPush(String token, String titulo, String cuerpo, Map<String, String> data) {
        try {
            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(Notification.builder()
                            .setTitle(titulo)
                            .setBody(cuerpo)
                            .build())
                    .putAllData(data != null ? data : new HashMap<>())
                    .setAndroidConfig(AndroidConfig.builder()
                            .setPriority(AndroidConfig.Priority.HIGH)
                            .setNotification(AndroidNotification.builder()
                                    .setSound("default")
                                    .setColor("#FF0000")
                                    .build())
                            .build())
                    .build();

            String response = FirebaseMessaging.getInstance().send(message);
            log.info("Notificación enviada exitosamente: {}", response);

        } catch (FirebaseMessagingException e) {
            log.error("Error al enviar notificación push: {}", e.getMessage());
            // Si el token es inválido, podrías marcarlo en la BD
            if (e.getErrorCode().equals("INVALID_ARGUMENT") ||
                    e.getErrorCode().equals("UNREGISTERED")) {
                // Marcar token como inválido
            }
        }
    }

    public void enviarNotificacionMultiple(List<String> tokens, String titulo, String cuerpo) {
        try {
            MulticastMessage message = MulticastMessage.builder()
                    .addAllTokens(tokens)
                    .setNotification(Notification.builder()
                            .setTitle(titulo)
                            .setBody(cuerpo)
                            .build())
                    .build();

            BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);
            log.info("{} notificaciones enviadas de {}",
                    response.getSuccessCount(), tokens.size());

        } catch (FirebaseMessagingException e) {
            log.error("Error al enviar notificaciones: {}", e.getMessage());
        }
    }
}
