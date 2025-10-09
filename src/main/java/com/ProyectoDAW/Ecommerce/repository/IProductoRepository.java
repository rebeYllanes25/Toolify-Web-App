package com.ProyectoDAW.Ecommerce.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ProyectoDAW.Ecommerce.model.Producto;

public interface IProductoRepository extends JpaRepository<Producto, Integer> {

	@Query("SELECT P FROM Producto P WHERE P.estado = TRUE ORDER BY 1 ASC")
	List<Producto> findProductosActivos();

	@Query("""
			    SELECT P FROM Producto P
			    WHERE P.estado = TRUE
			      AND (:idCategoria IS NULL OR P.categoria.idCategoria = :idCategoria)
			    ORDER BY P.idProducto ASC
			""")
	List<Producto> findProductosActivosByCategories(@Param("idCategoria") Integer idCategoria);

	@Query("SELECT P FROM Producto P WHERE P.estado = TRUE")
	Page<Producto> findProductsActive(Pageable pageable);

	@Query("""
			    SELECT P FROM Producto P
			    WHERE (:idCategorias IS NULL OR P.categoria.idCategoria IN :idCategorias)
			      AND P.estado = TRUE
			""")
	Page<Producto> findAllWithFilter(@Param("idCategorias") List<Integer> idCategorias, Pageable pageable);

	@Query("SELECT COUNT(P) FROM Producto P WHERE P.estado = TRUE")
	long countProducts();

	@Modifying
	@Query("UPDATE Producto p SET p.stock = :nuevoStock WHERE p.idProducto = :id")
	void actualizarStock(@Param("id") Integer id, @Param("nuevoStock") Integer nuevoStock);

	@Query("""
			SELECT p FROM Producto p
			JOIN p.categoria c
			where c.idCategoria =:idCategoria
			ORDER BY
				CASE WHEN :orden = 'ASC' THEN p.stock END ASC,
				CASE WHEN :orden = 'DESC' THEN p.stock END DESC
			""")
	List<Producto> listaPorCategorias(@Param("idCategoria") Integer idCategoria, @Param("orden") String orden);

	// listados para los graficos

	@Query(value = """
			  SELECT
			     ct.DESCRIPCION  AS descripcion,
			     SUM(p.STOCK) AS totalProductos
			 FROM TB_PRODUCTO p
			 INNER JOIN TB_CATEGORIA  ct ON p.ID_CATEGORIA  = ct.ID_CATEGORIA
			 GROUP BY ct.DESCRIPCION
			 ORDER BY totalProductos ASC
			""", nativeQuery = true)
	List<Object[]> totalStockPorCategoriaDescripcion();

	@Query(value = """
			 SELECT
			     pv.razon_social AS razonSocial,
			     SUM(p.stock) AS totalProductos
			 FROM tb_producto p
			 INNER JOIN tb_proveedor pv ON p.id_proveedor = pv.id_proveedor
			 GROUP BY pv.razon_social
			 ORDER BY totalProductos ASC
			""", nativeQuery = true)
	List<Object[]> totalStockPorProveedorRazonSocial();

}
