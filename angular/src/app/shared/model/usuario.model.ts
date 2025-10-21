import { Distrito } from "./distrito.model";
import { Rol } from "./rol.model";

export interface Usuario {
  idUsuario?: number;       
  nombres: string;
  apeMaterno: string;
  apePaterno: string;
  correo: string;
  clave: string;
  nroDocumento: string;
  direccion: string;
  distrito: Distrito;   
  telefono: string;
  rol: Rol;                
  fechaRegistro: string;    
  estado: boolean;
}