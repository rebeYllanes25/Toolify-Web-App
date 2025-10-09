package com.ProyectoDAW.Ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "TB_CALIFICACION")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Calificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_CALIFICACION")
    private Integer idCalificacion;

    @OneToOne
    @JoinColumn(name = "ID_PEDIDO")
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name="ID_CLIENTE")
    private Usuario cliente;

    @ManyToOne
    @JoinColumn(name="ID_REPARTIDOR")
    private Usuario repartidor;

    @Column(name = "PUNTUACION")
    private Short puntuacion;

    @Column(name = "COMENTARIO")
    private String comentario;

    @Column(name = "FECHA_CALIFICACION")
    private LocalDateTime fecha;

}
