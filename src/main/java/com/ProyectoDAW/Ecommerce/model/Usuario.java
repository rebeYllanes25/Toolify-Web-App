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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "TB_USUARIO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID_USUARIO")
	private Integer idUsuario;
	
	@Column(name="NOMBRES")
	private String nombres;
	
	@Column(name="APE_MATERNO")
	private String apeMaterno;
	
	@Column(name="APE_PATERNO")
	private String apePaterno;
	
	@Column(name="CORREO")
	private String correo;
	
	@Column(name="CLAVE")
	private String clave;
	
	@Column(name="NRO_DOC")
	private String nroDocumento;
	
	@Column(name="DIRECCION")
	private String direccion;
	
	@ManyToOne
	@JoinColumn(name="ID_DISTRITO")
	private Distrito distrito;
	
	@Column(name="TELEFONO")
	private String telefono;
	
	@ManyToOne
	@JoinColumn(name="ROL")
	private Rol rol;
	
	@Column(name="FECHA_REGISTRO")
	private LocalDateTime fechaRegistro;
	
	@Column(name="ESTADO")
	private Boolean estado;
}
