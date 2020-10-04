import { ReferenciaProducto } from '../referenciaProducto/referencia-producto';
export class BodegaInventario {
    id: number;
    cantidad: number;
    estadoDescuento: boolean;
    descuento: number;
    referenciaProducto: ReferenciaProducto[];
}
