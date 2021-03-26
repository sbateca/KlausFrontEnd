import { Ciudad } from '../ciudades/ciudad';

export class Proveedor {
    id: number;
    nombres: string;
    apellidos: string;
    documento: number;
    nit: string;
    numeroContacto: number;
    correoElectronico: string;
    direccionResidencia: string;
    ciudad: Ciudad;
}
