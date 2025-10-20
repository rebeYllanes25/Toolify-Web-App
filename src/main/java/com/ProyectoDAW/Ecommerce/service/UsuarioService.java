package com.ProyectoDAW.Ecommerce.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ProyectoDAW.Ecommerce.dto.ResultadoResponse;
import com.ProyectoDAW.Ecommerce.model.Rol;
import com.ProyectoDAW.Ecommerce.model.Usuario;
import com.ProyectoDAW.Ecommerce.repository.IRolRepository;
import com.ProyectoDAW.Ecommerce.repository.IUsuarioRepository;

@Service
public class UsuarioService implements UserDetailsService{
	@Autowired
	private IUsuarioRepository usuarioRepository;
	
	@Autowired
	private IRolRepository rolRepository;
	
	public long countClientes() {
		return usuarioRepository.count();
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		return usuarioRepository.findUsuarioByCorreo(username)
				.map(u ->
					User.withUsername(username)
					.password("{noop}" + u.getClave()).roles(u.getRol().getDescripcion().replace("ROLE_", "")).build()
				).orElseThrow();
		
	}
	
	public Optional<Usuario> obtenerDatos(String username) {
		return usuarioRepository.findUsuarioByCorreo(username);
	}
	
	public ResultadoResponse createUser(Usuario user) {
	    ResultadoResponse response = new ResultadoResponse();

	    if (usuarioRepository.findByCorreo(user.getCorreo()).isPresent()) {
	        response.setValor(false);
	        response.setMensaje("Ya existe un usuario con ese correo.");
	        return response;
	    }

	    if (usuarioRepository.findByNroDocumento(user.getNroDocumento()).isPresent()) {
	    	response.setValor(false);
	    	response.setMensaje("Ya existe un usuario con ese número de documento.");
	        return response;
	    }

	    if (usuarioRepository.findByTelefono(user.getTelefono()).isPresent()) {
	    	response.setValor(false);
	    	response.setMensaje("Ya existe un usuario con ese teléfono.");
	        return response;
	    }

	    Rol rolCliente = rolRepository.findByDescripcion("C")
	            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

	    user.setRol(rolCliente);
	    user.setFechaRegistro(LocalDateTime.now());
	    user.setEstado(true);

	    usuarioRepository.save(user);
        response.setValor(true);
	    response.setMensaje("Usuario creado correctamente.");
	    return response;
	}
}
