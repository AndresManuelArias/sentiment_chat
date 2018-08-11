'use strict'

const fs = require('fs'),
  GenerarDialogos = require('./GenerarDialogos'),
  UsuariosMensajes = require('./UsuariosMensajes'),
  DiasMensajes = require('./DiasMensajes'),
  ReadWordAnalitiyEmotion = require('./ReadWordAnalitiyEmotion'),
  AnaliticTrabajoEmotion =require('./AnaliticTrabajoEmotion');


let archivo = fs.readFileSync('../base_data/Chat de WhatsApp con Ingeniería Zemla.txt', 'utf-8');
let dialogosGenerados = new GenerarDialogos.GenerarDialogos(archivo,'M/D/YY HH:mm: A',/\n[0-9][0-9]?\/[0-9][0-9]?\/[0-9][0-9]? [0-9][0-9]:[0-9][0-9] (PM|AM) - /g);// (\n[1-9][0-9]?\/[0-9][0-9]?\/[0-9][0-9]?, [0-9][0-9]:[0-9][0-9] - ) (MM/DD/YY, HH:mm) dentro de los dos parentesis se ve como debe ser el formato para poder sacar los datos del txt, el primer parentesis muestra la expresion regular de como esta escrita la fecha y que comienza en los saltos de linea, de esta manera se puede extraer el dialogo /\nformatofecha - /g
let usuariosMensajes = new UsuariosMensajes.UsuariosMensajes(dialogosGenerados.mostrarDialogos());
let diasMensajes = new DiasMensajes.DiasMensajes(dialogosGenerados.mostrarDialogos());
let readWordAnalitiyEmotion = new ReadWordAnalitiyEmotion.ReadWordAnalitiyEmotion(usuariosMensajes.nombresUsuarios,diasMensajes.diasDelAnio);
let analiticTrabajoEmotion = new AnaliticTrabajoEmotion.AnaliticTrabajoEmotion({  delimiter: ',',  encoding: 'utf8',  log: true,  objName: false,  parse: true,  stream: false},'../base_data/trabajo Diario realizado analitica.csv',readWordAnalitiyEmotion.mostrarEmotionDate(),'DD/MM/YYYY');



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
