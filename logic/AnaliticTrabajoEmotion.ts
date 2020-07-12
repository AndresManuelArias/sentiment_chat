"use strict";
const fechaFormat = require("fecha");
const csvdata = require('csvdata');

//Ingresar datos
interface ColumnasAnalizarWorksEmotion{
    columnaFechasSelect:string,
    columnasTrabajosRealizadosEmotion:ColumnasTrabajosRealizadosEmotion[]
}
interface ColumnasTrabajosRealizadosEmotion{
    colLevelEmotion: string,
    colWorkDay:string
}

//Salida de datos
interface RelationWorksEmotionsDays{
    fechas:string,
    relationScorePerson:RelationScorePerson[]
}
    
interface RelationScorePerson{
    name:string,
    scoreEmotionDay:number,
    scoreWorkDay: number
}
interface RelationWorksEmotionsDaysForCsv{
    fechas:string,
    name:string,
    scoreEmotionDay:number,
    scoreWorkDay: number   
}
///
interface ColumnasAnalizarWorks {
    columnaFechas:string,
    columnasTrabajosRealizados:string[]
}
interface ColumnaAnalizarWork {
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
interface RelationWorksEmotions{
    fechas:string,
    trabajoRealizado:ScorePerson,
    emotionDay:ScorePerson
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
    public resultAnaliticData(  columnasAnalizarWorksEmotion:ColumnasAnalizarWorksEmotion):Promise<RelationWorksEmotionsDays>{        
        return new Promise<RelationWorksEmotionsDays>((resolve) =>{
            csvdata.load(this.filePath,this.optionReadCsv).then((dataWork)=>{
                resolve(this.analiticEmotionPeopleWork(dataWork,columnasAnalizarWorksEmotion));
            });
        })
    }
    public resultAnaliticDataForCsv(relationWorksEmotionsDays:RelationWorksEmotionsDays[]):RelationWorksEmotionsDaysForCsv[]{
        let relationWorksEmotionsDaysForCsv:RelationWorksEmotionsDaysForCsv[]= [];
        relationWorksEmotionsDays.forEach(resultDay => {
            resultDay.relationScorePerson.forEach(person =>{
                relationWorksEmotionsDaysForCsv.push({
                    fechas : resultDay.fechas,
                    name : person.name,
                    scoreEmotionDay : person.scoreEmotionDay,
                    scoreWorkDay : person.scoreWorkDay
                });
            });
        });
        return relationWorksEmotionsDaysForCsv;
    }
    public resultAnaliticDataCsv(relationWorksEmotionsDaysForCsv:RelationWorksEmotionsDaysForCsv[]):string{
        let csv:string;
        let titleArray:string[]=[];
        for(let col in relationWorksEmotionsDaysForCsv[0]){
            titleArray.push(col);
        }
        csv = `${titleArray.join(',')}\n`;
        for(let row = 1; row < relationWorksEmotionsDaysForCsv.length; row++){
            csv  += `${relationWorksEmotionsDaysForCsv[row].fechas},${relationWorksEmotionsDaysForCsv[row].name},${relationWorksEmotionsDaysForCsv[row].scoreEmotionDay},${relationWorksEmotionsDaysForCsv[row].scoreWorkDay}\n`;
        }
        return csv;
    }
    private analiticEmotionWork(dataWork:any,nombreEmotionAnalizar:string,columnaAnalizarWork:ColumnaAnalizarWork):RelationWorkEmotion{
        let colSelect:ColumnaAnalizarWork[] = dataWork.map(row => {
            let fechaEdit = fechaFormat.parse(row[columnaAnalizarWork.fechas], this.formatDate);
            console.log('fechaEdit',fechaEdit,fechaEdit.getFullYear());
            return {
                fechas:`${fechaEdit.getFullYear()}-${fechaEdit.getUTCMonth()+1}-${fechaEdit.getUTCDate()}`,
                trabajoRealizado: row[columnaAnalizarWork.trabajoRealizado]
            }
        });
        let dateEqualWorkAndEmotion:any = colSelect
        .filter(col => this.emotionsDates.some(emotionDate => { return emotionDate.date === col.fechas}) )
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
    private analiticEmotionPeopleWork(dataWork:any,columnasAnalizarWorksEmotion:ColumnasAnalizarWorksEmotion):RelationWorksEmotionsDays{
        
        let formatDateWorkDay:any = dataWork.map(row => {
            let data:any = {};
            let fechaEdit = fechaFormat.parse(row[columnasAnalizarWorksEmotion.columnaFechasSelect], this.formatDate);
            console.log('fechaEdit',fechaEdit,fechaEdit.getFullYear());            
            data.fechas = `${fechaEdit.getFullYear()}-${fechaEdit.getUTCMonth()+1}-${fechaEdit.getUTCDate()}`;
            columnasAnalizarWorksEmotion.columnasTrabajosRealizadosEmotion.forEach((value)=>{
                data[value.colWorkDay]= row[value.colWorkDay];
            });
            return data;
        });
        console.log('formatDateWorkDay',formatDateWorkDay[0])
        let dateEqualWorkAndEmotion:RelationWorksEmotionsDays = formatDateWorkDay
        .filter(col => this.emotionsDates.some(emotionDate => { return emotionDate.date === col.fechas}) )
        .map((col) =>{
            let resultData:RelationScorePerson[] = columnasAnalizarWorksEmotion.columnasTrabajosRealizadosEmotion.map((value)=>{
                let puntajeEmotion:any = this.emotionsDates.filter(emotionDate =>  emotionDate.date === col.fechas);
                let usuarioScoreEmotion:any =  puntajeEmotion[0].scorePersons.filter(usuario => usuario.name == value.colLevelEmotion)
                console.log('usuarioScoreEmotion',usuarioScoreEmotion);
                return {  
                    name:value.colLevelEmotion,
                    scoreEmotionDay:usuarioScoreEmotion[0].score,
                    scoreWorkDay:col[value.colWorkDay]
                }
            });
            console.log('resultData',resultData);
            let resultDataNoNull =  resultData.filter(user => typeof user.scoreEmotionDay === 'number' && typeof user.scoreWorkDay === 'number')
            console.log('resultDataNoNull',resultDataNoNull)
            return {
                fechas:col.fechas,
                relationScorePerson:resultDataNoNull
            }
        });
        return dateEqualWorkAndEmotion;
    } 
}