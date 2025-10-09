package com.ProyectoDAW.Ecommerce.model;

import java.time.LocalDateTime;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_PROVEEDOR")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Proveedor {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID_PROVEEDOR")
	private Integer idProveedor;
	
	@Pattern(regexp = "\\d{11}", message = "El RUC debe ser 11 Digitos")
	@Column(name="RUC")
	private String ruc;
	
	@NotBlank(message = "Ingrese la Razon Social")
	@Column(name="RAZON_SOCIAL")
	private String razonSocial;
	
	@Column(name="TELEFONO")
	private String telefono;

	@NotBlank(message = "Ingrese la Direccion")
	@Column(name="DIRECCION")
	private String direccion;
	
	@ManyToOne
	@JoinColumn(name="ID_DISTRITO")
	private Distrito distrito;
	
	@Column(name="FECHA_REGISTRO")
	private LocalDateTime fechaRegistro;
	
	@Column(name="ESTADO")
	private Boolean estado;
}
