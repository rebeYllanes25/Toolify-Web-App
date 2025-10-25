package com.ProyectoDAW.Ecommerce.service;

import com.ProyectoDAW.Ecommerce.dto.CalificacionDTO;
import com.ProyectoDAW.Ecommerce.model.Calificacion;
import com.ProyectoDAW.Ecommerce.model.Pedido;
import com.ProyectoDAW.Ecommerce.repository.ICalificacionRepository;
import com.ProyectoDAW.Ecommerce.repository.IPedidoRepository;
import com.ProyectoDAW.Ecommerce.repository.IVentaRepository;
import com.ProyectoDAW.Ecommerce.util.mappers.CalificacionMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class CalificacionService {

    @Autowired
    IPedidoRepository pedidoRepository;

    @Autowired
    ICalificacionRepository calificacionRepository;

    private Calificacion getCalificacionById(Integer idCalificacion) {
        return calificacionRepository.findById(idCalificacion)
                .orElseThrow(() -> new RuntimeException("Calificacion no encontrado con ID: " + idCalificacion));
    }


    // creamos el registro en la bd sin comentarios ni puntaje
    @Transactional
    public void crearRegistroCalificacion (Pedido pedido) {
        if (calificacionRepository.existsByPedidoIdPedido(pedido.getIdPedido())) {
            return;
        }

        Calificacion calificacion = new Calificacion();
        calificacion.setPedido(pedido);
        calificacion.setCliente(pedido.getVenta().getUsuario());
        calificacion.setRepartidor(pedido.getRepartidor());

        calificacionRepository.save(calificacion);
    }

    // seteamos el comentario y puntaje del cliente
    @Transactional
    public CalificacionDTO registrarCalificacion(Integer idPedido, Short puntuacion, String comentario) {
        
        Calificacion calificacionExistente = calificacionRepository.findByPedidoIdPedido(idPedido)
                .orElse(null);
        
        Calificacion calificacion;
        
        if (calificacionExistente != null) {
            calificacion = calificacionExistente;
            calificacion.setPuntuacion(puntuacion);
            calificacion.setComentario(comentario);
            calificacion.setFecha(LocalDateTime.now());
        } else {

        	Pedido pedido = pedidoRepository.findById(idPedido)
                    .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
            
            if (!"EN".equals(pedido.getEstado())) {
                throw new RuntimeException("Solo se pueden calificar pedidos entregados");
            }
            
            calificacion = new Calificacion();
            calificacion.setPedido(pedido);
            calificacion.setCliente(pedido.getVenta().getUsuario());
            calificacion.setRepartidor(pedido.getRepartidor());
            calificacion.setPuntuacion(puntuacion);
            calificacion.setComentario(comentario);
            calificacion.setFecha(LocalDateTime.now());
        }
        
        Calificacion guardada = calificacionRepository.save(calificacion);
        return CalificacionMapper.toDTO(guardada);
    }
    
    
    
    public boolean pedidoYaCalificado(Integer idPedido) {
    	return calificacionRepository.existsByPedidoIdPedido(idPedido);
    }
    
    
}
