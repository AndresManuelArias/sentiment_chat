"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SentimentLenguajeNatural = require('./SentimentLenguajeNatural');
let sentimentLenguajeNatural = new SentimentLenguajeNatural.SentimentLenguajeNatural();
class GenerateSentimentToDialoge {
    sentimentToDialoge(emocionPorDialogo) {
        return emocionPorDialogo.map((momento) => {
            return { fecha: momento.fecha,
                usuario: momento.usuario,
                dialogo: momento.dialogo,
                idSecuenciaDialogo: momento.idSecuenciaDialogo,
                puntajeEmocion: sentimentLenguajeNatural.calificacionLenguajeNatural(momento.dialogo) };
        });
    }
}
exports.GenerateSentimentToDialoge = GenerateSentimentToDialoge;
// fs.writeFile(`../base_data/dataTableAnaliticEmotionText.json`, JSON.stringify(tableAnaliticSentimenDialog) , error => {
//     if (error)
//         console.log(error);
//     else
//         console.log(`El archivo fue creado dataTableAnaliticEmotionText`);
// });
