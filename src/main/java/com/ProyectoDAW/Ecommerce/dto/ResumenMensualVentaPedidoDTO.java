package com.ProyectoDAW.Ecommerce.dto;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResumenMensualVentaPedidoDTO {
    private String mes;
    private int totalVentas;
    private int totalPedidos;
}
