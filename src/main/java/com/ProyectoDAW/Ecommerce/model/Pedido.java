package com.ProyectoDAW.Ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TB_PEDIDO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PEDIDO")
    private Integer idPedido;

    @OneToOne
    @JoinColumn(name = "ID_VENTA")
    private Venta venta;

    @CreationTimestamp
    @Column(name = "FECHA_CREACION")
    private LocalDateTime fecha;

    @Column(name = "DIRECCION_ENTREGA")
    private String direccionEntrega;

    @Column(name = "LATITUD")
    private BigDecimal latitud;

    @Column(name = "LONGITUD")
    private BigDecimal longitud;

    @Column(name = "NUMERO_PEDIDO")
    private String numPedido;

    @Column(name = "QR_VERIFICATION_CODE")
    private String qrVerificacion;

    @ManyToOne
    @JoinColumn(name="ID_REPARTIDOR")
    private Usuario repartidor;

    @Column(name = "MOVILIDAD")
    private String movilidad;

    @Column(name = "FECHA_ASIGNACION")
    private LocalDateTime fechaAsignacion;

    @Column(name = "FECHA_EN_CAMINO")
    private LocalDateTime fechaEnCamino;

    @Column(name = "FECHA_ENTREGA")
    private LocalDateTime fechaEntregado;

    @Column(name = "TIEMPO_ENTREGA_MINUTOS")
    private Short tiempoEntrega;

    @Column(name = "ESTADO")
    private String estado;

    @Column(name = "OBSERVACIONES")
    private String observaciones;
}
