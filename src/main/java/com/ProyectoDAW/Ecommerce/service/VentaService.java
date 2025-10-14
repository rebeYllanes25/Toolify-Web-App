package com.ProyectoDAW.Ecommerce.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.ProyectoDAW.Ecommerce.model.*;
import com.ProyectoDAW.Ecommerce.repository.IPedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ProyectoDAW.Ecommerce.dto.DetalleVentaDTO;
import com.ProyectoDAW.Ecommerce.dto.ResultadoResponse;
import com.ProyectoDAW.Ecommerce.dto.UsuarioDTO;
import com.ProyectoDAW.Ecommerce.dto.VentaDTO;
import com.ProyectoDAW.Ecommerce.dto.PedidoDTO;
import com.ProyectoDAW.Ecommerce.dto.VentaFiltroFechaTipoUsuario;
import com.ProyectoDAW.Ecommerce.repository.IProductoRepository;
import com.ProyectoDAW.Ecommerce.repository.IUsuarioRepository;
import com.ProyectoDAW.Ecommerce.repository.IVentaRepository;
import com.ProyectoDAW.Ecommerce.util.GeneradorUtil;

import jakarta.transaction.Transactional;


@Service
public class VentaService {

	@Autowired
	private IVentaRepository ventaRepository;

	@Autowired
	private IProductoRepository productoRepository;
	
	@Autowired
	private IUsuarioRepository usuarioRepository;


	public List<VentaDTO> getVentasPorUsuario(Integer idUsuario) {
		List<Venta> ventas = ventaRepository.findByUsuarioId(idUsuario);
		return ventas.stream().map(this::mapVentaToDTO).collect(Collectors.toList());
	}

	public List<Venta> getVentaForIdUser(Integer idUsuario) {
		return ventaRepository.findByUsuarioId(idUsuario);
	}

    public Venta obtenerVentaPorUsuario(Integer idVenta, Integer idUsuario) {
        Optional<Venta> ventaOpt = ventaRepository.findById(idVenta);
        return ventaOpt.filter(v -> v.getUsuario().getIdUsuario().equals(idUsuario)).orElse(null);
    }
    /* Mapper conviertiendo la entidad venta al dto */
    private VentaDTO mapVentaToDTO(Venta venta) {
        VentaDTO dto = new VentaDTO();
        dto.setIdVenta(venta.getIdVenta());

        UsuarioDTO usuarioDto = new UsuarioDTO();
        usuarioDto.setIdUsuario(venta.getUsuario().getIdUsuario());
        usuarioDto.setNombres(venta.getUsuario().getNombres());
        usuarioDto.setCorreo(venta.getUsuario().getCorreo());
        dto.setUsuario(usuarioDto);

        dto.setFechaRegistro(venta.getFechaRegistro());
        dto.setTotal(venta.getTotal());
        dto.setEstado(venta.getEstado());
        dto.setTipoVenta(venta.getTipoVenta());

        List<DetalleVentaDTO> detallesDto = venta.getDetalles().stream().map(det -> {
            DetalleVentaDTO detalleDto = new DetalleVentaDTO();
            detalleDto.setIdDetalleVenta(det.getIdDetalleVenta());
            detalleDto.setNombreProducto(det.getProducto().getNombre());
            detalleDto.setCantidad(det.getCantidad());
            detalleDto.setSubTotal(det.getSubTotal());
            return detalleDto;
        }).collect(Collectors.toList());

        dto.setDetalles(detallesDto);

        return dto;
    }


