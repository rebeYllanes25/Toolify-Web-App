import { Distrito } from "./distrito.model";

export interface Proveedor{
  idProveedor?: number;
  ruc?: string;
  razonSocial?: string;
  telefono?: string;
  direccion?: string;
  distrito: Distrito;
  fechaRegistro?: string;  
  estado?: boolean;
}