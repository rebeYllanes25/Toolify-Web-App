package com.ProyectoDAW.Ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductoPorProveedor {

	private String razonSocial;
	private int totalProductos;
}
