import { Ciudad } from '../ciudades/ciudad';


export class Departamento {
    public id: number;
    public nombre: string;

    constructor(id, nombre){
        this.id = id;
        this.nombre = nombre;
    }
}
