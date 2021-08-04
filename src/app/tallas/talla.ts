import { TipoTalla } from '../tiposTallas/TipoTalla';
import { GastoMaterialProducto } from '../gastoMaterialProducto/gastoMaterialProducto';
import { BodegaInventario } from '../bodega-inventario/bodega-inventario';

export class Talla {
    id: number;
    talla: number;
    descripcion: string;
    tipoTalla: TipoTalla;
    listaGastoMaterialProducto: GastoMaterialProducto[];
    listaBodegaInventario: BodegaInventario[];
}
