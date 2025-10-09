package com.ProyectoDAW.Ecommerce.dto;

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
public class VentaDTO {
	private Integer idVenta;
    private UsuarioDTO usuario;
    private LocalDateTime fechaRegistro;
    private double total;
    private String estado;
    private String tipoVenta;
    private List<DetalleVentaDTO> detalles;
}
