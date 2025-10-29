package com.ProyectoDAW.Ecommerce.repository;

import com.ProyectoDAW.Ecommerce.model.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ICalificacionRepository extends JpaRepository<Calificacion, Integer> {

    Optional<Calificacion> findByPedidoIdPedido(Integer idPedido);

    boolean existsByPedidoIdPedido(Integer idPedido);
    
    @Query("SELECT AVG(c.puntuacion) FROM Calificacion c WHERE c.repartidor.idUsuario = :idRepartidor")
    Double obtenerPromedioRepartidor(@Param("idRepartidor") Integer idRepartidor);
    
    
 
}
