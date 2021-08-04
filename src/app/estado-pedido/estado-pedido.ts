import { Pedido } from '../pedido/pedido';
export class EstadoPedido {
    id: number;
    nombre: string;
    datoAdicional: string;
    finEstado: boolean;
    pedido: Pedido;
}
