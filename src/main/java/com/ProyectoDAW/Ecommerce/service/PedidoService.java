package com.ProyectoDAW.Ecommerce.service;

import com.ProyectoDAW.Ecommerce.dto.DetalleVentaDTO;
import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.model.Pedido;
import com.ProyectoDAW.Ecommerce.model.Venta;
import com.ProyectoDAW.Ecommerce.repository.IPedidoRepository;
import com.ProyectoDAW.Ecommerce.repository.IVentaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    @Autowired
    IPedidoRepository pedidoRepository;

    @Autowired
    IVentaRepository ventaRepository;

    
    @Transactional
    public List<PedidoDTO> listarPedidosPendientes() {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPendientes();

        return pedidos.stream().map(p -> {
            Venta v = p.getVenta();

            return new PedidoDTO(
                v.getIdVenta(),
                p.getNumPedido(),
                v.getUsuario().getIdUsuario(),
                v.getUsuario().getNombres(),
                p.getFecha(),
                v.getTotal(),
                p.getDireccionEntrega(),
                p.getLatitud(),
                p.getLongitud(),
                v.getDetalles().stream()
                    .map(d -> new DetalleVentaDTO(
                        d.getIdDetalleVenta(),
                        d.getProducto().getIdProducto(),
                        d.getProducto().getNombre(),
                        d.getProducto().getDescripcion(),
                        d.getProducto().getBase64Img(),                        
                        d.getProducto().getPrecio(),
                        d.getCantidad(),
                        d.getSubTotal()
                    ))
                    .toList(),
                p.getRepartidor() != null ? p.getRepartidor().getIdUsuario() : null,
                p.getRepartidor() != null ? p.getRepartidor().getNombres() : null,
                v.getEspecificaciones(),
                p.getEstado()
            );
        }).toList();
    }


    /*
     * @Transactional public ResultadoResponse actualizarEstado(Integer idVenta,
     * String estado) { Venta venta = ventaRepository.findById(idVenta)
     * .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
     * venta.setEstado(estado); ventaRepository.save(venta); return new
     * ResultadoResponse(true, "Estado actualizado"); }
     */
}
