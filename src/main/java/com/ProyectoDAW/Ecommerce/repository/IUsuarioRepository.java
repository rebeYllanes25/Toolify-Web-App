package com.ProyectoDAW.Ecommerce.repository;


import java.util.Optional;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ProyectoDAW.Ecommerce.dto.PerfilDetalleComprasDto;

import com.ProyectoDAW.Ecommerce.model.Usuario;

public interface IUsuarioRepository extends JpaRepository<Usuario, Integer>{
	@Query("SELECT COUNT(U) FROM Usuario U WHERE U.rol.idRol = 2")
	long countClientes();
	
	Optional<Usuario> findUsuarioByCorreo(String username);
	Optional<Usuario> findByCorreo(String correo);
	Optional<Usuario> findByNroDocumento(String nroDocumento);
	Optional<Usuario> findByTelefono(String telefono);
	
	
	@Query(value = """
		    SELECT 
		        CAST(u.ID_USUARIO AS INTEGER) as idUser,
		        CONCAT(u.NOMBRES, ' ', u.APE_PATERNO, ' ', u.APE_MATERNO) as nombresCompletos,
		        u.CORREO as correo,
		        u.NRO_DOC as nroDoc,
		        u.DIRECCION as direccion,
		        d.NOMBRE as distrito,
		        u.TELEFONO as telefono,
		        TO_CHAR(u.FECHA_REGISTRO, 'YYYY-MM-DD') as fechaRegistro,
		        (SELECT p.NOMBRE 
		         FROM TB_DETALLE_VENTA dv
		         INNER JOIN TB_VENTA v ON dv.ID_VENTA = v.ID_VENTA
		         INNER JOIN TB_PRODUCTO p ON dv.ID_PRODUCTO = p.ID_PRODUCTO
		         WHERE v.ID_USUARIO = u.ID_USUARIO
		         GROUP BY p.ID_PRODUCTO, p.NOMBRE
		         ORDER BY SUM(dv.CANTIDAD) DESC
		         LIMIT 1) as productoMasComprado,
		        
		           TO_CHAR((SELECT DATE(v.FECHA)
                 FROM TB_VENTA v
                 WHERE v.ID_USUARIO = u.ID_USUARIO
                 GROUP BY DATE(v.FECHA)
                 ORDER BY COUNT(*) DESC
                 LIMIT 1), 'YYYY-MM-DD') AS fechaMayorCompras,
		         
		        CAST(COALESCE((SELECT SUM(dv.CANTIDAD)
		                  FROM TB_DETALLE_VENTA dv
		                  INNER JOIN TB_VENTA v ON dv.ID_VENTA = v.ID_VENTA
		                  WHERE v.ID_USUARIO = u.ID_USUARIO), 0) AS BIGINT) as totalDeProductosComprados,
		        CAST(COALESCE((SELECT SUM(v.TOTAL)
		                  FROM TB_VENTA v
		                  WHERE v.ID_USUARIO = u.ID_USUARIO), 0) AS DOUBLE PRECISION) as gastoTotal,
		        (SELECT c.DESCRIPCION
		         FROM TB_DETALLE_VENTA dv
		         INNER JOIN TB_VENTA v ON dv.ID_VENTA = v.ID_VENTA
		         INNER JOIN TB_PRODUCTO p ON dv.ID_PRODUCTO = p.ID_PRODUCTO
		         INNER JOIN TB_CATEGORIA c ON p.ID_CATEGORIA = c.ID_CATEGORIA
		         WHERE v.ID_USUARIO = u.ID_USUARIO
		         GROUP BY c.ID_CATEGORIA, c.DESCRIPCION
		         ORDER BY SUM(dv.CANTIDAD) DESC
		         LIMIT 1) as categoriaMasComprada,
		        CAST(COALESCE((SELECT COUNT(*)
		                  FROM TB_VENTA v
		                  WHERE v.ID_USUARIO = u.ID_USUARIO), 0) AS BIGINT) as totalVentas
		    FROM TB_USUARIO u
		    INNER JOIN TB_DISTRITO d ON u.ID_DISTRITO = d.ID_DISTRITO
		    WHERE u.ID_USUARIO = :idUsuario
		    """, nativeQuery = true)
	List<Object[]> perfilDetalleCompras(@Param("idUsuario")Integer idUsuario);
	
}
