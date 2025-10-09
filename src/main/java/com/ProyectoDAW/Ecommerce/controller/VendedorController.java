package com.ProyectoDAW.Ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ProyectoDAW.Ecommerce.dto.ResultadoResponse;
import com.ProyectoDAW.Ecommerce.dto.VentaDTO;
import com.ProyectoDAW.Ecommerce.model.Producto;
import com.ProyectoDAW.Ecommerce.model.Venta;
import com.ProyectoDAW.Ecommerce.service.ProductoService;
import com.ProyectoDAW.Ecommerce.service.VentaService;


@RestController
@RequestMapping("/vendedor")
public class VendedorController {

	@Autowired
	private VentaService ventaService;
	
	@Autowired
	private ProductoService productoService;
	
	
	@GetMapping("/productos")
	public ResponseEntity<List<Producto>> obtenerProductosActivosPorCategorias(
	        @RequestParam(value = "idCategoria", required = false) Integer idCategoria) {
	    
	    List<Producto> productos = productoService.obtenerProductosActivosPorCategorias(idCategoria);

	    if (productos.isEmpty()) {
	        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
	    }

	    return ResponseEntity.ok(productos);
	}
	
	
	@PostMapping("/grilla")
	public ResponseEntity<ResultadoResponse> finalizarVentaVendedor(@RequestBody Venta venta) {
	    ResultadoResponse resultado = ventaService.guardarVenta(venta);
	    if (resultado.isValor()) {
	        return ResponseEntity.ok(resultado);
	    } else {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(resultado);
	    }
	}
	
	@GetMapping("/perfil")
	public ResponseEntity<?> listarVentasVendedor(@RequestParam Integer idUsuario) {
		List<VentaDTO> ventasDto = ventaService.getVentasPorUsuario(idUsuario);
        return ResponseEntity.ok(ventasDto);
	}
}
