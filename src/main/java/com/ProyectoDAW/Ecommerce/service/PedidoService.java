package com.ProyectoDAW.Ecommerce.service;

import com.ProyectoDAW.Ecommerce.dto.ComentarioPuntuacionDTO;
import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.dto.RepartidorImagenStatsDTO;
import com.ProyectoDAW.Ecommerce.model.Pedido;
import com.ProyectoDAW.Ecommerce.model.Venta;
import com.ProyectoDAW.Ecommerce.repository.ICalificacionRepository;
import com.ProyectoDAW.Ecommerce.repository.IPedidoRepository;
import com.ProyectoDAW.Ecommerce.repository.IUsuarioRepository;
import com.ProyectoDAW.Ecommerce.repository.IVentaRepository;
import com.ProyectoDAW.Ecommerce.util.FechaUtils;
import com.ProyectoDAW.Ecommerce.util.mappers.PedidoMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PedidoService {

    @Autowired
    private IPedidoRepository pedidoRepository;

    @Autowired
    private IVentaRepository ventaRepository;

    @Autowired
    private CalificacionService calificacionService;

    @Autowired
    private IUsuarioRepository usuarioRepository;

    @Autowired
    private NotificacionService notificacionService;
    
    @Autowired
    private ICalificacionRepository calificacionRepository;
    
    
    @Autowired
    private SimpMessagingTemplate msgtemplate;

    private Pedido getPedidoById(Integer idPedido) {
        return pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con ID: " + idPedido));
    }

    @Transactional
    public List<PedidoDTO> listarPedidosPendientes() {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPorEstado("PE");
        return pedidos.stream().map(PedidoMapper::toDTO).toList();
    }
    
    @Transactional
    public List<PedidoDTO> listarPedidosAceptados() {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPorEstado("AS");
        return pedidos.stream().map(PedidoMapper::toDTO).toList();
    }

    @Transactional
    public List<PedidoDTO> listarPedidosPorClienteYEstado(Integer idCliente, String estado) {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPorClienteYEstado(idCliente, estado);
        return pedidos.stream().map(PedidoMapper::toDTO).toList();
    }
    
    @Transactional
    public List<PedidoDTO> listarPedidosPorCliente(Integer idCliente) {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPorCliente(idCliente);
        return pedidos.stream().map(PedidoMapper::toDTO).toList();
    }
    
    @Transactional
    public List<PedidoDTO> listarPedidosPorClienteInicio(Integer idCliente) {
        List<Pedido> pedidos = pedidoRepository.listarPedidosPorClienteInicio(idCliente);
        return pedidos.stream().map(PedidoMapper::toDTO).toList();
    }

    @Transactional
    public PedidoDTO actualizarEstado(Integer idPedido, String estado) {
        int filas = pedidoRepository.actualizarEstado(idPedido, estado);

        if (filas == 0) {
            throw new RuntimeException("Error: No se encontró el Pedido con ID " + idPedido + " o el estado ya era " + estado + ".");
        }   
        
        Pedido pedidoActualizado = getPedidoById(idPedido);
        
        if ("AS".equals(pedidoActualizado.getEstado())) {
            
            pedidoActualizado.setFechaAsignacion(LocalDateTime.now());
            pedidoRepository.save(pedidoActualizado);
            
            String tipoNotificacion = mapearEstadoATipo("AS");
            notificacionService.crearYEnviarNotificacion(
                    pedidoActualizado.getVenta().getUsuario(),
                    pedidoActualizado,
                    tipoNotificacion
            );
        }
        
        actualizarCambiosEstadosWebsockets(pedidoActualizado,"PE","AS",null,"A");
        
        return PedidoMapper.toDTO(pedidoActualizado);
    }

    @Transactional
    public PedidoDTO registrarRepartidor(Integer idPedido, Integer idRepartidor) {
        if (!usuarioRepository.existsById(idRepartidor)) {
            throw new RuntimeException("Error: El repartidor con ID " + idRepartidor + " no existe.");
        }

        int exito = pedidoRepository.registrarRepartidor(idPedido, idRepartidor);
        int exito2 = pedidoRepository.actualizarEstado(idPedido, "AS");

        if (exito == 0 || exito2 == 0) {
            throw new RuntimeException("Error: No se encontró el Pedido con ID " + idPedido + " para asignar el repartidor.");
        }
        
        Pedido pedidoActualizado = getPedidoById(idPedido);
        pedidoActualizado.setFechaAsignacion(LocalDateTime.now());
        pedidoRepository.save(pedidoActualizado);

        return PedidoMapper.toDTO(pedidoActualizado);
    }
    
    @Transactional
    public PedidoDTO enCaminoPedido(Integer idPedido, Integer idRepartidor) {
        if (!usuarioRepository.existsById(idRepartidor)) {
            throw new RuntimeException("Error: El repartidor con ID " + idRepartidor + " no existe.");
        }
        
        String estadoAnterior = getPedidoById(idPedido).getEstado();

        int exito = pedidoRepository.registrarRepartidor(idPedido, idRepartidor);
        int exito2 = pedidoRepository.actualizarEstado(idPedido, "EC");

        if (exito == 0 || exito2 == 0) {
            throw new RuntimeException("Error: No se encontró el Pedido con ID " + idPedido + " para asignar el repartidor.");
        }
        Pedido pedidoActualizado = getPedidoById(idPedido);
        
        if ("EC".equals(pedidoActualizado.getEstado())) {
        	pedidoActualizado.setFechaEnCamino(LocalDateTime.now());
        }
        String tipoNotificacion = mapearEstadoATipo("EC");
        notificacionService.crearYEnviarNotificacion(
                pedidoActualizado.getVenta().getUsuario(),
                pedidoActualizado,
                tipoNotificacion
        );
        
        actualizarCambiosEstadosWebsockets(pedidoActualizado,estadoAnterior,"EC",pedidoActualizado.getRepartidor().getIdUsuario(),"R");
        return PedidoMapper.toDTO(pedidoActualizado);
    }

    
    @Transactional
    public PedidoDTO cercaPedido(Integer idPedido) {
        // Verificar que el pedido existe y está en camino
        Pedido pedido = getPedidoById(idPedido);
        
        if (!"EC".equals(pedido.getEstado())) {
            throw new RuntimeException("Error: El pedido con ID " + idPedido + " debe estar en estado 'En Camino' para marcarlo como cerca.");
        }
        
        String estadoAnterior = getPedidoById(idPedido).getEstado();
        
        // Actualizar el estado a "CR" (Cerca)
        int exito = pedidoRepository.actualizarEstado(idPedido, "CR");
        
        if (exito == 0) {
            throw new RuntimeException("Error: No se pudo actualizar el estado del Pedido con ID " + idPedido + " a 'Cerca'.");
        }
        
        // Obtener el pedido actualizado
        Pedido pedidoActualizado = getPedidoById(idPedido);
        
        // Registrar la fecha cuando está cerca
        if ("CR".equals(pedidoActualizado.getEstado())) {
            pedidoActualizado.setFechaEnCamino(LocalDateTime.now());
        }
        
        // Crear y enviar notificación
        String tipoNotificacion = mapearEstadoATipo("CR");
        notificacionService.crearYEnviarNotificacion(
                pedidoActualizado.getVenta().getUsuario(),
                pedidoActualizado,
                tipoNotificacion
        );
        
        actualizarCambiosEstadosWebsockets(pedidoActualizado,estadoAnterior,"CR",pedidoActualizado.getRepartidor().getIdUsuario(),"R");
        
        return PedidoMapper.toDTO(pedidoActualizado);
    }
    
    
    
    public PedidoDTO buscarPedidoPorId(Integer idPedido) {
        Pedido pedido = getPedidoById(idPedido);
        return PedidoMapper.toDTO(pedido);
    }

    @Transactional
    public PedidoDTO verificarEntrega(Integer idPedido, String codigoQR, Integer idRepartidor) {

        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Error: No se encontró el pedido con ID " + idPedido));

        if (!pedido.getQrVerificacion().equals(codigoQR)) {
            throw new RuntimeException("Error: El código QR no coincide con el pedido.");
        }

        String estadoAnterior = pedido.getEstado();
        // Validar repartidor
        if (pedido.getRepartidor() == null || !pedido.getRepartidor().getIdUsuario().equals(idRepartidor)) {
            throw new RuntimeException("Error: El pedido no está asignado a este repartidor.");
        }

        // Actualizar estado
        pedido.setEstado("EN");
        pedido.setFechaEntregado(LocalDateTime.now());
        actualizarTiempoEntrega(pedido.getIdPedido());
        pedidoRepository.save(pedido);

        // Actualizar venta
        Venta venta = pedido.getVenta();
        venta.setEstado("E");
        ventaRepository.save(venta);

        // Notificar al cliente
        String tipoNotificacion = mapearEstadoATipo("EN");
        notificacionService.crearYEnviarNotificacion(
                pedido.getVenta().getUsuario(),
                pedido,
                tipoNotificacion
        );

        
        actualizarCambiosEstadosWebsockets(pedido,estadoAnterior,"EN",idRepartidor,"R");
        
        return PedidoMapper.toDTO(pedido);
    }


    public void actualizarTiempoEntrega(Integer idPedido) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        LocalDateTime fechaEnCamino = pedido.getFechaEnCamino();
        LocalDateTime fechaEntregado = pedido.getFechaEntregado();

        Long minutos = FechaUtils.calcularDiferenciaMinutos(fechaEnCamino, fechaEntregado);

        if (minutos != null) {
            pedido.setTiempoEntrega(minutos.shortValue());
            pedidoRepository.save(pedido);
        }
    }

    private String mapearEstadoATipo(String estado) {
        return switch (estado.toUpperCase()) {
            case "PE" -> "PEDIDO_PENDIENTE";
            case "AS" -> "PEDIDO_ACEPTADO";
            case "EC" -> "PEDIDO_EN_CAMINO";
            case "CR" -> "PEDIDO_CERCA";
            case "EN" -> "PEDIDO_ENTREGADO";
            case "FA", "CANCELADO" -> "PEDIDO_FALLIDO";
            default -> "PEDIDO_PENDIENTE";
        };
    }
    
    private String generarMensajes(String estado) {
    	return switch (estado.toUpperCase()) {
        case "PE" -> "Pedido estado pendiente";
        case "AS" -> "Pedido estado aceptado";
        case "EC" -> "Pedido estado en camino";
        case "CR" -> "Pedido estado cerca";
        case "EN" -> "Pedido estado entregado";
        case "FA", "CANCELADO" -> "Pedido estado pendiente";
        default -> "Estado actualizando";
    };
    }

    
    public ComentarioPuntuacionDTO findComentarionPuntuacion(Integer idPedido) {
    	return pedidoRepository.comentarioPuntuacion(idPedido);
    }
    
    
    private void actualizarCambiosEstadosWebsockets(
    		Pedido pedido,
    		String estadoAnterior,
    		String estadoNuevo,
    		Integer usuarioId,
    		String rol) {
    	Map<String,Object> estadosUpdate = new HashMap<>();
    	estadosUpdate.put("pedidoId", pedido.getIdPedido());
    	estadosUpdate.put("numeroPedido", pedido.getNumPedido());
    	estadosUpdate.put("estadoAnterior", estadoAnterior);
    	estadosUpdate.put("estadoNuevo", estadoNuevo);
    	estadosUpdate.put("mensaje", generarMensajes(estadoNuevo));
    	estadosUpdate.put("timestamp", LocalDateTime.now().toString());
    	estadosUpdate.put("usuarioId", usuarioId);
    	estadosUpdate.put("rol", rol);
    	
    	String destinatarios = "/topic/pedido/" + pedido.getIdPedido() + "/notificionCliente";
    	msgtemplate.convertAndSend(destinatarios,estadosUpdate);
    	
    	  System.out.println(" WebSocket enviado a: " + destinatarios);
          System.out.println("   Estado: " + estadoAnterior + " → " + estadoNuevo);
    }
    
    
    
    // Graficos

    public List<Object[]> resumenMensualVentasPedidos(){
        return pedidoRepository.resumenMensualVentasPedidos(2025);
    }

	public Map<String, Object> obtenerEstadisticasRepartidor(Integer idRepartidor) {
		Map<String, Object> estadisticas = new HashMap<>();
	    
	    // 1. Número total de entregas (pedidos con estado "EN" - Entregado)
	    Long totalEntregas = pedidoRepository.contarPedidosEntregadosPorRepartidor(idRepartidor);
	    
	    // 2. Tiempo promedio de entrega
	    Double tiempoPromedio = pedidoRepository.calcularTiempoPromedioEntrega(idRepartidor);
	    
	    // 3. Calificación promedio - USAR EL MÉTODO QUE YA TIENES
	    Double calificacionPromedio = calificacionRepository.obtenerPromedioRepartidor(idRepartidor);
	    
	    estadisticas.put("totalEntregas", totalEntregas != null ? totalEntregas : 0);
	    estadisticas.put("tiempoPromedio", tiempoPromedio != null ? tiempoPromedio : 0.0);
	    estadisticas.put("calificacionPromedio", calificacionPromedio != null ? calificacionPromedio : 0.0);
	    
	    return estadisticas;
	}
}
