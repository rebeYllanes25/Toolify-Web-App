package com.ProyectoDAW.Ecommerce.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Table(name = "TB_VENTA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venta {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID_VENTA")
	private Integer idVenta;
	
	@ManyToOne
	@JoinColumn(name="ID_USUARIO")
	private Usuario usuario;

    @CreationTimestamp
    @Column(name="FECHA")
	private LocalDateTime fechaRegistro;

    @Column(name="TOTAL")
	private Double total;
	
	@Column(name="ESTADO", length = 1)
	private String estado;
	
	@Column(name="TIPO_VENTA", length = 1)
	private String tipoVenta;
	
	@Column(name = "METODO_ENTREGA", length = 1)
	private String metodoEntrega;

    @Column(name = "ESPECIFICACIONES")
    private String especificaciones;
	
	@OneToMany(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<DetalleVenta> detalles = new ArrayList<>();

    @OneToOne(mappedBy = "venta", cascade = CascadeType.ALL, orphanRemoval = true)
    private Pedido pedido;

}
