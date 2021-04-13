import { Cliente } from '../clientes/cliente';
import { Cotizacion } from '../cotizacion/cotizacion';
import { Enviociudad } from '../enviociudad/Enviociudad';
import { Ciudad } from '../ciudades/ciudad';
export class Pedido {
    id: number;
    referencia: string;
    valorIva: number;
    valorFinalVenta: number;
    observaciones: string;
    cliente: Cliente;
    listaCotizacion: Cotizacion[];
    envioCiudad: Enviociudad;
    ciudadEnvio: Ciudad;
    direccionEnvio: string;
    valorEnvio: number;
    listaEstadoPedido: Pedido[];
    nombreUsuario: string;
}
