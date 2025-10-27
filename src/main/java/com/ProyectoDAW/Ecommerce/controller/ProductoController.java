package com.ProyectoDAW.Ecommerce.controller;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ProyectoDAW.Ecommerce.dto.ProductoPorCategoriaDTO;
import com.ProyectoDAW.Ecommerce.dto.ProductoPorProveedor;
import com.ProyectoDAW.Ecommerce.dto.VentaPorFechasDTO;
import com.ProyectoDAW.Ecommerce.model.Producto;
import com.ProyectoDAW.Ecommerce.model.Proveedor;
import com.ProyectoDAW.Ecommerce.service.CloudinaryService;
import com.ProyectoDAW.Ecommerce.service.ProductoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
@RequestMapping("/producto")
public class ProductoController {

	@Autowired
	ProductoService prdService;
	
	@Autowired
	CloudinaryService _serviceCloud;

	@GetMapping("/index")
	public List<Producto> ListarProductos() {
		return prdService.obtenerProductosActivos();
	}

	@GetMapping("/obtenerId/{id}")
	public ResponseEntity<?> ObtenerId(@PathVariable Integer id) {

		if (id == null || id.longValue() < 0) {
			return ResponseEntity.badRequest().body("No se pudo encontrar el Producto");
		}
		return ResponseEntity.ok(prdService.ObtenerProductoId(id));
	}

	
	@PostMapping(value = "/registrar", consumes = {"multipart/form-data"})
	public ResponseEntity<?> RegistrarProducto(@ModelAttribute Producto producto) {
	    try {
	        producto.setFechaRegistro(LocalDateTime.now());
	        producto.setEstado(true);
	        
	        String urlImagen = _serviceCloud.upload(producto.getImagenUrl(), "TooLifyWeb/Products");
	        
	        producto.setImagen(urlImagen);
	        
	        Producto prdGuardar = prdService.RegistrarProducto(producto);
	        
	        return ResponseEntity.ok(prdGuardar);
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body("Error registrando producto: " + e.getMessage());
	    }
	}


	@PutMapping(value="/actualizar/{id}", consumes = {"multipart/form-data"})
	public ResponseEntity<?> ActualizarProducto(
			@PathVariable Integer id,
			@ModelAttribute  Producto producto) {

		try {
			Producto prdActualizar = prdService.ActualizarProducto(id, producto);
			return ResponseEntity.ok(prdActualizar);
			
		} catch (Exception e) {
			 return ResponseEntity.badRequest().body("Error no se actualizo el producto " + e.getMessage());
		}
	}

	@PutMapping("/desactivar/{id}")
	public ResponseEntity<?> DesactivarProducto(@PathVariable Integer id, @RequestBody Producto producto) {

		if (id == null || id.longValue() < 0) {
			return ResponseEntity.badRequest().body("No se obtuvo el id");
		}
		Producto prdEncontrado = prdService.ObtenerProductoId(id);
		if (prdEncontrado == null) {
			return ResponseEntity.badRequest().body("Producto no encontrado");
		}

		prdService.DesactivarProducto(id);

		String mensaje = ("Se desactivo al proveedor con codigo: " + prdEncontrado.getIdProducto());
		return ResponseEntity.ok(mensaje);
	}

	@GetMapping({ "/listaCategorias", "/listaCategorias/{idCategoria}" })
	public ResponseEntity<?> listadoCategorias(@PathVariable(required = false) Integer idCategoria,
			@RequestParam(defaultValue = "ASC") String orden) {
		if (idCategoria == null || idCategoria.longValue() < 0) {
			return ResponseEntity.ok(prdService.obtenerProductosActivos());
		}
		return ResponseEntity.ok(prdService.listaProductosCategoria(idCategoria, orden));
	}

	
	@GetMapping("/listadoProductoCategoria")
	public ResponseEntity<List<ProductoPorCategoriaDTO>> getProductoPorCategoria() {
		try {
			
			List<Object[]> resultado = prdService.totalStockPorCategoria();
			
			List<ProductoPorCategoriaDTO> productoPorCategoria = resultado.stream()
					.map(row -> {
	                    String descripcion = ((String) row[0]).trim();
	                    int totalProductos = ((Number) row[1]).intValue();
	                    return new ProductoPorCategoriaDTO(descripcion, totalProductos);
	                })
	                .collect(Collectors.toList());;
	                return ResponseEntity.ok(productoPorCategoria); 
			
		} catch (Exception e) {
			  e.printStackTrace();
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Collections.emptyList());
		}
	}
	
	
	@GetMapping("/listadoProductoProveedor")
	public ResponseEntity<List<ProductoPorProveedor>> getProductoPorProveedor() {
		try {
			
			List<Object[]> resultado = prdService.totalStockPorProveedor();
			
			List<ProductoPorProveedor> productoPorProveedor = resultado.stream()
					.map(row -> {
	                    String razonSocial = ((String) row[0]).trim();
	                    int totalProductos = ((Number) row[1]).intValue();
	                    return new ProductoPorProveedor(razonSocial, totalProductos);
	                })
	                .collect(Collectors.toList());;
	                return ResponseEntity.ok(productoPorProveedor); 
			
		} catch (Exception e) {
			  e.printStackTrace();
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(Collections.emptyList());
		}
	}
	
	
	
}
