package com.ProyectoDAW.Ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class NotificacionDTO {
    private Integer id;
    private String tipo;
    private String titulo;
    private String mensaje;
    private LocalDateTime fecha;
    private boolean leida;
    private Integer idPedido;
    private Integer idCliente;
}
