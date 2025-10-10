package com.ProyectoDAW.Ecommerce.util.mappers;

import com.ProyectoDAW.Ecommerce.dto.CalificacionDTO;
import com.ProyectoDAW.Ecommerce.model.Calificacion;

import java.time.LocalDateTime;
import java.util.Objects;

public class CalificacionMapper {

    public static CalificacionDTO toDTO(Calificacion c) {
        if (c == null) {
            return null;
        }

        // Validación de relaciones obligatorias
        Objects.requireNonNull(c.getPedido(), "La Calificación debe estar asociada a un Pedido.");
        Objects.requireNonNull(c.getCliente(), "La Calificación debe tener un Cliente asociado.");

        // Manejo de Repartidor (puede ser null si el pedido fue cancelado o no asignado)
        Integer idRepartidor = c.getRepartidor() != null ? c.getRepartidor().getIdUsuario() : null;
        String nombreRepartidor = c.getRepartidor() != null ? c.getRepartidor().getNombres() : "N/A";

        // Manejo de campos opcionales que pueden ser null (puntuación, comentario, fecha)
        Short puntuacion = c.getPuntuacion();
        String comentario = c.getComentario();
        LocalDateTime fecha = c.getFecha();

        return new CalificacionDTO(
                c.getIdCalificacion(),
                c.getPedido().getIdPedido(),
                c.getCliente().getIdUsuario(),
                c.getCliente().getNombres(),
                idRepartidor,
                nombreRepartidor,
                puntuacion,
                comentario,
                fecha
        );
    }
}
