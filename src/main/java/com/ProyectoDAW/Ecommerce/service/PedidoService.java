package com.ProyectoDAW.Ecommerce.service;

import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.model.Pedido;
import com.ProyectoDAW.Ecommerce.model.Venta;
import com.ProyectoDAW.Ecommerce.repository.IPedidoRepository;
import com.ProyectoDAW.Ecommerce.repository.IUsuarioRepository;
import com.ProyectoDAW.Ecommerce.repository.IVentaRepository;
import com.ProyectoDAW.Ecommerce.util.FechaUtils;
import com.ProyectoDAW.Ecommerce.util.mappers.PedidoMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private IPedidoRepository pedidoRepository;

    @Autowired
    private IVentaRepository ventaRepository;

    @Autowired
    private CalificacionService calificacionService;

    @Autowired
    private IUsuarioRepository usuarioRepository;

    private Pedido getPedidoById(Integer idPedido) {
        return pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + idPedido));
    }

    @Transactional
    public List<PedidoDTO> listarPedidosPendientes() {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPorEstado("PE");
        return pedidos.stream().map(PedidoMapper::toDTO).toList();
    }

    @Transactional
    public List<PedidoDTO> listarPedidosPorClienteYEstado(Integer idCliente, String estado) {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPorClienteYEstado(idCliente, estado);
        return pedidos.stream().map(PedidoMapper::toDTO).toList();
    }
    
    @Transactional
    public List<PedidoDTO> listarPedidosPorCliente(Integer idCliente) {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPorCliente(idCliente);
        return pedidos.stream().map(PedidoMapper::toDTO).toList();
    }
    
    @Transactional
    public List<PedidoDTO> listarPedidosPorClienteInicio(Integer idCliente) {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPorClienteInicio(idCliente);
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
        if (!usuarioRepository.existsById(idRepartidor)) {
            throw new RuntimeException("Error: El repartidor con ID " + idRepartidor + " no existe.");
        }

        int exito = pedidoRepository.registrarRepartidor(idPedido, idRepartidor);
        int exito2 = pedidoRepository.actualizarEstado(idPedido, "AS");

        if (exito == 0 || exito2 == 0) {
            throw new RuntimeException("Error: No se encontró el Pedido con ID " + idPedido + " para asignar el repartidor.");
        }
        
        Pedido pedidoActualizado = getPedidoById(idPedido);
        pedidoActualizado.setFechaAsignacion(LocalDateTime.now());
        pedidoRepository.save(pedidoActualizado);
        return PedidoMapper.toDTO(pedidoActualizado);
    }
    
    @Transactional
    public PedidoDTO enCaminoPedido(Integer idPedido, Integer idRepartidor) {
        if (!usuarioRepository.existsById(idRepartidor)) {
            throw new RuntimeException("Error: El repartidor con ID " + idRepartidor + " no existe.");
        }

        int exito = pedidoRepository.registrarRepartidor(idPedido, idRepartidor);
        int exito2 = pedidoRepository.actualizarEstado(idPedido, "EC");

        if (exito == 0 || exito2 == 0) {
            throw new RuntimeException("Error: No se encontró el Pedido con ID " + idPedido + " para asignar el repartidor.");
        }
        Pedido pedidoActualizado = getPedidoById(idPedido);
        
        if ("EC".equals(pedidoActualizado.getEstado())) {
        	pedidoActualizado.setFechaEnCamino(LocalDateTime.now());
        }
        
        return PedidoMapper.toDTO(pedidoActualizado);
    }

    public PedidoDTO buscarPedidoPorId(Integer idPedido) {
        Pedido pedido = getPedidoById(idPedido);
        return PedidoMapper.toDTO(pedido);
    }

    @Transactional
    public PedidoDTO verificarEntrega(String codigoQR, Integer idRepartidor) {

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
        pedido.setFechaEntregado(LocalDateTime.now());
        actualizarTiempoEntrega(pedido.getIdPedido());
        pedidoRepository.save(pedido);

        Venta venta = pedido.getVenta();
        venta.setEstado("E");
        ventaRepository.save(venta);

        calificacionService.crearRegistroCalificacion(pedido);

        return PedidoMapper.toDTO(pedido);
    }

    public void actualizarTiempoEntrega(Integer idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        LocalDateTime fechaEnCamino = pedido.getFechaEnCamino();
        LocalDateTime fechaEntregado = pedido.getFechaEntregado();

        Long minutos = FechaUtils.calcularDiferenciaMinutos(fechaEnCamino, fechaEntregado);

        if (minutos != null) {
            pedido.setTiempoEntrega(minutos.shortValue());
            pedidoRepository.save(pedido);
        }
    }

    // Graficos

    public List<Object[]> resumenMensualVentasPedidos(){
        return pedidoRepository.resumenMensualVentasPedidos(2025);
    }
}
