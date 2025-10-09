package com.ProyectoDAW.Ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.ProyectoDAW.Ecommerce.model.Categoria;

public interface ICategoriaRepository extends JpaRepository<Categoria, Integer> {
	@Query("SELECT c.idCategoria, c.descripcion AS categoria, " + "COALESCE(SUM(dv.cantidad), 0) AS cantidadVendida, "
			+ "(SELECT COUNT(p2) FROM Producto p2 WHERE p2.categoria = c) AS cantidadProductos " + "FROM Categoria c "
			+ "LEFT JOIN Producto p ON p.categoria = c " + "LEFT JOIN DetalleVenta dv ON dv.producto = p "
			+ "GROUP BY c.descripcion, c.id " + "ORDER BY cantidadVendida DESC, c.id DESC")
	List<Object[]> findCategoriasMasVendidasConCantidadProductos(Pageable pageable);
}
