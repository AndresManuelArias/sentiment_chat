'use strict';
const fsC = require('fs'), GenerarDialogosC = require('./GenerarDialogos'), UsuariosMensajesC = require('./UsuariosMensajes'), DiasMensajesC = require('./DiasMensajes'), ReadWordAnalitiyEmotionC = require('./ReadWordAnalitiyEmotion');
let archivoConstruHogar = fsC.readFileSync('../base_data/Chat de WhatsApp con Consulta.txt', 'utf-8');
let dialogosGeneradosConstruHogar = new GenerarDialogosC.GenerarDialogos(archivoConstruHogar, 'M/D/YY H:mm A', /\n[1-9][0-9]?\/[1-9][0-9]?\/[1-9][0-9]? [1-9][0-9]?:[0-9][0-9]? (PM|AM) -  /g); /*
'MM/DD/YY, HH:mm',/\n[1-9][0-9]?\/[0-9][0-9]?\/[0-9][0-9]?, [0-9][0-9]:[0-9][0-9] - /g
'M/D/YY H:mm A',/\n[1-9][0-9]?\/[1-9][0-9]?\/[1-9][0-9]? [1-9][0-9]?:[0-9][0-9]? (PM|AM) -  /g
 */
let usuariosMensajesConstruHogar = new UsuariosMensajesC.UsuariosMensajes(dialogosGeneradosConstruHogar.mostrarDialogos());
let diasMensajesConstruHogar = new DiasMensajesC.DiasMensajes(dialogosGeneradosConstruHogar.mostrarDialogos());
let readWordAnalitiyEmotionC = new ReadWordAnalitiyEmotionC.ReadWordAnalitiyEmotion(usuariosMensajesConstruHogar.nombresUsuarios, diasMensajesConstruHogar.diasDelAnio);
[
    { name: 'mensajesPorDias.json', text: JSON.stringify(diasMensajesConstruHogar.diasDelAnio) },
    { name: 'nombreUsuarios.json', text: JSON.stringify(usuariosMensajesConstruHogar.nombresUsuarios) },
    { name: 'mensajeUsuarios.json', text: JSON.stringify(usuariosMensajesConstruHogar.usuarios) },
    { name: 'dialogos.json', text: JSON.stringify(dialogosGeneradosConstruHogar.mostrarDialogos()) },
    { name: 'resultEmotionDate.json', text: JSON.stringify(readWordAnalitiyEmotionC.mostrarEmotionDate()) }
].forEach((value) => {
    fsC.writeFile(`../base_data/${value.name}`, value.text, error => {
        if (error)
            console.log(error);
        else
            console.log(`El archivoConstruHogar fue creado ${value.name}`);
    });
});
