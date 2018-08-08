const OrganizarDialogos = require('./organizarDialogos');
let organizarDialogos = new OrganizarDialogos.OrganizarDialogos('usuario');
export class UsuariosMensajes {
    public usuarios:any;
    public nombresUsuarios:string[];
    constructor(mensajesDescompuestos:any[]){
        this.nombresUsuarios = organizarDialogos.coleccionar(mensajesDescompuestos);
        this.usuarios = organizarDialogos.generarDialogos(mensajesDescompuestos,this.nombresUsuarios);
    }
}