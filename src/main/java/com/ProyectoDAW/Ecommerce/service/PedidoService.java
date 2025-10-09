package com.ProyectoDAW.Ecommerce.service;

import com.ProyectoDAW.Ecommerce.dto.DetalleVentaDTO;
import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.model.Pedido;
import com.ProyectoDAW.Ecommerce.model.Venta;
import com.ProyectoDAW.Ecommerce.repository.IPedidoRepository;
import com.ProyectoDAW.Ecommerce.repository.IVentaRepository;
import com.ProyectoDAW.Ecommerce.util.mappers.PedidoMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    private IPedidoRepository pedidoRepository;

    @Autowired
    private IVentaRepository ventaRepository;

    @Autowired
    private CalificacionService calificacionService;

    private Pedido getPedidoById(Integer idPedido) {
        return pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + idPedido));
    }

    @Transactional
    public List<PedidoDTO> listarPedidosPendientes() {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPendientes();
        return pedidos.stream().map(PedidoMapper::toDTO).toList();
    }

    @Transactional
    public PedidoDTO actualizarEstado(Integer idPedido, String estado) {
        int filas = pedidoRepository.actualizarEstado(idPedido, estado);

        if (filas == 0) {
            throw new RuntimeException("Error: No se encontró el Pedido con ID " + idPedido + " o el estado ya era " + estado + ".");
        }

        Pedido pedidoActualizado = getPedidoById(idPedido);
        return PedidoMapper.toDTO(pedidoActualizado);
    }

    @Transactional
    public PedidoDTO registrarRepartidor(Integer idPedido, Integer idRepartidor) {
        int exito = pedidoRepository.registrarRepartidor(idPedido, idRepartidor);

        if (exito == 0) {
            throw new RuntimeException("Error: No se encontró el Pedido con ID " + idPedido +
                    " o el repartidor con ID: " + idRepartidor + "no existe");
        }

        Pedido pedidoActualizado = getPedidoById(idPedido);
        return PedidoMapper.toDTO(pedidoActualizado);
    }

    public PedidoDTO buscarPedidoPorId(Integer idPedido) {
        Pedido pedido = getPedidoById(idPedido);
        return PedidoMapper.toDTO(pedido);
    }

    @Transactional
    public PedidoDTO verificarEntrega(String codigoQR, Integer idRepartidor) {

        // 1. Buscar los pedidos que coincidan con el código QR
        List<Pedido> pedidos = pedidoRepository.findByQrVerificacion(codigoQR);

        if (pedidos.isEmpty()) {
            throw new RuntimeException("Error: No se encontró ningún pedido con el código QR proporcionado.");
        }

        if (pedidos.size() > 1) {
            pedidos = pedidos.stream()
                    .filter(p -> p.getRepartidor() != null && p.getRepartidor().getIdUsuario().equals(idRepartidor))
                    .toList();

            if (pedidos.isEmpty()) {
                throw new RuntimeException("Error: Múltiples pedidos con el mismo QR. " +
                        "No se encontró ninguna coincidencia con el ID de repartidor: " + idRepartidor);
            }
        }

        Pedido pedido = pedidos.get(0);

        if (pedido.getRepartidor() == null || !pedido.getRepartidor().getIdUsuario().equals(idRepartidor)) {
            throw new RuntimeException("Error: El pedido no está asignado a este repartidor.");
        }

        pedido.setEstado("EN");
        pedidoRepository.save(pedido);

        Venta venta = pedido.getVenta();
        venta.setEstado("E");
        ventaRepository.save(venta);

        calificacionService.registrarCalificacion(pedido);

        return PedidoMapper.toDTO(pedido);
    }
}
