package com.ProyectoDAW.Ecommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.service.PedidoService;

@RestController
@RequestMapping("/repartidor")
public class RepartidorController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping("/pendientes")
    public ResponseEntity<List<PedidoDTO>> listarPedidosPendientes() {
        List<PedidoDTO> pedidos = pedidoService.listarPedidosPendientes();
        return ResponseEntity.ok(pedidos);
    }
    
    @GetMapping("/aceptados")
    public ResponseEntity<List<PedidoDTO>> listarPedidosAceptados() {
        List<PedidoDTO> pedidos = pedidoService.listarPedidosAceptados();
        return ResponseEntity.ok(pedidos);
    }
    
    //Ya no se usa
    @PutMapping("/asignar/{idPedido}")
    public ResponseEntity<PedidoDTO> registrarRepartidor(
            @PathVariable Integer idPedido,
            @RequestParam Integer idRepartidor) {
        PedidoDTO pedido = pedidoService.registrarRepartidor(idPedido, idRepartidor);
        return ResponseEntity.ok(pedido);
    }
    
    @PutMapping("/encamino/{idPedido}")
    public ResponseEntity<PedidoDTO> enCaminoPedido(
            @PathVariable Integer idPedido,
            @RequestParam Integer idRepartidor) {
        PedidoDTO pedido = pedidoService.enCaminoPedido(idPedido, idRepartidor);
        return ResponseEntity.ok(pedido);
    }

    @PutMapping("/cerca/{idPedido}")
    public ResponseEntity<PedidoDTO> cercaPedido(
            @PathVariable Integer idPedido) {
        PedidoDTO pedido = pedidoService.cercaPedido(idPedido);
        return ResponseEntity.ok(pedido);
    }
    
    
    @PutMapping("/{idPedido}/estado")
    public ResponseEntity<PedidoDTO> actualizarEstado(
            @PathVariable Integer idPedido,
            @RequestParam String estado) {
        PedidoDTO pedido = pedidoService.actualizarEstado(idPedido, estado);
        return ResponseEntity.ok(pedido);
    }

    @PutMapping("/entregar/{idPedido}")
    public ResponseEntity<PedidoDTO> verificarEntrega(
            @PathVariable Integer idPedido,
            @RequestParam String codigoQR,
            @RequestParam Integer idRepartidor) {
        PedidoDTO pedido = pedidoService.verificarEntrega(idPedido,codigoQR, idRepartidor);
        return ResponseEntity.ok(pedido);
    }
    
    @GetMapping("/estadisticas/{idRepartidor}")
    public ResponseEntity<Map<String, Object>> obtenerEstadisticasRepartidor(
            @PathVariable Integer idRepartidor) {
        
        Map<String, Object> estadisticas = pedidoService.obtenerEstadisticasRepartidor(idRepartidor);
        return ResponseEntity.ok(estadisticas);
    }
}
