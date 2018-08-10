'use strict'

const fs = require('fs'),
  GenerarDialogos = require('./GenerarDialogos'),
  UsuariosMensajes = require('./UsuariosMensajes'),
  DiasMensajes = require('./DiasMensajes'),
  ReadWordAnalitiyEmotion = require('./ReadWordAnalitiyEmotion'),
  AnaliticTrabajoEmotion =require('./AnaliticTrabajoEmotion');


let archivo = fs.readFileSync('../base_data/WhatsApp Chat with CENSO DANE grupo #6 Loc 8.txt', 'utf-8');
let dialogosGenerados = new GenerarDialogos.GenerarDialogos(archivo,'MM/DD/YY, HH:mm',/\n[1-9][0-9]?\/[0-9][0-9]?\/[0-9][0-9]?, [0-9][0-9]:[0-9][0-9] - /g);
let usuariosMensajes = new UsuariosMensajes.UsuariosMensajes(dialogosGenerados.mostrarDialogos());
let diasMensajes = new DiasMensajes.DiasMensajes(dialogosGenerados.mostrarDialogos());
let readWordAnalitiyEmotion = new ReadWordAnalitiyEmotion.ReadWordAnalitiyEmotion(usuariosMensajes.nombresUsuarios,diasMensajes.diasDelAnio);
let analiticTrabajoEmotion = new AnaliticTrabajoEmotion.AnaliticTrabajoEmotion({  delimiter: ',',  encoding: 'utf8',  log: true,  objName: false,  parse: true,  stream: false},'../base_data/Formatos DANE- CENSO 2018 - GRUPO 6  - analitica.csv',readWordAnalitiyEmotion.mostrarEmotionDate(),'DD/MM/YYYY');



[
  {name:'mensajesPorDias.json',text:JSON.stringify(diasMensajes.diasDelAnio)},
  {name:'nombreUsuarios.json',text:JSON.stringify(usuariosMensajes.nombresUsuarios)},
  {name:'mensajeUsuarios.json',text:JSON.stringify(usuariosMensajes.usuarios)},
  {name:'dialogos.json',text:JSON.stringify(dialogosGenerados.mostrarDialogos())},
  {name:'resultEmotionDate.json',text:JSON.stringify(readWordAnalitiyEmotion.mostrarEmotionDate())}
].forEach((value)=>{
  fs.writeFile(`../base_data/${value.name}`,value.text, error => {
    if (error)
      console.log(error);
    else
      console.log(`El archivo fue creado ${value.name}`);
  });
});
analiticTrabajoEmotion.resultAnaliticData('sentiment natural',{fechas:"fechas",  trabajoRealizado:'trabajo realizado'}).then((result)=>{
  console.log('result',result);
  fs.writeFile(`../base_data/analiticTrabajoEmotion.json`,JSON.stringify(result), error => {
    if (error)
      console.log(error);
    else
      console.log(`El archivo fue creado analiticTrabajoEmotion`);
  });
});