	@Transactional
	public ResultadoResponse guardarVentaDelivery(Venta venta) {
        try {

            if (venta.getIdVenta() != null) venta.setIdVenta(null);
            venta.setTipoVenta("R");
            venta.setEstado("P");

            Usuario usuario = usuarioRepository.findById(venta.getUsuario().getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
            venta.setUsuario(usuario);

            List<DetalleVenta> detallesProcesados = venta.getDetalles().stream()
                    .map(detalle -> {
                        Producto producto = productoRepository.findById(detalle.getProducto().getIdProducto())
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado."));

                        if (producto.getStock() < detalle.getCantidad()) {
                            throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
                        }

                        productoRepository.actualizarStock(producto.getIdProducto(), producto.getStock() - detalle.getCantidad());

                        detalle.setVenta(venta); // Establece la relación bidireccional crucial
                        detalle.setProducto(producto);
                        detalle.setSubTotal(producto.getPrecio() * detalle.getCantidad());
                        return detalle;
                    }).toList();
            venta.getDetalles().clear();
            venta.getDetalles().addAll(detallesProcesados);
            venta.setTotal(detallesProcesados.stream().mapToDouble(DetalleVenta::getSubTotal).sum());

            // Asignación de especificaciones por defecto
            if (venta.getEspecificaciones() == null || venta.getEspecificaciones().isBlank()) {
                venta.setEspecificaciones("Venta autogestionada");
            }

            // Gestión del pedido si es de delivery
            if ("D".equals(venta.getMetodoEntrega()) && venta.getPedido() != null) {

                Pedido pedido = venta.getPedido();
                pedido.setVenta(venta);
                pedido.setNumPedido(GeneradorUtil.generarCodigoPedido());
                pedido.setQrVerificacion(GeneradorUtil.generarCodigoPedido());
                pedido.setEstado("PE");

                venta.setPedido(pedido);

            } else {
                venta.setPedido(null);
            }

            Venta ventaGuardada = ventaRepository.save(venta);

            return new ResultadoResponse(true, "Venta registrada con ID: " + ventaGuardada.getIdVenta());
        } catch (Exception e) {
            return new ResultadoResponse(false, "Error al registrar la venta: " + e.getMessage());
        }
	}



    @Transactional
	public ResultadoResponse guardarVenta(Venta venta) {
        try {

            if (venta.getIdVenta() != null) venta.setIdVenta(null);
            venta.setTipoVenta("P");
            venta.setEstado("G");
            venta.setMetodoEntrega("S");

            Usuario usuario = usuarioRepository.findById(venta.getUsuario().getIdUsuario())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado."));
            venta.setUsuario(usuario);

            List<DetalleVenta> detallesProcesados = venta.getDetalles().stream()
                    .map(detalle -> {
                        Producto producto = productoRepository.findById(detalle.getProducto().getIdProducto())
                                .orElseThrow(() -> new RuntimeException("Producto no encontrado."));

                        if (producto.getStock() < detalle.getCantidad()) {
                            throw new RuntimeException("Stock insuficiente para: " + producto.getNombre());
                        }

                        productoRepository.actualizarStock(producto.getIdProducto(), producto.getStock() - detalle.getCantidad());

                        detalle.setVenta(venta); // Establece la relación bidireccional crucial
                        detalle.setProducto(producto);
                        detalle.setSubTotal(producto.getPrecio() * detalle.getCantidad());
                        return detalle;
                    }).toList();
            venta.getDetalles().clear();
            venta.getDetalles().addAll(detallesProcesados);
            venta.setTotal(detallesProcesados.stream().mapToDouble(DetalleVenta::getSubTotal).sum());

            // Asignación de especificaciones por defecto
            if (venta.getEspecificaciones() == null || venta.getEspecificaciones().isBlank()) {
                venta.setEspecificaciones("Venta presencial");
            }

            // Gestión del pedido si es de delivery
            if ("D".equals(venta.getMetodoEntrega()) && venta.getPedido() != null) {

                Pedido pedido = venta.getPedido();
                pedido.setVenta(venta);
                pedido.setNumPedido(GeneradorUtil.generarCodigoPedido());
                pedido.setQrVerificacion(GeneradorUtil.generarCodigoPedido());
                pedido.setEstado("PE");

                venta.setPedido(pedido);

            } else {
                venta.setPedido(null);
            }

            Venta ventaGuardada = ventaRepository.save(venta);

            return new ResultadoResponse(true, "Venta registrada con ID: " + ventaGuardada.getIdVenta());
        } catch (Exception e) {
            return new ResultadoResponse(false, "Error al registrar la venta: " + e.getMessage());
        }
	}

	// Vista-Inicio-Vendedor
	private String obtenerMesActual() {
		LocalDate fechaActual = LocalDate.now();
		DateTimeFormatter formatoMes = DateTimeFormatter.ofPattern("yyyy-MM");
		return fechaActual.format(formatoMes);
	}

	public Long obtenerTotalVentasMensual() {
		String fechaMes = obtenerMesActual();
		return ventaRepository.contarVentasPorMes(fechaMes);
	}

	public Long obtenerTotalProductosVendidosMensual() {
		String fechaMes = obtenerMesActual();
		return ventaRepository.contarProductosVendidosPorMes(fechaMes);
	}

	public Long obtenerTotalClientesAtendidosMensual() {
		String fechaMes = obtenerMesActual();
		return ventaRepository.contarClientesAtendidosPorMes(fechaMes);
	}

	// Vista-Historial-vendedor
	public Long obtenerTotalVentas() {
		return ventaRepository.obtenerTotalVentas();
	}

	public Long obtenerTotalProductosVendidos() {
		return ventaRepository.obtenerTotalProductosVendidos();
	}

	public Double obtenerIngresosTotales() {
		return ventaRepository.obtenerIngresosTotales();
	}


    // LISTADOS PARA LOS GRAFICOS

	public List<VentaFiltroFechaTipoUsuario> ListadoVentaFechaAndTipoVenta(LocalDate fechaInicio, LocalDate fechaFin, String tipoVenta){
		return ventaRepository.ListadoVentaFechaAndTipoVenta(fechaInicio, fechaFin, tipoVenta);
	}
	
	public List<VentaFiltroFechaTipoUsuario>ListadoVentaFechaAndTipoVentaNull(){
		return ventaRepository.ListadoVentaFechaAndTipoVentaNull();
	}

	public List<Object[]> listadoVentaPorMes(){
		return ventaRepository.listadoVentaPorMes();
	}
	
	public List<Object[]>listadoDeTipoDeVentasPorMes(){
		return ventaRepository.listadoDeTipoDeVentasPorMes();
	}
	
	public List<Object[]>listadoDeDistroPorVentas(){
		return ventaRepository.listaVentaPorDistrito();
	}

	
}
