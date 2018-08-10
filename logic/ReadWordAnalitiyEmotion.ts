"use strict";

interface ScorePerson{
    name:string,
    score:number
}[]
interface EmotionDate{
    scorePersons:ScorePerson[],
    date:string
}
class SentimentLenguajeNatural{
    private natural:any
    private Analyzer:any
    private stemmer:any  
    private analyzer:any
    private tokenizer:any
    constructor(){
        this.natural = require('natural');
        this.Analyzer = this.natural.SentimentAnalyzer;
        this.stemmer = this.natural.PorterStemmer;
        this.analyzer = new this.Analyzer("Spanish", this.stemmer, "afinn");
        this.tokenizer = new this.natural.WordTokenizer();
    }
    public calificacionLenguajeNatural(palabras:string):number{ 
        let words = this.tokenizer.tokenize(palabras);
        return this.analyzer.getSentiment(words);
    }
}
const sentimentLenguajeNatural = new SentimentLenguajeNatural();

export class ReadWordAnalitiyEmotion{
    private nombreUsuarios:any
    private mensajesPorDias:any
    private emotionDate:EmotionDate[]
    constructor(nombreUsuarios,mensajesPorDias){
        this.nombreUsuarios = nombreUsuarios;
        this.mensajesPorDias = mensajesPorDias;
        let emotionDate:EmotionDate[]=[];
        for(let fecha in  mensajesPorDias){
            let scorePerson:ScorePerson[]=[];
            for(let person in nombreUsuarios){ 
                let dialogoUsuario = "";
                let mensajeUsuario = mensajesPorDias[fecha].dialogoPorDias.filter((dialoge => dialoge.usuario === nombreUsuarios[person]))
                
                if(mensajeUsuario.length > 0){
                    mensajeUsuario.forEach(element => {
                        dialogoUsuario += element.dialogo
                    });
                }
                scorePerson.push({name:nombreUsuarios[person],score:sentimentLenguajeNatural.calificacionLenguajeNatural(dialogoUsuario)});
            }
            //aqui se va a colocar la opinion del sentimiento de las palabras de ese dia por otras apis
            scorePerson.push({name:'sentiment natural',score:sentimentLenguajeNatural.calificacionLenguajeNatural(mensajesPorDias[fecha].dialogos)});
            emotionDate.push({scorePersons:scorePerson,date:fecha});
        }
        this.emotionDate = emotionDate;
    }
    mostrarEmotionDate():EmotionDate[]{
        return  this.emotionDate;
    }
}
