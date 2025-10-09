package com.ProyectoDAW.Ecommerce.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



import java.util.*;

import com.ProyectoDAW.Ecommerce.model.Proveedor;


public interface IProveedorRepository extends JpaRepository<Proveedor, Integer>{

	@Query("SELECT p FROM Proveedor p where p.estado = TRUE")
	List<Proveedor> findProveedoresActivos();

	@Query("SELECT p FROM Proveedor p where p.ruc LIKE CONCAT ('%', :ruc,'%')")
	List<Proveedor> findProveedoresRuc(@Param("ruc") String ruc);
	
	@Query("SELECT p FROM Proveedor p WHERE LOWER(p.razonSocial) LIKE LOWER(CONCAT('%', :razonSocial,'%'))")
	List<Proveedor> findProveedoresRazonSocial(@Param("razonSocial") String razonSocial);
	
	

	
}
