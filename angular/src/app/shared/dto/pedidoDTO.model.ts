import { DetalleVentaDTO } from "./detalleVentaDTO.model";

export interface PedidoDTO {
  idVenta?: number;
  idPedido?: number;
  numPedido?: string;
  idCliente?: number;
  nomCliente?: string;
  fecha?: string; // En Angular suele venir como string ISO (ej: '2025-10-27T12:00:00')
  total?: number;
  qrVerificationCode?: string;
  direccionEntrega?: string;
  latitud?: number;
  longitud?: number;
  movilidad?: string;
  detalles?: DetalleVentaDTO[];
  idRepartidor?: number;
  nomRepartidor?: string;
  apePaternoRepartidor?: string;
  telefonoRepartidor?: string;
  especificaciones?: string;
  estado?: string;
}
