"use strict";

export class SentimentLenguajeNatural{
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