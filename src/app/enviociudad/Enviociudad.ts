import { TipoEnvio } from '../tipoenvios/tipoenvios';
import { Ciudad } from '../ciudades/ciudad';

export class Enviociudad {
    id: number;
    tipoEnvio: TipoEnvio;
    ciudad: Ciudad;
    valorEnvio: number;
}
