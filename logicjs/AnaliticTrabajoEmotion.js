"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fechaFormat = require("fecha");
const csvdata = require('csvdata');
[];
class AnaliticTrabajoEmotion {
    constructor(optionReadCsv, filePath, emotionsDates, formatDate) {
        this.optionReadCsv = optionReadCsv;
        this.filePath = filePath;
        this.emotionsDates = emotionsDates;
        this.formatDate = formatDate;
    }
    resultAnaliticData(nombreEmotionAnalizar, columnasAnalizarWork) {
        return new Promise((resolve) => {
            csvdata.load(this.filePath, this.optionReadCsv).then((dataWork) => {
                resolve(this.analiticEmotionWork(dataWork, nombreEmotionAnalizar, columnasAnalizarWork));
            });
        });
    }
    analiticEmotionWork(dataWork, nombreEmotionAnalizar, columnasAnalizarWork) {
        let colSelect = dataWork.map(row => {
            let fechaEdit = fechaFormat.parse(row[columnasAnalizarWork.fechas], this.formatDate);
            console.log('fechaEdit', fechaEdit, fechaEdit.getFullYear());
            return {
                fechas: `${fechaEdit.getFullYear()}-${fechaEdit.getUTCMonth() + 1}-${fechaEdit.getUTCDate()}`,
                trabajoRealizado: row[columnasAnalizarWork.trabajoRealizado]
            };
        });
        let dateEqualWorkAndEmotion = colSelect
            .filter(col => this.emotionsDates.some(emotionDate => { console.log("fechas parecidas", emotionDate.date, col.fechas); return emotionDate.date === col.fechas; }))
            .map((col) => {
            let scorePersonsDay = this.emotionsDates
                .filter(emotionDate => emotionDate.date === col.fechas)[0].scorePersons
                .filter(person => person.name === nombreEmotionAnalizar);
            console.log('scorePersonsDay', scorePersonsDay);
            return {
                fechas: col.fechas,
                trabajoRealizado: col.trabajoRealizado,
                emotionDay: scorePersonsDay[0].score
            };
        });
        return dateEqualWorkAndEmotion;
    }
}
exports.AnaliticTrabajoEmotion = AnaliticTrabajoEmotion;
