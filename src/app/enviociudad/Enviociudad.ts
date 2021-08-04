import { TipoEnvio } from '../tipoenvios/tipoenvios';
import { Ciudad } from '../ciudades/ciudad';
import { EmpresaTransportadora } from '../EmpresaTransportadora/empresa-transportadora';
import { Pedido } from '../pedido/pedido';

export class Enviociudad {
    id: number;
    tipoEnvio: TipoEnvio;
    ciudad: Ciudad;
    empresaTransportadora: EmpresaTransportadora;
    valorEnvio: number;
    listaPedido: Pedido[];
}
