package com.ProyectoDAW.Ecommerce.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter

public class VentaFiltroFechaTipoUsuario {

	private Integer idVenta;
	private String nombresCompletos;
	private String direccionUser;
	private LocalDate fecha;
	private Double total;
	private String estado;
	private String tipoVenta;
	
	
	public VentaFiltroFechaTipoUsuario(
            Integer idVenta,
            String nombresCompletos,
            String direccionUser,
            LocalDateTime fechaRegistro,  
            Double total,
            String estado,
            String tipoVenta
    ) {
        this.idVenta = idVenta;
        this.nombresCompletos = nombresCompletos;
        this.direccionUser = direccionUser;
        this.fecha = fechaRegistro.toLocalDate();
        this.total = total;
        this.estado = estado;
        this.tipoVenta = tipoVenta;
    }
}


