package com.ProyectoDAW.Ecommerce.repository;

import com.ProyectoDAW.Ecommerce.model.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ICalificacionRepository extends JpaRepository<Calificacion, Integer> {

    Optional<Calificacion> findByPedidoIdPedido(Integer idPedido);

    boolean existsByPedidoIdPedido(Integer idPedido);
}
