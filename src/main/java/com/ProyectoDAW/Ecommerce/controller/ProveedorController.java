package com.ProyectoDAW.Ecommerce.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.*;

import com.ProyectoDAW.Ecommerce.model.Proveedor;
import com.ProyectoDAW.Ecommerce.service.ProveedorService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/proveedor")
public class ProveedorController {

	
	@Autowired
	ProveedorService _proveedorService;
	
	
	@GetMapping("/index")
	public List<Proveedor>listaProveedoresTrue(){
		return _proveedorService.findProveedorTrue();
	}
	
	@GetMapping("/findId/{id}")
	public ResponseEntity<?>FindProveedorId(@PathVariable Integer id){
		if(id == null || id.longValue() < 0) {
			return ResponseEntity.badRequest().body("No se pudo encontrar al proveedor");
		}
		return ResponseEntity.ok(_proveedorService.ObtenerId(id));
	}
	
	
	@PostMapping("/newProveedor")
	public ResponseEntity<?>nuevoProveedor(@RequestBody Proveedor proveedor) {
		
		if(proveedor == null) {
			return ResponseEntity.badRequest().body("Proveedor con credenciales invalidas");
		}
		
		return ResponseEntity.ok(_proveedorService.registrar(proveedor));
	}
	
	@PutMapping("/actualizar/{id}")
	public ResponseEntity<?> ActualizarProveedor(
			@PathVariable Integer id, @RequestBody Proveedor proveedor) {
		
		if(id == null || id.longValue() < 0 || proveedor == null ) {
			return ResponseEntity.badRequest().body("No se pudo actualizar al Proveedor");
		}
		
		return ResponseEntity.ok(_proveedorService.actualizar(id, proveedor));
	}
	
	 @PutMapping("/{id}")
	 public ResponseEntity<?> desctivarProveedor(@PathVariable Integer id){
		 
		 if(id == null || id.longValue() < 0){
			 return ResponseEntity.badRequest().body("No se obtuvo el id");
		 }
		 Proveedor provedorEncontrado = _proveedorService.ObtenerId(id);
		 	if(provedorEncontrado == null) {
		 	   return ResponseEntity.badRequest().body("Proveedor no encontrado");
		 	}
		 
	     	 _proveedorService.Desactivar(id);
	     	 
	    String mensaje = ("Se desactivo al proveedor con codigo: " + provedorEncontrado.getIdProveedor());
		 return ResponseEntity.ok(mensaje);
	 }
	
	 
	 @GetMapping("/filtroRazon")
	 public ResponseEntity<?> filtroRazonSocial(@RequestParam String razonSocial) {
	 		
		 if(razonSocial == null || razonSocial.isEmpty()) {
			 return ResponseEntity.badRequest().body("No hay valor ingresado");
		 }
		 
		 return  ResponseEntity.ok(_proveedorService.findProveedorRazonSocial(razonSocial));
	 }
	 
	 @GetMapping("/filtrorRuc")
	 public ResponseEntity<?> filtroRuc(@RequestParam String ruc) {
	 		
		 if(ruc == null || ruc.isEmpty()) {
			 return ResponseEntity.badRequest().body("No hay valor ingresado");
		 }
		
		 if(ruc.matches("^\\d+$")) {
			 return  ResponseEntity.badRequest().body("ERROR solo ingresa numeros");
		 }
		 
		 return  ResponseEntity.ok(_proveedorService.findProveedorRuc(ruc));
	 }
}
