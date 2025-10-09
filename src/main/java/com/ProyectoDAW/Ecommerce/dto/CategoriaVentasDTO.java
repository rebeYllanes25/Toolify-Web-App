package com.ProyectoDAW.Ecommerce.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class CategoriaVentasDTO {
	private Integer idCategoria;
	private String descripcionCategoria;
    private Long cantidadVendida;
    private Long cantidadProductos;
}
