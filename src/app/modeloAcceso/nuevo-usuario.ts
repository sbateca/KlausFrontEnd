export class NuevoUsuario {
    nombre: string;
    nombreUsuario: string;
    correo: string;
    password: string;
    constructor(nombre: string, nombreUsuario: string, correo: string, password: string) {
        this.nombre = nombre;
        this.nombreUsuario = nombreUsuario;
        this.correo = correo;
        this.password = password;
    }
}
