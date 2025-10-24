package com.ProyectoDAW.Ecommerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ProyectoDAW.Ecommerce.model.DetalleVenta;

public interface IDetalleVentaRepository extends JpaRepository<DetalleVenta, Integer>{
    List<DetalleVenta> findByVenta_IdVenta(Integer idVenta);
}
