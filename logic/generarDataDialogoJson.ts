'use strict'

const fs = require('fs'),
  GenerarDialogos = require('./GenerarDialogos'),
  UsuariosMensajes = require('./UsuariosMensajes'),
  DiasMensajes = require('./DiasMensajes'),
  ReadWordAnalitiyEmotion = require('./ReadWordAnalitiyEmotion'),
  AnaliticTrabajoEmotion =require('./AnaliticTrabajoEmotion'),
  GenerateSentimentToDialoge = require('./GenerateSentimentToDialoge');

const  generateSentimentToDialoge = new GenerateSentimentToDialoge.GenerateSentimentToDialoge();

let dialogos = fs.readdirSync('../base_data/dialogos');
let archivos:string[] = dialogos.map(dialogo =>   fs.readFileSync(`../base_data/dialogos/${dialogo}`, 'utf-8'));
let dialogosGenerados = new GenerarDialogos.GenerarDialogos(archivos,'MM/DD/YY, HH:mm',/\n[1-9][0-9]?\/[0-9][0-9]?\/[0-9][0-9]?, [0-9][0-9]:[0-9][0-9] - /g);/*
 (/\n[1-9][0-9]?\/[0-9][0-9]?\/[0-9][0-9]?, [0-9][0-9]:[0-9][0-9] - /g) (MM/DD/YY, HH:mm) dentro de los dos parentesis se ve como debe ser el formato para poder sacar los datos del txt, el primer parentesis muestra la expresion regular de como esta escrita la fecha y que comienza en los saltos de linea, de esta manera se puede extraer el dialogo /\nformatofecha - /g
 zenla:(/\n[0-9][0-9]?\/[0-9][0-9]?\/[0-9][0-9]? [0-9][0-9]:[0-9][0-9] (PM|AM) - /g) ( M/D/YY HH:mm: A)
 */
let sentimentToDialoge = generateSentimentToDialoge.sentimentToDialoge(dialogosGenerados.mostrarDialogos());
let usuariosMensajes = new UsuariosMensajes.UsuariosMensajes(dialogosGenerados.mostrarDialogos());
let diasMensajes = new DiasMensajes.DiasMensajes(dialogosGenerados.mostrarDialogos());
let readWordAnalitiyEmotion = new ReadWordAnalitiyEmotion.ReadWordAnalitiyEmotion(usuariosMensajes.nombresUsuarios,diasMensajes.diasDelAnio);
let analiticTrabajoEmotion = new AnaliticTrabajoEmotion.AnaliticTrabajoEmotion({  delimiter: ',',  encoding: 'utf8',  log: true,  objName: false,  parse: true,  stream: false},
'../base_data/trabajo Diario realizado analitica.csv',readWordAnalitiyEmotion.mostrarEmotionDate()
,'DD/MM/YYYY');



[
  {name:'mensajesPorDias.json',text:JSON.stringify(diasMensajes.diasDelAnio)},
  {name:'nombreUsuarios.json',text:JSON.stringify(usuariosMensajes.nombresUsuarios)},
  {name:'mensajeUsuarios.json',text:JSON.stringify(usuariosMensajes.usuarios)},
  {name:'dialogos.json',text:JSON.stringify(dialogosGenerados.mostrarDialogos())},
  {name:'resultEmotionDate.json',text:JSON.stringify(readWordAnalitiyEmotion.mostrarEmotionDate())},
  {name:'dataTableAnaliticEmotionText.json',text:JSON.stringify(sentimentToDialoge)}
].forEach((value)=>{
  fs.writeFile(`../base_data/${value.name}`,value.text, error => {
    if (error)
      console.log(error);
    else
      console.log(`El archivo fue creado ${value.name}`);
  });
});
let columnasTrabajosRealizadosEmotion = [
  { colWorkDay:'trabajo realizado',colLevelEmotion:'sentiment natural'}
]
usuariosMensajes.nombresUsuarios.forEach(nombre => {
  columnasTrabajosRealizadosEmotion.push({colWorkDay:nombre,colLevelEmotion:nombre})
});
analiticTrabajoEmotion.resultAnaliticData({columnaFechasSelect:"fechas", columnasTrabajosRealizadosEmotion:columnasTrabajosRealizadosEmotion}).then((result)=>{
  console.log('result',result[0]);
  let forCsv = analiticTrabajoEmotion.resultAnaliticDataForCsv(result)
  fs.writeFile(`../base_data/resultAnaliticDataForCsv.json`,  JSON.stringify(forCsv), error => {
    if (error)
      console.log(error);
    else
      console.log(`El archivo fue creado resultAnaliticDataForCsv`);
  });
  fs.writeFile(`../base_data/resultAnaliticDataCsv.csv`,   analiticTrabajoEmotion.resultAnaliticDataCsv(forCsv), error => {
    if (error)
      console.log(error);
    else
      console.log(`El archivo fue creado resultAnaliticDataCsv`);
  });
  fs.writeFile(`../base_data/analiticTrabajoEmotion.json`,JSON.stringify(result), error => {
    if (error)
      console.log(error);
    else
      console.log(`El archivo fue creado analiticTrabajoEmotion`);
  });
});
