"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
[];
const SentimentLenguajeNatural = require('./SentimentLenguajeNatural');
const sentimentLenguajeNatural = new SentimentLenguajeNatural.SentimentLenguajeNatural();
class ReadWordAnalitiyEmotion {
    constructor(nombreUsuarios, mensajesPorDias) {
        this.nombreUsuarios = nombreUsuarios;
        this.mensajesPorDias = mensajesPorDias;
        let emotionDate = [];
        for (let fecha in mensajesPorDias) {
            let scorePerson = [];
            for (let person in nombreUsuarios) {
                let dialogoUsuario = "";
                let mensajeUsuario = mensajesPorDias[fecha].dialogoPorDias.filter((dialoge => dialoge.usuario === nombreUsuarios[person]));
                if (mensajeUsuario.length > 0) {
                    mensajeUsuario.forEach(element => {
                        dialogoUsuario += element.dialogo;
                    });
                }
                scorePerson.push({ name: nombreUsuarios[person], score: sentimentLenguajeNatural.calificacionLenguajeNatural(dialogoUsuario) });
            }
            //aqui se va a colocar la opinion del sentimiento de las palabras de ese dia por otras apis
            scorePerson.push({ name: 'sentiment natural', score: sentimentLenguajeNatural.calificacionLenguajeNatural(mensajesPorDias[fecha].dialogos) });
            emotionDate.push({ scorePersons: scorePerson, date: fecha });
        }
        this.emotionDate = emotionDate;
    }
    mostrarEmotionDate() {
        return this.emotionDate;
    }
}
exports.ReadWordAnalitiyEmotion = ReadWordAnalitiyEmotion;
