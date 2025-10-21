package com.ProyectoDAW.Ecommerce.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ProyectoDAW.Ecommerce.model.Usuario;
import com.ProyectoDAW.Ecommerce.repository.IUsuarioRepository;

@Service
public class UsuarioService implements UserDetailsService{
	@Autowired
	private IUsuarioRepository usuarioRepository;
	
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
}
