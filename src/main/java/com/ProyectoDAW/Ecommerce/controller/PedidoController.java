package com.ProyectoDAW.Ecommerce.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    /*
     * @PatchMapping("/estado/{idVenta}") public ResponseEntity<ResultadoResponse>
     * actualizarEstado(@PathVariable Integer idVenta, @RequestBody Map<String,
     * String> body) { String nuevoEstado = body.get("estado"); ResultadoResponse
     * response = ventaService.actualizarEstado(idVenta, nuevoEstado); if
     * (response.isValor()) { return ResponseEntity.ok(response); } return
     * ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response); }
     */
}
