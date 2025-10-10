package com.ProyectoDAW.Ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CalificacionDTO {
    private Integer idCalificacion;
    private Integer idPedido;
    private Integer idCliente;
    private String nombreCliente;
    private Integer idRepartidor;
    private String nombreRepartidor;
    private Short puntuacion;
    private String comentario;
    private LocalDateTime fechaCalificacion;
}
