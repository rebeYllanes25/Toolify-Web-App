package com.ProyectoDAW.Ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class PerfilDetalleComprasDto {
	
		private Integer idUser;
		private String nombresCompletos;
		private String correo;
		private String nroDoc;
		private String direccion;
		private String distrito;
		private String telefono;
		private String fechaRegistro;
		private String productoMasComprado;
		private String fechaMayorCompras;
		private Long totalDeProductosComprados;
		private Double gastoTotal;
		private String categoriaMasComprada;
		private Long totalVentas;
}
