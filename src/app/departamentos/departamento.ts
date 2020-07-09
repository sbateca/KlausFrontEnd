import { Ciudad } from '../ciudades/ciudad';


export class Departamento {
    public id: number;
    public nombre: string;

    constructor(id: number, nombre: string) {
        this.nombre = nombre;
        this.id = id;
    }
}
