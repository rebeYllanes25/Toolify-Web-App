package com.ProyectoDAW.Ecommerce.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ProyectoDAW.Ecommerce.dto.CategoriaVentasDTO;
import com.ProyectoDAW.Ecommerce.model.Categoria;
import com.ProyectoDAW.Ecommerce.repository.ICategoriaRepository;

@Service
public class CategoriaService {
	@Autowired
	private ICategoriaRepository categoriaRepository;
	
	public List<Categoria> getAll(){
		return categoriaRepository.findAll();
	}
	
	 public List<CategoriaVentasDTO> getCategoriesMoreSales() {
		 Pageable pageable = PageRequest.of(0, 4);
	        List<Object[]> results = categoriaRepository.findCategoriasMasVendidasConCantidadProductos(pageable);
	        List<CategoriaVentasDTO> lista = new ArrayList<>();

	        for (Object[] row : results) {
	        	Integer idCategoria = (Integer) row[0];
	            String descripcion = (String) row[1];
	            Long cantidadVendida = (Long) row[2];
	            Long cantidadProductos = (Long) row[3]; 

	            lista.add(new CategoriaVentasDTO(idCategoria,descripcion, cantidadVendida, cantidadProductos));
	        }
	        return lista;
	    }
}
