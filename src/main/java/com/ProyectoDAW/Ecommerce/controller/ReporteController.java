package com.ProyectoDAW.Ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ProyectoDAW.Ecommerce.service.VentaService;

@RestController
@RequestMapping("/reporte")
public class ReporteController {

	@Autowired
	private VentaService ventaService;
	
	@GetMapping("/mensual/ventas")
    public ResponseEntity<Long> contarVentasMesActual() {
        Long totalVentas = ventaService.obtenerTotalVentasMensual();
        return ResponseEntity.ok(totalVentas);
    }

    @GetMapping("/mensual/productos")
    public ResponseEntity<Long> contarProductosVendidosMesActual() {
        Long totalProductos = ventaService.obtenerTotalProductosVendidosMensual();
        return ResponseEntity.ok(totalProductos);
    }

    @GetMapping("/mensual/clientes")
    public ResponseEntity<Long> contarClientesAtendidosMesActual() {
        Long totalClientes = ventaService.obtenerTotalClientesAtendidosMensual();
        return ResponseEntity.ok(totalClientes);
    }
	
    @GetMapping("/total/ventas")
    public ResponseEntity<Long> obtenerTotalVentas() {
        return ResponseEntity.ok(ventaService.obtenerTotalVentas());
    }

    @GetMapping("/total/productos")
    public ResponseEntity<Long> obtenerTotalProductosVendidos() {
        return ResponseEntity.ok(ventaService.obtenerTotalProductosVendidos());
    }

    @GetMapping("/total/ingresos")
    public ResponseEntity<Double> obtenerIngresosTotales() {
        return ResponseEntity.ok(ventaService.obtenerIngresosTotales());
    }
}
