import { DetalleVentaDTO } from "./detalleVentaDTO.model";
import { UsuarioDTO } from "./usuarioDTO.model";


export interface VentaDTO {
  idVenta: number;
  usuario: UsuarioDTO;
  fechaRegistro: string;
  total: number;
  estado: string;
  tipoVenta: string;
  detalles: DetalleVentaDTO[];
}
