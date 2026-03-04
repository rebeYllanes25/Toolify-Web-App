package com.ProyectoDAW.Ecommerce.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ProyectoDAW.Ecommerce.dto.PerfilDetalleComprasDto;
import com.ProyectoDAW.Ecommerce.dto.response.ResultadoResponse;
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
	
	
	public PerfilDetalleComprasDto obtenerPerfilConDetalle(Integer idUsuario) {
		
		List<Object[]> resultados = usuarioRepository.perfilDetalleCompras(idUsuario);

		if (resultados == null) {
            throw new RuntimeException("No se encontró información del usuario");
        }
		
		 Object[] row = resultados.get(0);
	        
	        PerfilDetalleComprasDto dto = new PerfilDetalleComprasDto();
	        dto.setIdUser((Integer) row[0]);
	        dto.setImagenUsuario((String) row[1]);
	        dto.setNombresCompletos((String) row[2]);
	        dto.setCorreo((String) row[3]);
	        dto.setNroDoc((String) row[4]);
	        dto.setDireccion((String) row[5]);
	        dto.setDistrito((String) row[6]);
	        dto.setTelefono((String) row[7]);
	        dto.setFechaRegistro((String) row[8]);
	        dto.setProductoMasComprado((String) row[9]);
	        dto.setFechaMayorCompras((String) row[10]);
	        dto.setTotalDeProductosComprados((Long) row[11]);
	        dto.setGastoTotal(row[12] != null ? ((Number) row[12]).doubleValue() : 0.0);
	        dto.setCategoriaMasComprada((String) row[13]);
	        dto.setTotalVentas((Long) row[14]);
	        
	        return dto;
	}

    public void actualizarFcmToken(Integer usuarioId, String token) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setFcmToken(token);
        usuario.setFcmTokenFecha(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    public void eliminarFcmToken(Integer usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setFcmToken(null);
        usuarioRepository.save(usuario);
    }
	
}