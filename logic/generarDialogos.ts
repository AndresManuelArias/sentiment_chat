interface EmocionPorDia {
    fecha:Date
    usuario:string
    dialogo:string
    idSecuenciaDialogo:number
    puntajeEmocion:string
}

export class GenerarDialogos{
    private dialogoUsuarios:any[]
    constructor(dialogos){
         let dialogoUsuarios = dialogos.split('\n');
         dialogoUsuarios.splice( 0,1 );
        this.dialogoUsuarios = dialogoUsuarios.map((dialogo,index) => this.descomponerDialogo(dialogo,index));
    }
    private descomponerDialogo(dialogo,index):EmocionPorDia{
        var myRe = / - [\W\w]*: /g;
        let myArray = myRe.exec(dialogo);
        console.log('myArray',myArray);
        let descompuesto = dialogo.split(myArray[0]);
        console.log('descompuesto',descompuesto)
        let emocionPorDia:EmocionPorDia={fecha:descompuesto[0],
            usuario:myArray[0],
            dialogo:descompuesto[1],
            idSecuenciaDialogo:index,
            puntajeEmocion:''};
        return emocionPorDia;
    }
    public mostrarDialogos():any[]{
      return   this.dialogoUsuarios;
    }
    public limpiarTexto(normasLimpieza){

    }
}
