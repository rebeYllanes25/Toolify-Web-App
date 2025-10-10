package com.ProyectoDAW.Ecommerce.controller;

import com.ProyectoDAW.Ecommerce.dto.CalificacionDTO;
import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.service.CalificacionService;
import com.ProyectoDAW.Ecommerce.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedido")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private CalificacionService calificacionService;

    @GetMapping("/{idCliente}/pedidos")
    public ResponseEntity<List<PedidoDTO>> listarPedidosPorCliente(
            @PathVariable("idCliente") Integer idCliente,
            @Param("estado") String estado) {
        List<PedidoDTO> pedidos = pedidoService.listarPedidosPorClienteYEstado(idCliente,estado);
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping("/{idPedido}/calificar")
    public ResponseEntity<CalificacionDTO> registrarCalificacion(
            @PathVariable Integer idPedido,
            @RequestParam Short puntuacion,
            @RequestParam(required = false) String comentario) {

        CalificacionDTO calificacion = calificacionService.registrarCalificacion(
                idPedido,
                puntuacion,
                comentario
        );
        return new ResponseEntity<>(calificacion, HttpStatus.CREATED);
    }

    @GetMapping("/{idPedido}")
    public ResponseEntity<PedidoDTO> buscarPedidoPorId(@PathVariable Integer idPedido) {
        PedidoDTO pedido = pedidoService.buscarPedidoPorId(idPedido);
        return ResponseEntity.ok(pedido);
    }
}
