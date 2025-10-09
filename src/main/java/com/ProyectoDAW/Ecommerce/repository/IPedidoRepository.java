package com.ProyectoDAW.Ecommerce.repository;

import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IPedidoRepository extends JpaRepository<Pedido, Integer> {

	@Query("""
		    SELECT DISTINCT p
		    FROM Pedido p
		    JOIN FETCH p.venta v
		    JOIN FETCH v.usuario u
		    LEFT JOIN FETCH v.detalles d
		    LEFT JOIN FETCH d.producto prod
		    LEFT JOIN FETCH p.repartidor r
		    WHERE p.estado = 'PE'
		""")
	List<Pedido> listarPedidosPendientes();

    @Modifying
    @Transactional
    @Query("""
            UPDATE Pedido p
            SET p.estado = :estado
            WHERE p.idPedido = :idPedido
            """)
    int actualizarEstado(
            @Param("idPedido") Integer idPedido,
            @Param("estado") String estado
    );

    @Modifying
    @Transactional
    @Query("""
            UPDATE Pedido p
            SET p.repartidor = :idRepartidor
            WHERE p.idPedido = :idPedido
            """)
    int registrarRepartidor(
            @Param("idPedido") Integer idPedido,
            @Param("idRepartidor") Integer idRepartidor
    );

    List<Pedido> findByQrVerificacion(String qrVerificacion);

}
