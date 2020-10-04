import { TipoTalla } from '../tiposTallas/TipoTalla';
import { Producto } from '../productos/producto';
import { ComponentesInventario } from './componentes-inventario';
export class TipoTallaProducto {
    tipoTalla: TipoTalla;
    producto: Producto;
    listacomponentesinventario: ComponentesInventario[];
}
