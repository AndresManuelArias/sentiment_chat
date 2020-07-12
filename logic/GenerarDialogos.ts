import { isArray } from "util";

const fechaFormat = require("fecha");

interface EmocionPorDia {
    fecha:Date
    usuario:string
    dialogo:string
    idSecuenciaDialogo:number
    puntajeEmocion:string
}

export class GenerarDialogos{
    private dialogoUsuarios:EmocionPorDia[]
    constructor(dialogos:string[],formatDAte:string,expresionSeparadorDialogoDate:any){              
        let unionDialogo:string;
        dialogos.forEach(dialogo => {
            unionDialogo += dialogo;
        });
        let dialogoUsuarios:string[] = this.generarArrayDeDialogos(unionDialogo,expresionSeparadorDialogoDate)       
        
        this.dialogoUsuarios = dialogoUsuarios
            .filter(this.quitarLosqueNotienenUsuario)
            .map((dialogo,index) => this.descomponerDialogo(dialogo,formatDAte,index));
    }
    private quitarLosqueNotienenUsuario(dialogo:string):boolean{
        var myRe = / - [\W\w][^:]+: /g;
        let myArray = myRe.exec(dialogo);
        return null !== myArray;
    }
    private descomponerDialogo(dialogo:string,formatDAte:string,index:number):EmocionPorDia{
        var myRe = / - [\W\w][^:]+: /g;
        let myArray = myRe.exec(dialogo);
        console.log('myArray',myArray);
        let descompuesto = dialogo.split(myArray[0]);
        let fecha = fechaFormat.parse(descompuesto[0],formatDAte);
        let usuario = myArray[0].substring(3,myArray[0].length-2)
        console.log('descompuesto',descompuesto,fecha,usuario)
        let emocionPorDia:EmocionPorDia={
            fecha:fecha,
            usuario:usuario,
            dialogo:descompuesto[1],
            idSecuenciaDialogo:index,
            puntajeEmocion:''};
        return emocionPorDia;
    }
    private generarArrayDeDialogos(texto:string,expresionRegular):string[]{
        let textoGuardar:string[]=[];
        let coleccionFechas:string[] =  texto.match(expresionRegular);
        let inicio:number = texto.indexOf(coleccionFechas[0])  ;
        for(let count = 1;count <= coleccionFechas.length;count++){
            let final:number =  texto.indexOf(coleccionFechas[count],inicio);
            final = final === -1?texto.length:final;
            if(inicio === final){
                console.log(inicio >= final)
                final =  texto.indexOf(coleccionFechas[count],inicio+1);
                console.log(final);
            }
            textoGuardar.push( texto.substring(inicio, final));
            console.log(inicio,final,texto.substring(inicio, final));
            inicio = ++final;
        }
        return textoGuardar;
    }
    public mostrarDialogos():EmocionPorDia[]{
      return   this.dialogoUsuarios;
    }
    public limpiarTexto(normasLimpieza){

    }
}
