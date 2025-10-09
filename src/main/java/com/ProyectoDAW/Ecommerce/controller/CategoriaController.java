package com.ProyectoDAW.Ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ProyectoDAW.Ecommerce.model.Categoria;
import com.ProyectoDAW.Ecommerce.service.CategoriaService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/categoria")
public class CategoriaController {

	
	@Autowired
	CategoriaService catService;
	
	@GetMapping("/listaAll")
	public List<Categoria>listaALL() {
		return catService.getAll();
	}
	
}
