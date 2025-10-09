package com.ProyectoDAW.Ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ProyectoDAW.Ecommerce.repository.IDistritoRepository;

@Service
public class DistritoService {
	@Autowired
	private IDistritoRepository distritoRepository;
}
