"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SentimentLenguajeNatural {
    constructor() {
        this.natural = require('natural');
        this.Analyzer = this.natural.SentimentAnalyzer;
        this.stemmer = this.natural.PorterStemmer;
        this.analyzer = new this.Analyzer("Spanish", this.stemmer, "afinn");
        this.tokenizer = new this.natural.WordTokenizer();
    }
    calificacionLenguajeNatural(palabras) {
        let words = this.tokenizer.tokenize(palabras);
        return this.analyzer.getSentiment(words);
    }
}
exports.SentimentLenguajeNatural = SentimentLenguajeNatural;
