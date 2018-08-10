"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OrganizarDialogos {
    constructor(criterioPropiedad1) {
        this.criterioPropiedad = criterioPropiedad1;
    }
    generarDialogos(mensajesDescompuestos, nombres) {
        let criterioDialogo = {};
        // console.log('nombres',nombres)
        nombres.forEach((nombre) => {
            // console.log('nombre',nombre);
            let estruturaDialogos = { dialogoPorDias: [""], dialogos: "" };
            criterioDialogo[nombre] = estruturaDialogos;
            criterioDialogo[nombre]['dialogoPorDias'] = mensajesDescompuestos.filter(dialogo => {
                // console.log('dialogo',dialogo);
                // console.log('this.criterioPropiedad',this.criterioPropiedad);
                return nombre == dialogo[this.criterioPropiedad];
            });
            criterioDialogo[nombre]['dialogos'] = "";
            criterioDialogo[nombre]['dialogoPorDias'].forEach((dialogue) => {
                criterioDialogo[nombre]['dialogos'] += dialogue.dialogo + ". ";
            });
        });
        return criterioDialogo;
    }
    coleccionar(dialogos) {
        // console.log('this.criterioPropiedad',criterioPropiedad)
        let coleccionando = this.guardarColecion(this.criterioPropiedad);
        let resultado = [];
        dialogos.forEach((dato) => {
            resultado = coleccionando(dato);
        });
        return resultado;
    }
    guardarColecion(propiedadGuardar) {
        let colecion = [];
        return (dato) => {
            if (!colecion.some((info) => info == dato[propiedadGuardar])) {
                colecion.push(dato[propiedadGuardar]);
            }
            return colecion;
        };
    }
}
exports.OrganizarDialogos = OrganizarDialogos;
