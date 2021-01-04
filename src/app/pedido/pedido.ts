import { Cliente } from '../clientes/cliente';
import { Cotizacion } from '../cotizacion/cotizacion';
export class Pedido {
    id: number;
    valorIva: number;
    valorFinalVenta: number;
    observaciones: string;
    cliente: Cliente;
    listaCotizacion: Cotizacion[];
}
