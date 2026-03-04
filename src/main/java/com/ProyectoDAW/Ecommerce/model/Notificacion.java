package com.ProyectoDAW.Ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "TB_NOTIFICACIONES")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_NOTIFICACION")
    private Integer idNotificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_CLIENTE", nullable = false)
    private Usuario cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_PEDIDO", nullable = false)
    private Pedido pedido;

    @Column(name = "TIPO")
    private String tipo;

    @CreationTimestamp
    @Column(name = "FECHA_CREACION")
    private LocalDateTime fecha;

    @Column(name = "LEIDA")
    private boolean leida;

    @Column(name = "DESCARTADA")
    private boolean descartada;
}