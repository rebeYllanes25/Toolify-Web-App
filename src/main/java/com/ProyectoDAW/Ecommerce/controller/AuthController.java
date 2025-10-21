package com.ProyectoDAW.Ecommerce.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ProyectoDAW.Ecommerce.model.Usuario;
import com.ProyectoDAW.Ecommerce.service.UsuarioService;
import com.ProyectoDAW.Ecommerce.util.JwtUtil;



@RestController
@RequestMapping("/auth")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final JwtUtil jwtUtil;
	private final UsuarioService usuarioService;
	public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,UsuarioService usuarioService) {
		this.authenticationManager = authenticationManager;
		this.jwtUtil = jwtUtil;
		this.usuarioService = usuarioService;
	}
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestParam("correo") String username,
	                               @RequestParam("clave") String password) {
	    Authentication auth = authenticationManager.authenticate(
	            new UsernamePasswordAuthenticationToken(username, password)
	    );

	    UserDetails userDetails = (UserDetails) auth.getPrincipal();

	    // Obtener roles como nombres
	    List<String> roles = userDetails.getAuthorities()
	                                    .stream()
	                                    .map(GrantedAuthority::getAuthority)
	                                    .collect(Collectors.toList());

	    String token = jwtUtil.generateToken(username, roles); // token incluye roles
	    return ResponseEntity.ok(Map.of("token", token));
	}

	@GetMapping("/me")
    public ResponseEntity<?> getUsuarioInfo(Authentication authentication) {
        String correo = authentication.getName();
        Optional<Usuario> usuarioOpt = usuarioService.obtenerDatos(correo);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        return ResponseEntity.ok(usuario); // Devuelve directamente el objeto Usuario
    }


}
