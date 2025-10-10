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

        Calificacion calificacion = calificacionRepository.findByPedidoIdPedido(idPedido)
                .orElseThrow(() -> new RuntimeException("Error: No existe un registro de calificación inicial para este pedido."));

        if (puntuacion < 1 || puntuacion > 5) {
            throw new IllegalArgumentException("La puntuación debe estar entre 1 y 5.");
        }

        calificacion.setPuntuacion(puntuacion);
        calificacion.setComentario(comentario);
        calificacion.setFecha(LocalDateTime.now());

        Calificacion calificacionGuardada = calificacionRepository.save(calificacion);

        return CalificacionMapper.toDTO(calificacionGuardada);
    }
}
