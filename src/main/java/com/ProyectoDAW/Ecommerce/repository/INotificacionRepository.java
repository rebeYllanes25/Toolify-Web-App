package com.ProyectoDAW.Ecommerce.repository;

import com.ProyectoDAW.Ecommerce.model.Notificacion;
import com.ProyectoDAW.Ecommerce.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface INotificacionRepository extends JpaRepository<Notificacion, Integer> {

    List<Notificacion> findByClienteAndLeidaFalseOrderByFechaDesc(Usuario cliente);

    List<Notificacion> findByClienteAndDescartadaFalseOrderByFechaDesc(Usuario cliente);

    @Query("SELECT n FROM Notificacion n WHERE n.cliente.id = :clienteId " +
            "AND n.descartada = false ORDER BY n.fecha DESC")
    Page<Notificacion> findNotificacionesByCliente(
            @Param("clienteId") Integer clienteId,
            Pageable pageable
    );

    long countByClienteAndLeidaFalse(Usuario cliente);
}
