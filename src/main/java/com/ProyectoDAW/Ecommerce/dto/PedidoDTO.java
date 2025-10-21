package com.ProyectoDAW.Ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Integer idVenta;
    private Integer idPedido;
    private String numPedido;
    private Integer idCliente;
    private String nomCliente;
    private LocalDateTime fecha;
    private Double total;
    private String direccionEntrega;
    private BigDecimal latitud;
    private BigDecimal longitud;
    private String movilidad;
    private List<DetalleVentaDTO> detalles;
    private Integer idRepartidor;
    private String nomRepartidor;
    private String especificaciones;
    private String estado;
}

