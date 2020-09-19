import { Cliente } from '../clientes/cliente';
export class Pedido {
    id: number;
    fechaPedido: Date;
    horaPedido: Date;
    valorIva: number;
    valorFinalVenta: number;
    observaciones: string;
    cliente: Cliente;
}
