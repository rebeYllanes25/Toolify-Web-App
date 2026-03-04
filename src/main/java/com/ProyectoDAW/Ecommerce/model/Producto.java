package com.ProyectoDAW.Ecommerce.model;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_PRODUCTO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID_PRODUCTO")
	private Integer idProducto;
	
	@Column(name="NOMBRE")
	private String nombre;
	
	@Column(name="DESCRIPCION")
	private String descripcion;
	
	@ManyToOne
	@JoinColumn(name="ID_PROVEEDOR")
	private Proveedor proveedor;
	
	@ManyToOne
	@JoinColumn(name="ID_CATEGORIA")
	private Categoria categoria;

	@Column(name="PRECIO")
	private Double precio;
	
	@Column(name="STOCK")
	private Integer stock;

	
	@Column(name="IMAGEN")
	private String imagen;
	
	@JsonIgnore 
	@Transient
	private MultipartFile imagenUrl;
	
	/*	@Transient
	private String base64Img;
	*/
	
	@Column(name="FECHA_REGISTRO")
	private LocalDateTime fechaRegistro;
	
	@Column(name="ESTADO")
	private Boolean estado;
}
