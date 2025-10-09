export interface VentaFiltroFechaTipoUsuario {
    idVenta:number;
    nombresCompletos:string;
    direccionUser:string;
    fecha:string;
    total:number;
    estado:string;
    tipoVenta?: 'P' | 'R' ;
}