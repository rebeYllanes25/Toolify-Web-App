package com.ProyectoDAW.Ecommerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ProyectoDAW.Ecommerce.model.Distrito;
import com.ProyectoDAW.Ecommerce.service.DistritoService;

@RestController
@RequestMapping("/distrito")
public class DistritoController {
	@Autowired
	private DistritoService distritoService;

	
	/*@GetMapping("/list")
	public List<Distrito> listarDistritos() {
		return distritoService.getAll();
	}*/
}
