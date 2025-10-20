package com.ProyectoDAW.Ecommerce.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ProyectoDAW.Ecommerce.model.Rol;

public interface IRolRepository extends JpaRepository<Rol, Integer>{
    Optional<Rol> findByDescripcion(String nombre);

}
