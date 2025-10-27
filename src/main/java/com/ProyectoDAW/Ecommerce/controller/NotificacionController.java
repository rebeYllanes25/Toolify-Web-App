package com.ProyectoDAW.Ecommerce.controller;

import com.ProyectoDAW.Ecommerce.dto.NotificacionDTO;
import com.ProyectoDAW.Ecommerce.dto.request.FcmTokenRequest;
import com.ProyectoDAW.Ecommerce.service.NotificacionService;
import com.ProyectoDAW.Ecommerce.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

public class NotificacionController {

    @Autowired
    private NotificacionService notificacionService;

    @Autowired
    private UsuarioService usuarioService;

    // Registrar/actualizar token FCM
    @PostMapping("/fcm-token")
    public ResponseEntity<?> registrarToken(
            @RequestParam Integer usuarioId,
            @RequestBody FcmTokenRequest request
    ) {
        usuarioService.actualizarFcmToken(usuarioId, request.getToken());
        return ResponseEntity.ok(Map.of("message", "Token registrado exitosamente"));
    }

    // Eliminar token al cerrar sesión
    @DeleteMapping("/fcm-token/{usuarioId}")
    public ResponseEntity<?> eliminarToken(@PathVariable Integer usuarioId) {
        usuarioService.eliminarFcmToken(usuarioId);
        return ResponseEntity.ok(Map.of("message", "Token eliminado"));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<NotificacionDTO>> obtenerNotificaciones(
            @PathVariable Integer usuarioId
    ) {
        return ResponseEntity.ok(notificacionService.obtenerNotificacionesUsuario(usuarioId));
    }

    @PutMapping("/{id}/leer")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Integer id) {
        notificacionService.marcarComoLeida(id);
        return ResponseEntity.ok(Map.of("message", "Notificación marcada como leída"));
    }

    // Descartar/Eliminar notificación de la vista
    @DeleteMapping("/{id}")
    public ResponseEntity<?> descartarNotificacion(@PathVariable Integer id) {
        notificacionService.descartarNotificacion(id);
        return ResponseEntity.ok(Map.of("message", "Notificación descartada"));
    }

    @GetMapping("/usuario/{usuarioId}/no-leidas/count")
    public ResponseEntity<Map<String, Long>> contarNoLeidas(@PathVariable Integer usuarioId) {
        long count = notificacionService.contarNoLeidas(usuarioId);
        return ResponseEntity.ok(Map.of("count", count));
    }
}
