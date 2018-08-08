
export class OrganizarDialogos {
    private criterioPropiedad:string;
    constructor(criterioPropiedad1){
        this.criterioPropiedad = criterioPropiedad1;
    }
    public generarDialogos(mensajesDescompuestos:any[],nombres:any[]):any{
        let criterioDialogo = {};
        // console.log('nombres',nombres)
        nombres.forEach((nombre)=>{
            // console.log('nombre',nombre);
            criterioDialogo[nombre] = {};
            criterioDialogo[nombre]['dialogoPorDias'] = mensajesDescompuestos.filter(dialogo=> {
                // console.log('dialogo',dialogo);
                // console.log('this.criterioPropiedad',this.criterioPropiedad);
                return nombre == dialogo[this.criterioPropiedad]});           
            criterioDialogo[nombre]['dialogoPorDias'].forEach((dialogue)=>{
                criterioDialogo[nombre]['dialogos'] +=   dialogue.dialogo+". ";
            });
        });
        return  criterioDialogo;
    }
    public coleccionar( dialogos:any[]):any[]{
        // console.log('this.criterioPropiedad',criterioPropiedad)
      let  coleccionando = this.guardarColecion(this.criterioPropiedad);
      let resultado = [];
      dialogos.forEach((dato)=>{
        resultado = coleccionando(dato);
      });
      return resultado;
    }
    public guardarColecion(propiedadGuardar:string):any{
        let colecion = [];
        return (dato)=>{
           if(!colecion.some((info)=>info == dato[propiedadGuardar])){
            colecion.push(dato[propiedadGuardar]);
           }
           return colecion;
        }
    }
}