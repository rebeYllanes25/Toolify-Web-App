package com.ProyectoDAW.Ecommerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ProyectoDAW.Ecommerce.model.Distrito;
import com.ProyectoDAW.Ecommerce.repository.IDistritoRepository;

@Service
public class DistritoService {
	@Autowired
	private IDistritoRepository distritoRepository;
	
	public List<Distrito> getAll(){
		return distritoRepository.findAll();
	}
}
