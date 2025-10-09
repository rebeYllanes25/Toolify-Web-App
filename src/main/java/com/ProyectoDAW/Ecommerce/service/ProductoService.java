package com.ProyectoDAW.Ecommerce.service;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import com.ProyectoDAW.Ecommerce.dto.ProductoFilter;
import com.ProyectoDAW.Ecommerce.model.Categoria;
import com.ProyectoDAW.Ecommerce.model.Producto;
import com.ProyectoDAW.Ecommerce.model.Proveedor;
import com.ProyectoDAW.Ecommerce.repository.IProductoRepository;

@Service
public class ProductoService {
	@Autowired
	private IProductoRepository productoRepository;

	public Page<Producto> getProducteForCategorie(ProductoFilter filter, Pageable pageable) {
	    Page<Producto> productPage;

	    if (filter.getIdCategorias() == null || filter.getIdCategorias().isEmpty()) {
	        productPage = productoRepository.findProductsActive(pageable);
	    } else {
	        productPage = productoRepository.findAllWithFilter(filter.getIdCategorias(), pageable);
	    }

	    List<Producto> productos = productPage.getContent();
	    List<Producto> productosConBase64 = convertImagesToBase64(productos);
	    return new PageImpl<>(productosConBase64, pageable, productPage.getTotalElements());
	}

	
	private List<Producto> convertImagesToBase64(List<Producto> productos) {
	    for (Producto producto : productos) {
	        if (producto.getImagenBytes() != null) {
	            producto.setBase64Img(Base64.getEncoder().encodeToString(producto.getImagenBytes()));
	        }
	    }
	    return productos;
	}
	
	public long countProductos() {
		return productoRepository.count();
	}

	public List<Producto> obtenerProductosActivos() {
		List<Producto> productos = productoRepository.findProductosActivos();

		for (Producto producto : productos) {
			if (producto.getImagenBytes() != null) {
				producto.setBase64Img(Base64.getEncoder().encodeToString(producto.getImagenBytes()));
			}
		}
		return productos;
	}

	public List<Producto> obtenerProductosActivosPorCategorias(Integer idCategoria) {
		return productoRepository.findProductosActivosByCategories(idCategoria);
	}

	public Producto RegistrarProducto(Producto producto) {

		if (producto.getImagenBytes() == null || producto.getImagenBytes().length == 0) {
			producto.setImagenBytes(null);
		}

		return productoRepository.save(producto);
	}

	public Producto ActualizarProducto(Integer id, Producto producto) {
		Producto prdUpdate = productoRepository.findById(id).orElseThrow();

		prdUpdate.setNombre(producto.getNombre());
		prdUpdate.setDescripcion(producto.getDescripcion());

		Proveedor prvEncotrado = new Proveedor();
		prvEncotrado.setIdProveedor(producto.getProveedor().getIdProveedor());
		prdUpdate.setProveedor(prvEncotrado);

		Categoria catEncontrado = new Categoria();
		catEncontrado.setIdCategoria(producto.getCategoria().getIdCategoria());
		prdUpdate.setCategoria(catEncontrado);

		// solo se actualiza si es que el cliente manda una una imagen sino se queda con
		// la imagen q esta registrada
		if (producto.getImagenBytes() != null && producto.getImagenBytes().length > 0) {
			prdUpdate.setImagenBytes(producto.getImagenBytes());
		}

		prdUpdate.setPrecio(producto.getPrecio());
		prdUpdate.setStock(producto.getStock());
		prdUpdate.setFechaRegistro(
				producto.getFechaRegistro() != null ? producto.getFechaRegistro() : LocalDateTime.now());

		prdUpdate.setEstado(true);

		return productoRepository.save(prdUpdate);
	}

	public Producto ObtenerProductoId(Integer id) {
		Producto producto = productoRepository.findById(id).orElseThrow();
		if (producto.getImagenBytes() != null) {
			producto.setBase64Img(Base64.getEncoder().encodeToString(producto.getImagenBytes()));
		}

		return producto;
	}

	public void DesactivarProducto(Integer id) {
		Producto prdDesactivado = productoRepository.findById(id).orElseThrow();

		if (prdDesactivado != null) {
			prdDesactivado.setEstado(false);
		}
		productoRepository.save(prdDesactivado);
	}

	public List<Producto> listaProductosCategoria(Integer idCategoria, String orden) {

		return productoRepository.listaPorCategorias(idCategoria, orden);
	}

	
	public List<Object[]>totalStockPorCategoria(){
		return productoRepository.totalStockPorCategoriaDescripcion();
	}
	
	public List<Object[]>totalStockPorProveedor(){
		return productoRepository.totalStockPorProveedorRazonSocial();
	}
}
