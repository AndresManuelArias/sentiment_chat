"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OrganizarDialogos = require('./OrganizarDialogos');
let organizarDialogos = new OrganizarDialogos.OrganizarDialogos('usuario');
class UsuariosMensajes {
    constructor(mensajesDescompuestos) {
        this.nombresUsuarios = organizarDialogos.coleccionar(mensajesDescompuestos);
        this.usuarios = organizarDialogos.generarDialogos(mensajesDescompuestos, this.nombresUsuarios);
    }
}
exports.UsuariosMensajes = UsuariosMensajes;
