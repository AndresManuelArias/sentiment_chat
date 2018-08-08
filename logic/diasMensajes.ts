const OrganizarDialogos = require('./organizarDialogos');
let organizarDialogos = new OrganizarDialogos.OrganizarDialogos('fecha');
export class DiasMensajes {
    public diasDelAnio:any;
    public fechasDeDialogo:string[];
    constructor(mensajesDescompuestos:any[]){
        let mensajesConvertido = this.convertirFechaMensajesDescompuestos(mensajesDescompuestos);
        this.fechasDeDialogo = organizarDialogos.coleccionar(mensajesConvertido);
        this.diasDelAnio = organizarDialogos.generarDialogos(mensajesConvertido,this.fechasDeDialogo);
    }
    private convertirFechaMensajesDescompuestos(mensajesDescompuestos:any[]){
        return  mensajesDescompuestos.map((mensajes)=>{
            let soloFecha = new Date(mensajes.fecha);
            mensajes.fecha = `${soloFecha.getFullYear()}-${soloFecha.getMonth()+1}-${soloFecha.getDate()}`;
            return  mensajes
        })
    }
}