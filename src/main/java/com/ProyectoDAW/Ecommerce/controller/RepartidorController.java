package com.ProyectoDAW.Ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.service.PedidoService;

@RestController
@RequestMapping("/repartidor")
public class RepartidorController {

    @Autowired
    PedidoService pedidoService;
	
    @GetMapping("/pedidos")
    public ResponseEntity<List<PedidoDTO>> listarPedidosPendientes() {
        List<PedidoDTO> pedidos = pedidoService.listarPedidosPendientes();
        return ResponseEntity.ok(pedidos);
    }

    
    /*
    @PutMapping("/marcar-entregado/{idVenta}")
    public ResponseEntity<?> marcarVentaComoEntregada(@PathVariable Integer idVenta) {
        ventaService.marcarComoEntregado(idVenta);
        return ResponseEntity.ok("Venta marcada como entregada");
    }
    */
}
