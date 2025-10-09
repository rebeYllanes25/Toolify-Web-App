package com.ProyectoDAW.Ecommerce.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_DETALLE_VENTA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleVenta {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID_DETALLE_VENTA")
	private Integer idDetalleVenta;
	
	@ManyToOne
	@JoinColumn(name="ID_VENTA")
	private Venta venta;
	
	@ManyToOne
	@JoinColumn(name="ID_PRODUCTO")
	private Producto producto;
	
	@Column(name="CANTIDAD")
	private int cantidad;
	
	@Column(name="SUB_TOTAL")
	private Double subTotal;
}

