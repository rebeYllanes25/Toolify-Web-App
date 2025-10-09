package com.ProyectoDAW.Ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ProyectoDAW.Ecommerce.repository.IRolRepository;

@Service
public class RolService {
	@Autowired
	private IRolRepository rolRepository;
}
