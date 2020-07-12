const SentimentLenguajeNatural = require('./SentimentLenguajeNatural');
let sentimentLenguajeNatural = new SentimentLenguajeNatural.SentimentLenguajeNatural();
interface EmocionPorDialogo {
    fecha:Date
    usuario:string
    dialogo:string
    idSecuenciaDialogo:number
    puntajeEmocion:string
}
export class GenerateSentimentToDialoge{
    sentimentToDialoge(emocionPorDialogo:EmocionPorDialogo[]){
        return emocionPorDialogo.map((momento)=>{
            return { fecha: momento.fecha,
              usuario: momento.usuario,
              dialogo: momento.dialogo,
              idSecuenciaDialogo: momento.idSecuenciaDialogo,
                  puntajeEmocion:sentimentLenguajeNatural.calificacionLenguajeNatural(momento.dialogo)}
            
            });
    }
}


    // fs.writeFile(`../base_data/dataTableAnaliticEmotionText.json`, JSON.stringify(tableAnaliticSentimenDialog) , error => {
    //     if (error)
    //         console.log(error);
    //     else
    //         console.log(`El archivo fue creado dataTableAnaliticEmotionText`);
    // });