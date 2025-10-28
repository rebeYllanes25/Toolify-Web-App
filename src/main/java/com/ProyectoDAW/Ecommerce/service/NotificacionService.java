package com.ProyectoDAW.Ecommerce.service;

import com.ProyectoDAW.Ecommerce.dto.NotificacionDTO;
import com.ProyectoDAW.Ecommerce.model.Notificacion;
import com.ProyectoDAW.Ecommerce.model.Pedido;
import com.ProyectoDAW.Ecommerce.model.Usuario;
import com.ProyectoDAW.Ecommerce.repository.INotificacionRepository;
import com.ProyectoDAW.Ecommerce.repository.IUsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificacionService {

    private final INotificacionRepository notificacionRepository;
    private final FcmService fcmService;
    private final IUsuarioRepository usuarioRepository;

    @Transactional
    public Notificacion crearYEnviarNotificacion(
            Usuario cliente,
            Pedido pedido,
            String tipo
    ) {

    	String titulo = generarTitulo(tipo, pedido.getNumPedido());
        String mensaje = generarMensaje(tipo, pedido.getNumPedido());

        // Crear el registro en BD
        Notificacion notificacion = new Notificacion();
        notificacion.setCliente(cliente);
        notificacion.setPedido(pedido);
        notificacion.setTipo(tipo);
        notificacion.setLeida(false);
        notificacion.setDescartada(false);

        Notificacion saved = notificacionRepository.save(notificacion);

        // Enviar notificación push si el usuario tiene token
        if (cliente.getFcmToken() != null && !cliente.getFcmToken().isEmpty()) {
            Map<String, String> data = new HashMap<>();
            data.put("notificacionId", saved.getIdNotificacion().toString());
            data.put("pedidoId", pedido.getNumPedido());
            data.put("tipo", tipo);
            data.put("clienteId", cliente.getIdUsuario().toString());

            fcmService.enviarNotificacionPush(
                    cliente.getFcmToken(),
                    titulo,
                    mensaje,
                    data
            );
        }

        log.info("Notificación creada y enviada: {} para pedido {}", tipo, pedido.getIdPedido());
        return saved;
    }

    public List<NotificacionDTO> obtenerNotificacionesUsuario(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return notificacionRepository
                .findByClienteAndDescartadaFalseOrderByFechaDesc(usuario)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void marcarComoLeida(Integer notificacionId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        notificacion.setLeida(true);
        notificacionRepository.save(notificacion);
    }

    @Transactional
    public void descartarNotificacion(Integer notificacionId) {
        Notificacion notificacion = notificacionRepository.findById(notificacionId)
                .orElseThrow(() -> new RuntimeException("Notificación no encontrada"));
        notificacion.setDescartada(true);
        notificacionRepository.save(notificacion);
    }

    public long contarNoLeidas(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return notificacionRepository.countByClienteAndLeidaFalse(usuario);
    }

    private NotificacionDTO convertirADTO(Notificacion n) {
        String titulo = generarTitulo(n.getTipo(), n.getPedido().getNumPedido());
        String mensaje = generarMensaje(n.getTipo(), n.getPedido().getNumPedido());

        return new NotificacionDTO(
                n.getIdNotificacion(),
                n.getTipo(),
                titulo,
                mensaje,
                n.getFecha(),
                n.isLeida(),
                n.getPedido().getIdPedido(),
                n.getCliente().getIdUsuario()
        );
    }

    private String generarTitulo(String tipo, String nrodPedido) {
        return switch (tipo) {
            case "PEDIDO_PENDIENTE" ->
                    "Su pedido " + nrodPedido + " está pendiente";
            case "PEDIDO_ACEPTADO" ->
                    "¡Su pedido " + nrodPedido + " fue aceptado!";
            case "PEDIDO_EN_CAMINO" ->
                    "¡Su pedido " + nrodPedido + " está en camino!";
            case "PEDIDO_CERCA" ->
                    "Su pedido " + nrodPedido + " está cerca. ¡Prepárate!";
            case "PEDIDO_ENTREGADO" ->
                    "¡Tu pedido " + nrodPedido + " fue entregado exitosamente!";
            case "PEDIDO_FALLIDO" ->
                    "Tu pedido " + nrodPedido + " fue cancelado";
            default -> "Notificación del pedido " + nrodPedido;
        };
    }

    private String generarMensaje(String tipo, String nrodPedido) {
        return switch (tipo) {
            case "PEDIDO_PENDIENTE" ->
                    "Su pedido está pendiente, por favor verifique el estado en \"Pedidos\".";
            case "PEDIDO_ACEPTADO" ->
                    "Su pedido fue aceptado y se está empaquetando, verifique el estado en \"Pedidos\".";
            case "PEDIDO_EN_CAMINO" ->
                    "Nuestro repartidor se encamina con su pedido, verifique en \"Pedidos\" el estado.";
            case "PEDIDO_CERCA" ->
                    "Su pedido está cerca al destino, favor de ponerse en contacto con nuestro repartidor";
            case "PEDIDO_ENTREGADO" ->
                    "La entrega de su pedido se completó correctamente, diríjase a historial para más información";
            case "PEDIDO_FALLIDO" ->
                    "El pedido realizado fue cancelado debido a fallas técnicas, favor de contactarnos para más detalles.";
            default -> "Actualización de tu pedido";
        };
    }
}
