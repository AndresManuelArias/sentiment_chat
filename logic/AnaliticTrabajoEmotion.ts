"use strict";
const fechaFormat = require("fecha");
const csvdata = require('csvdata');
interface ColumnasAnalizarWork {
    fechas:string,
    trabajoRealizado:string
}
interface ScorePerson{
    name:string,
    score:number
}[]
interface EmotionDate{
    scorePersons:ScorePerson[],
    date:string
}
interface RelationWorkEmotion{
    fechas:string,
    trabajoRealizado:number,
    emotionDay:number
}
interface formatDate{
    dateWork:string,
    dateEmotion:string
}

export class AnaliticTrabajoEmotion {
    private optionReadCsv:any
    private filePath:string
    private emotionsDates:EmotionDate[]
    private formatDate:string
    constructor(optionReadCsv,filePath:string,emotionsDates:EmotionDate[],formatDate:string){
        this.optionReadCsv = optionReadCsv;
        this.filePath = filePath;
        this.emotionsDates=emotionsDates;
        this.formatDate=formatDate;
    }
    public resultAnaliticData(  nombreEmotionAnalizar:string,columnasAnalizarWork:ColumnasAnalizarWork):Promise<RelationWorkEmotion>{        
        return new Promise<RelationWorkEmotion>((resolve) =>{
            csvdata.load(this.filePath,this.optionReadCsv).then((dataWork)=>{
                resolve(this.analiticEmotionWork(dataWork,nombreEmotionAnalizar,columnasAnalizarWork));
            });
        })
    }
    private analiticEmotionWork(dataWork:any,nombreEmotionAnalizar:string,columnasAnalizarWork:ColumnasAnalizarWork):RelationWorkEmotion{
        let colSelect:ColumnasAnalizarWork[] = dataWork.map(row => {
            let fechaEdit = fechaFormat.parse(row[columnasAnalizarWork.fechas], this.formatDate);
            console.log('fechaEdit',fechaEdit,fechaEdit.getFullYear());
            return {
                fechas:`${fechaEdit.getFullYear()}-${fechaEdit.getUTCMonth()+1}-${fechaEdit.getUTCDate()}`,
                trabajoRealizado: row[columnasAnalizarWork.trabajoRealizado]
            }
        });
        let dateEqualWorkAndEmotion:any = colSelect
        .filter(col => this.emotionsDates.some(emotionDate => {console.log("fechas parecidas",emotionDate.date , col.fechas); return emotionDate.date === col.fechas}) )
        .map((col) =>
            {
                let scorePersonsDay =this.emotionsDates
                .filter(emotionDate => emotionDate.date === col.fechas)[0].scorePersons
                .filter (person => person.name === nombreEmotionAnalizar );
                console.log('scorePersonsDay',scorePersonsDay);
                return {
                    fechas:col.fechas,
                    trabajoRealizado:col.trabajoRealizado,
                    emotionDay:scorePersonsDay[0].score
                }
            }
        );
        return dateEqualWorkAndEmotion;
    } 

}