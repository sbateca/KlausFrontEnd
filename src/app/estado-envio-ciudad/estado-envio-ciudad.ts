import { Pedido } from '../pedido/pedido';
import { Enviociudad } from '../enviociudad/Enviociudad';
export class EstadoEnvioCiudad {
    fechaRegistro: Date;
    fechaEnvio: Date;
    entrega: Date;
    numeroGuia: number;
    estadoEnvio: string;
    archivoAdjunto: string;
    observaciones: string;
    pedido: Pedido;
    envioCiudad: Enviociudad;
}
