package com.ProyectoDAW.Ecommerce.util.mappers;

import com.ProyectoDAW.Ecommerce.dto.DetalleVentaDTO;
import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.model.Pedido;
import com.ProyectoDAW.Ecommerce.model.Venta;

import java.util.List;

public class PedidoMapper {

    public static PedidoDTO toDTO(Pedido p) {
        if (p == null) {
            return null;
        }

        Venta v = p.getVenta();
        if (v == null) {
            throw new IllegalArgumentException("La entidad Pedido debe tener una Venta asociada.");
        }

        List<DetalleVentaDTO> detallesDTO = v.getDetalles().stream()
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
                .toList();

        return new PedidoDTO(
                v.getIdVenta(),
                p.getIdPedido(),
                p.getNumPedido(),
                v.getUsuario().getIdUsuario(),
                v.getUsuario().getNombres(),
                p.getFecha(),
                v.getTotal(),
                p.getQrVerificacion(),
                p.getDireccionEntrega(),
                p.getLatitud(),
                p.getLongitud(),
                p.getMovilidad(),
                detallesDTO,
                p.getRepartidor() != null ? p.getRepartidor().getIdUsuario() : null,
                p.getRepartidor() != null ? p.getRepartidor().getNombres() : null,
                p.getRepartidor() != null ? p.getRepartidor().getApePaterno() : null,
                p.getRepartidor() != null ? p.getRepartidor().getTelefono() : null,	
                v.getEspecificaciones(),
                p.getEstado()
        );
    }
}
