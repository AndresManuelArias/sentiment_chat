"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fechaFormat = require("fecha");
class GenerarDialogos {
    constructor(dialogos, formatDAte, expresionSeparadorDialogoDate) {
        let unionDialogo;
        dialogos.forEach(dialogo => {
            unionDialogo += dialogo;
        });
        let dialogoUsuarios = this.generarArrayDeDialogos(unionDialogo, expresionSeparadorDialogoDate);
        this.dialogoUsuarios = dialogoUsuarios
            .filter(this.quitarLosqueNotienenUsuario)
            .map((dialogo, index) => this.descomponerDialogo(dialogo, formatDAte, index));
    }
    quitarLosqueNotienenUsuario(dialogo) {
        var myRe = / - [\W\w][^:]+: /g;
        let myArray = myRe.exec(dialogo);
        return null !== myArray;
    }
    descomponerDialogo(dialogo, formatDAte, index) {
        var myRe = / - [\W\w][^:]+: /g;
        let myArray = myRe.exec(dialogo);
        console.log('myArray', myArray);
        let descompuesto = dialogo.split(myArray[0]);
        let fecha = fechaFormat.parse(descompuesto[0], formatDAte);
        let usuario = myArray[0].substring(3, myArray[0].length - 2);
        console.log('descompuesto', descompuesto, fecha, usuario);
        let emocionPorDia = {
            fecha: fecha,
            usuario: usuario,
            dialogo: descompuesto[1],
            idSecuenciaDialogo: index,
            puntajeEmocion: ''
        };
        return emocionPorDia;
    }
    generarArrayDeDialogos(texto, expresionRegular) {
        let textoGuardar = [];
        let coleccionFechas = texto.match(expresionRegular);
        let inicio = texto.indexOf(coleccionFechas[0]);
        for (let count = 1; count <= coleccionFechas.length; count++) {
            let final = texto.indexOf(coleccionFechas[count], inicio);
            final = final === -1 ? texto.length : final;
            if (inicio === final) {
                console.log(inicio >= final);
                final = texto.indexOf(coleccionFechas[count], inicio + 1);
                console.log(final);
            }
            textoGuardar.push(texto.substring(inicio, final));
            console.log(inicio, final, texto.substring(inicio, final));
            inicio = ++final;
        }
        return textoGuardar;
    }
    mostrarDialogos() {
        return this.dialogoUsuarios;
    }
    limpiarTexto(normasLimpieza) {
    }
}
exports.GenerarDialogos = GenerarDialogos;
