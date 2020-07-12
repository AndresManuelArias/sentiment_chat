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
    resultAnaliticData(columnasAnalizarWorksEmotion) {
        return new Promise((resolve) => {
            csvdata.load(this.filePath, this.optionReadCsv).then((dataWork) => {
                resolve(this.analiticEmotionPeopleWork(dataWork, columnasAnalizarWorksEmotion));
            });
        });
    }
    resultAnaliticDataForCsv(relationWorksEmotionsDays) {
        let relationWorksEmotionsDaysForCsv = [];
        relationWorksEmotionsDays.forEach(resultDay => {
            resultDay.relationScorePerson.forEach(person => {
                relationWorksEmotionsDaysForCsv.push({
                    fechas: resultDay.fechas,
                    name: person.name,
                    scoreEmotionDay: person.scoreEmotionDay,
                    scoreWorkDay: person.scoreWorkDay
                });
            });
        });
        return relationWorksEmotionsDaysForCsv;
    }
    resultAnaliticDataCsv(relationWorksEmotionsDaysForCsv) {
        let csv;
        let titleArray = [];
        for (let col in relationWorksEmotionsDaysForCsv[0]) {
            titleArray.push(col);
        }
        csv = `${titleArray.join(',')}\n`;
        for (let row = 1; row < relationWorksEmotionsDaysForCsv.length; row++) {
            csv += `${relationWorksEmotionsDaysForCsv[row].fechas},${relationWorksEmotionsDaysForCsv[row].name},${relationWorksEmotionsDaysForCsv[row].scoreEmotionDay},${relationWorksEmotionsDaysForCsv[row].scoreWorkDay}\n`;
        }
        return csv;
    }
    analiticEmotionWork(dataWork, nombreEmotionAnalizar, columnaAnalizarWork) {
        let colSelect = dataWork.map(row => {
            let fechaEdit = fechaFormat.parse(row[columnaAnalizarWork.fechas], this.formatDate);
            console.log('fechaEdit', fechaEdit, fechaEdit.getFullYear());
            return {
                fechas: `${fechaEdit.getFullYear()}-${fechaEdit.getUTCMonth() + 1}-${fechaEdit.getUTCDate()}`,
                trabajoRealizado: row[columnaAnalizarWork.trabajoRealizado]
            };
        });
        let dateEqualWorkAndEmotion = colSelect
            .filter(col => this.emotionsDates.some(emotionDate => { return emotionDate.date === col.fechas; }))
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
    analiticEmotionPeopleWork(dataWork, columnasAnalizarWorksEmotion) {
        let formatDateWorkDay = dataWork.map(row => {
            let data = {};
            let fechaEdit = fechaFormat.parse(row[columnasAnalizarWorksEmotion.columnaFechasSelect], this.formatDate);
            console.log('fechaEdit', fechaEdit, fechaEdit.getFullYear());
            data.fechas = `${fechaEdit.getFullYear()}-${fechaEdit.getUTCMonth() + 1}-${fechaEdit.getUTCDate()}`;
            columnasAnalizarWorksEmotion.columnasTrabajosRealizadosEmotion.forEach((value) => {
                data[value.colWorkDay] = row[value.colWorkDay];
            });
            return data;
        });
        console.log('formatDateWorkDay', formatDateWorkDay[0]);
        let dateEqualWorkAndEmotion = formatDateWorkDay
            .filter(col => this.emotionsDates.some(emotionDate => { return emotionDate.date === col.fechas; }))
            .map((col) => {
            let resultData = columnasAnalizarWorksEmotion.columnasTrabajosRealizadosEmotion.map((value) => {
                let puntajeEmotion = this.emotionsDates.filter(emotionDate => emotionDate.date === col.fechas);
                let usuarioScoreEmotion = puntajeEmotion[0].scorePersons.filter(usuario => usuario.name == value.colLevelEmotion);
                console.log('usuarioScoreEmotion', usuarioScoreEmotion);
                return {
                    name: value.colLevelEmotion,
                    scoreEmotionDay: usuarioScoreEmotion[0].score,
                    scoreWorkDay: col[value.colWorkDay]
                };
            });
            console.log('resultData', resultData);
            let resultDataNoNull = resultData.filter(user => typeof user.scoreEmotionDay === 'number' && typeof user.scoreWorkDay === 'number');
            console.log('resultDataNoNull', resultDataNoNull);
            return {
                fechas: col.fechas,
                relationScorePerson: resultDataNoNull
            };
        });
        return dateEqualWorkAndEmotion;
    }
}
exports.AnaliticTrabajoEmotion = AnaliticTrabajoEmotion;
