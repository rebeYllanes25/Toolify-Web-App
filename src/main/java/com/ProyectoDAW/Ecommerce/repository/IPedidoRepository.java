package com.ProyectoDAW.Ecommerce.repository;

import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface IPedidoRepository extends JpaRepository<Pedido, Integer> {

    @Query("""
            SELECT DISTINCT p
            FROM Pedido p
            JOIN FETCH p.venta v
            JOIN FETCH v.usuario u
            LEFT JOIN FETCH v.detalles d
            LEFT JOIN FETCH d.producto prod
            LEFT JOIN FETCH p.repartidor r
            WHERE p.estado = :estado
        """)
    List<Pedido> listarPedidosPorEstado(@Param("estado") String estado);

    @Query("""
        SELECT DISTINCT p
        FROM Pedido p
        JOIN FETCH p.venta v
        JOIN FETCH v.usuario u
        LEFT JOIN v.detalles d
        LEFT JOIN d.producto prod
        LEFT JOIN FETCH p.repartidor r
        WHERE u.idUsuario = :idCliente AND
        p.estado = :estado
    """)
    List<Pedido> listarPedidosPorClienteYEstado(@Param("idCliente") Integer idCliente,
                                                @Param("estado") String estado);
    
    @Query("""
            SELECT DISTINCT p
            FROM Pedido p
            JOIN FETCH p.venta v
            JOIN FETCH v.usuario u
            LEFT JOIN v.detalles d
            LEFT JOIN d.producto prod
            LEFT JOIN FETCH p.repartidor r
            WHERE u.idUsuario = :idCliente
        """)
        List<Pedido> listarPedidosPorCliente(@Param("idCliente") Integer idCliente);

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
            SET p.repartidor = (SELECT u FROM Usuario u WHERE u.idUsuario = :idRepartidor)
            WHERE p.idPedido = :idPedido
            """)
    int registrarRepartidor(
            @Param("idPedido") Integer idPedido,
            @Param("idRepartidor") Integer idRepartidor
    );

    List<Pedido> findByQrVerificacion(String qrVerificacion);


    // Graficos relacionados a pedido
    @Query(value = """
        SELECT
            TO_CHAR(v.fecha, 'TMMonth') AS mes,
            COUNT(DISTINCT v.id_venta) AS total_ventas,
            COUNT(DISTINCT p.id_pedido) AS total_pedidos
        FROM tb_venta v
        LEFT JOIN tb_pedido p ON v.id_venta = p.id_venta
        WHERE EXTRACT(YEAR FROM v.fecha) = :anio
        GROUP BY TO_CHAR(v.fecha, 'TMMonth'), EXTRACT(MONTH FROM v.fecha)
        ORDER BY EXTRACT(MONTH FROM v.fecha)
        """, nativeQuery = true)
    List<Object[]> resumenMensualVentasPedidos(@Param("anio") int anio);
    
    Optional<Pedido> findByVenta_IdVenta(Integer idVenta);
}
