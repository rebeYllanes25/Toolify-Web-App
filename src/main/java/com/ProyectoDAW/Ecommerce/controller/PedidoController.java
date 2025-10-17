package com.ProyectoDAW.Ecommerce.controller;

import com.ProyectoDAW.Ecommerce.dto.CalificacionDTO;
import com.ProyectoDAW.Ecommerce.dto.CalificarRequest;
import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.dto.ResumenMensualVentaPedidoDTO;
import com.ProyectoDAW.Ecommerce.dto.VentaPorTipoVentaMesDTO;
import com.ProyectoDAW.Ecommerce.service.CalificacionService;
import com.ProyectoDAW.Ecommerce.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
            @RequestParam("estado") String estado) {
        List<PedidoDTO> pedidos = pedidoService.listarPedidosPorClienteYEstado(idCliente,estado);
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping("/{idPedido}/calificar")
    public ResponseEntity<?> registrarCalificacion(
            @PathVariable Integer idPedido,
            @RequestBody(required = false) CalificarRequest request) {
        
        if (request == null || request.getPuntuacion() == null) {
            return ResponseEntity.ok(Map.of(
                "mensaje", "Calificación omitida",
                "calificado", false
            ));
        }
        
        if (request.getPuntuacion() < 1 || request.getPuntuacion() > 5) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "La puntuación debe estar entre 1 y 5"));
        }
        
        CalificacionDTO calificacion = calificacionService.registrarCalificacion(
                idPedido,
                request.getPuntuacion(),
                request.getComentario()
        );
        
        return new ResponseEntity<>(Map.of(
            "calificacion", calificacion,
            "calificado", true
        ), HttpStatus.CREATED);
    }

    @GetMapping("/{idPedido}")
    public ResponseEntity<PedidoDTO> buscarPedidoPorId(@PathVariable Integer idPedido) {
        PedidoDTO pedido = pedidoService.buscarPedidoPorId(idPedido);
        return ResponseEntity.ok(pedido);
    }

    // Graficos

    @GetMapping("/resumen/mensual/VYP")
    public ResponseEntity<List<ResumenMensualVentaPedidoDTO>>getRMVentaYPedido(){
        try {
            List<Object[]>result = pedidoService.resumenMensualVentasPedidos();

            List<ResumenMensualVentaPedidoDTO> RMVP = result.stream()
                    .map(row -> {
                        String mes = ((String) row[0]).trim();
                        int totalVentas = ((Number) row[1]).intValue();
                        int totalPedidos = ((Number) row[2]).intValue();
                        return new ResumenMensualVentaPedidoDTO(mes, totalVentas,totalPedidos);
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(RMVP);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }
}
