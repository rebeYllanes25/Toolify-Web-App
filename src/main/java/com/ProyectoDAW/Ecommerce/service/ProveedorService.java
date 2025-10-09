package com.ProyectoDAW.Ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

import com.ProyectoDAW.Ecommerce.model.Distrito;
import com.ProyectoDAW.Ecommerce.model.Proveedor;
import com.ProyectoDAW.Ecommerce.repository.IProveedorRepository;

@Service
public class ProveedorService {
	@Autowired
	private IProveedorRepository proveedorRepository;
	
	
	public List<Proveedor> findProveedorTrue(){
		
		return proveedorRepository.findProveedoresActivos();
	}
	
	public List<Proveedor> findProveedorRazonSocial(String razonSocial ){
		return proveedorRepository.findProveedoresRazonSocial(razonSocial);
	}
	
	public List<Proveedor> findProveedorRuc(String ruc){
		return proveedorRepository.findProveedoresRuc(ruc);
	}
	
	public Proveedor registrar(Proveedor proveedor) {
		return proveedorRepository.save(proveedor);
	}

	public Proveedor actualizar (Integer id,Proveedor proveedor) {
		Proveedor updateProveedor = proveedorRepository.findById(id).orElseThrow();
		
		updateProveedor.setRuc(proveedor.getRuc());
		updateProveedor.setRazonSocial(proveedor.getRazonSocial());
		updateProveedor.setTelefono(proveedor.getTelefono());
		updateProveedor.setDireccion(proveedor.getDireccion());
		
		Distrito distritoBuscar = new Distrito();
		distritoBuscar.setIdDistrito(proveedor.getDistrito().getIdDistrito());
		updateProveedor.setDistrito(distritoBuscar);

		updateProveedor.setFechaRegistro(proveedor.getFechaRegistro()!=null
				? proveedor.getFechaRegistro()
				: LocalDateTime.now()
				);

		updateProveedor.setEstado(true);
		
		return proveedorRepository.save(proveedor);
	}

	public void Desactivar(Integer id) {
		Proveedor provDesactivado = proveedorRepository.findById(id).orElseThrow();
	
		if(provDesactivado!=null) {
			provDesactivado.setEstado(false);
		}
		
		proveedorRepository.save(provDesactivado);
	}
	
	public Proveedor ObtenerId (Integer id) {
		return proveedorRepository.findById(id).orElseThrow();
	}
	
}
