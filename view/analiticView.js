import { isNull } from "util";

let Graficar = require('./Graficar');
const fs1 = require('fs');


const dataAnaliticEmotion = JSON.parse(fs1.readFileSync('../base_data/dataTableAnaliticEmotionText.json', 'utf-8'));
let  graficar = new Graficar.Graficar({savePage:`../public/analiticView.html`,   title:'graficas'});

graficar.graficaLine(dataAnaliticEmotion,'fecha',{label:'usuario',data:'puntajeEmocion'},'General');

let hourFilter = dataAnaliticEmotion.filter(col => new Date(col.fecha ).getUTCHours() == 19  );
graficar.graficaLine(hourFilter,'fecha',{label:'usuario',data:'puntajeEmocion'},'diez y nueve');

 hourFilter = dataAnaliticEmotion.filter(col => new Date(col.fecha ).getUTCHours() < 12  );
graficar.graficaLine(hourFilter,'fecha',{label:'usuario',data:'puntajeEmocion'},'doce');



let dataForge = require('data-forge');
require('data-forge-plot');

let df = dataForge.readFileSync("../base_data/resultAnaliticDataCsv.csv").parseCSV().parseFloats(["scoreEmotionDay"]) ;
df.asCSV().writeFileSync('some-other-csv-file.csv');
// df.content.values.rows[296]
// transformed.configFn().values.iterable.rows[365]
console.log(df.select(row => {row['scoreEmotionDay'] =  Number(row.scoreEmotionDay.toFixed(3)) ;return row }).where(row => row.scoreEmotionDay *0 === 0).between(350, 397).toString());
df.select(row => {
    row['scoreEmotionDay'] =  Number(row.scoreEmotionDay.toFixed(3)) ;
    return row 
}).where(row => row.scoreEmotionDay *0 === 0).plot({}, {x: "scoreEmotionDay",y: "scoreWorkDay"  }).renderImage("nueva.png");


// df = dataForge.readFileSync("../base_data/dataTableAnaliticEmotionText.json").parseJSON()//.parseDates(["fecha"]).parseFloats(["puntajeEmocion"]).dropSeries(["dialogo"]) ;
let dataCleanAnaliticEmotion =  dataAnaliticEmotion.map(row =>{
    row['dialogo'] =  "";//row.dialogo.replace(/(\n|,)/g,"");
    return row;
}).filter(row => row.puntajeEmocion !== null);
// dataCleanAnaliticEmotion = dataCleanAnaliticEmotion.map((row)=>{
//     row[row.usuario] = row.puntajeEmocion;
//     return dataCleanAnaliticEmotion
// })
let nameUnique = new Set();
dataCleanAnaliticEmotion.forEach(element => {
    nameUnique.add(element.usuario)
});
dataCleanAnaliticEmotion = dataCleanAnaliticEmotion.map((row)=>{   
    nameUnique.forEach((name)=>{
        row[name] = NaN;
    });
    row[row.usuario] = row.puntajeEmocion;
    return row;
});
df = new dataForge.DataFrame(dataCleanAnaliticEmotion);
// df = new dataForge.DataFrame({values:dataCleanAnaliticEmotion,considerAllRows: true});

df.asCSV().writeFileSync('../base_data/dataTableAnaliticEmotionText.csv');
// df.content.values
// df = new dataForge.DataFrame({
//     values: dataAnaliticEmotion
// });
df = dataForge.readFileSync("../base_data/dataTableAnaliticEmotionText.csv").parseCSV().parseFloats(["puntajeEmocion"]).dropSeries(["dialogo","__index__","idSecuenciaDialogo"]) ;
// df.select(row => {
//     row['puntajeEmocion'] =  Number(row.scoreEmotionDay.toFixed(3)) ;
//     return row 
// }).groupBy(row => row.usuario)

// df.plot({}, {x: "fecha",y: "puntajeEmocion"  }).renderImage("emotion.png");
let columnasY = [];
nameUnique.forEach((name)=>{
    columnasY.push(name);
});
df.select(row => {row['fecha']=row.fecha.slice(2, 10);return row}).plot({ width: 1200,height: 300 }, {x: "fecha",y:columnasY  }).exportWeb("emotion", { openBrowser: true });


console.log(df.where(col => new Date(col.fecha ).getUTCHours() > 12 && new Date(col.fecha ).getUTCHours() < 18 ).groupBy(row => row.usuario).toString())

console.log(df.where(row => row.fecha == "2018-08-21T14:22:00.000Z").toString())


// otra soluciones

let emotionText = JSON.parse(fs1.readFileSync("../base_data/dataTableAnaliticEmotionText.json",'utf-8'));
let arrayCabeceras = Object.keys(emotionText[0]);
let cabecera = "";
for(let key = 0 ;key <  arrayCabeceras.length; key++){
    cabecera += key+1 == arrayCabeceras.length? `${arrayCabeceras[key]}\n`:`${arrayCabeceras[key]},`;
}
let emotionTextclean = emotionText.map( fila  => {
    let array = [];
    for(let key in fila){
        if(key == "fecha"){
            array.push( new Date(fila[key] ).getUTCHours());
        }else if(key == "dialogo"){
            array.push("");
        }
        else{
            array.push(fila[key]);
        }
    }
    return array.join(",");
}).join("\n");
let csvEmotion =  cabecera+emotionTextclean;
fs1.writeFileSync('../base_data/dataTableAnaliticEmotionText.csv', csvEmotion,'utf-8') ;


