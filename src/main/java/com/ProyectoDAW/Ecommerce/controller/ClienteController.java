package com.ProyectoDAW.Ecommerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ProyectoDAW.Ecommerce.dto.CategoriaVentasDTO;
import com.ProyectoDAW.Ecommerce.dto.PerfilDetalleComprasDto;
import com.ProyectoDAW.Ecommerce.dto.ProductoFilter;
import com.ProyectoDAW.Ecommerce.dto.VentaDTO;
import com.ProyectoDAW.Ecommerce.model.Categoria;
import com.ProyectoDAW.Ecommerce.model.Producto;
import com.ProyectoDAW.Ecommerce.service.CategoriaService;
import com.ProyectoDAW.Ecommerce.service.ProductoService;
import com.ProyectoDAW.Ecommerce.service.UsuarioService;
import com.ProyectoDAW.Ecommerce.service.VentaService;

@RestController
@RequestMapping("/cliente")
public class ClienteController {
	@Autowired
	private ProductoService productoService;
	
	@Autowired
	private CategoriaService categoriaService;
	
	@Autowired
	private UsuarioService usuarioService;
	
	@Autowired
	private VentaService ventaService;

	@GetMapping("/index")
	public ResponseEntity<?> index() {
	    List<CategoriaVentasDTO> listCategories = categoriaService.getCategoriesMoreSales();
	    long countClientes = usuarioService.countClientes();
	    long countProductos = productoService.countProductos();

	    Map<String, Object> response = new HashMap<>();
	    response.put("categories", listCategories);
	    response.put("totalClientes", countClientes);
	    response.put("totalProductos", countProductos);

	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/producto")
	public ResponseEntity<Map<String, Object>> listProductosYcategorias(
	    ProductoFilter filter,
	    @PageableDefault(size = 12) Pageable pageable,
	    @RequestParam(required = false) String order) {

	    Pageable pageableFinal = pageable;

	    if (order != null) {
	        Sort sort = Sort.by("precio");
	        if ("desc".equalsIgnoreCase(order)) {
	            sort = sort.descending();
	        } else {
	            sort = sort.ascending();
	        }
	        pageableFinal = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
	    }

	    Page<Producto> productos = productoService.getProducteForCategorie(filter, pageableFinal);
	    List<Categoria> categorias = categoriaService.getAll();

	    Map<String, Object> response = new HashMap<>();
	    response.put("productos", productos);
	    response.put("categorias", categorias);

	    return ResponseEntity.ok(response);
	}
	
	@GetMapping("/perfil")
	public ResponseEntity<?> perfilCliente(@RequestParam Integer idUsuario) {
		List<VentaDTO> ventasDto = ventaService.getVentasPorUsuario(idUsuario);
        return ResponseEntity.ok(ventasDto);
	}
	
	@GetMapping("/perfilDetalle/{idUsuario}")
	public ResponseEntity<?> perfilDetalle(@PathVariable Integer idUsuario){
		
		try {

			PerfilDetalleComprasDto perfilObtenido = usuarioService.obtenerPerfilConDetalle(idUsuario);
				if(perfilObtenido == null) 
				{
					  return ResponseEntity.status(HttpStatus.NOT_FOUND)
				                .body(Map.of("mensaje", "Usuario no encontrado"));
					  
				}
				return ResponseEntity.ok(perfilObtenido);
		} catch (Exception e) {
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
						.body("No se encontro al usuarioo");
		}
		
	}
	
	
	

}
