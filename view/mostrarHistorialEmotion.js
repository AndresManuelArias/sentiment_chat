var fs = require('fs'), resultEmotionDate = JSON.parse(fs.readFileSync('../base_data/resultEmotionDate.json', 'utf-8')), resultEmotionWork = JSON.parse(fs.readFileSync('../base_data/analiticTrabajoEmotion.json', 'utf-8'));
[];
[];
function dataLinesDateWorkEmotion(workEmotion) {
    var datasetsLine = [];
    var labelsDate = [];
    var converWorkEmotion = workEmotion.map(function (we) {
        var arrTrabajo = we.relationScorePerson.map(function (data) { return data.scoreWorkDay; });
        var maxTrabajo = Math.max.apply(Math, arrTrabajo);
        var arrEmotion = we.relationScorePerson.map(function (data) { return data.scoreEmotionDay; });
        var maxEmotion = Math.max.apply(Math, arrEmotion);
        return we.relationScorePerson.map(function (data) {
            return {
                name: data.name,
                scoreWorkDay: data.scoreWorkDay / maxTrabajo,
                scoreEmotionDay: data.scoreEmotionDay / maxEmotion
            };
        });
    });
    console.log('converWorkEmotion', converWorkEmotion);
    labelsDate = workEmotion.map(function (data) { return "" + data.fechas; });
    // ['emotionDay','trabajoRealizado']
    var nombreUsuariosMap = new Map();
    var nombreUsuarios = [];
    workEmotion.forEach(function (dias) { return dias.relationScorePerson.forEach(function (datos) { return nombreUsuariosMap.set(datos.name, datos.name); }); });
    nombreUsuariosMap.forEach(function (nombre) { return nombreUsuarios.push(nombre); });
    console.log('nombreUsuarios', nombreUsuarios);
    ['scoreEmotionDay', 'scoreWorkDay'].forEach(function (element) {
        nombreUsuarios.forEach(function (label) {
            var randomColor = Math.floor(Math.random() * 16777215).toString(16);
            var filtradoPersona = workEmotion.map(function (we) {
                return we.relationScorePerson.filter(function (personas) { return personas.name == label; })[0][element];
            });
            console.log('filtradoPersona[0]', filtradoPersona[0], label);
            var data = filtradoPersona;
            console.log('data', data);
            datasetsLine.push({
                label: label + "-" + element,
                borderColor: "#" + randomColor,
                backgroundColor: "#" + randomColor,
                data: data,
                fill: false,
                lineTension: 0.1
            });
        });
    });
    return "{\n        labels: " + JSON.stringify(labelsDate) + ",\n        datasets: " + JSON.stringify(datasetsLine) + "\n    }";
}
function dataLinesWorkEmotion(workEmotion) {
    var datasetsLine = [];
    var labelsDate = {};
    var nombreUsuariosMap = new Map();
    var nombreUsuarios = [];
    workEmotion.forEach(function (dias) { return dias.relationScorePerson.forEach(function (datos) { return nombreUsuariosMap.set(datos.name, datos.name); }); });
    nombreUsuariosMap.forEach(function (nombre) { return nombreUsuarios.push(nombre); });
    nombreUsuarios.forEach(function (nombre) {
        var datosFiltrados = workEmotion.map(function (dias) { return dias.relationScorePerson.filter(function (datos) { return datos.name == nombre; })[0]; });
        var datosOrdenado = datosFiltrados.sort(function (a, b) { return a.scoreWorkDay - b.scoreWorkDay; });
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        var data = datosOrdenado.map(function (data) {
            labelsDate[data.scoreWorkDay] = data.scoreWorkDay;
            return data.scoreEmotionDay;
        });
        datasetsLine.push({ label: nombre,
            borderColor: "#" + randomColor,
            backgroundColor: "#" + randomColor,
            data: data,
            fill: false,
            lineTension: 0.1
        });
    });
    var orderLabelsWork = [];
    for (var date in labelsDate) {
        orderLabelsWork.push(labelsDate[date]);
    }
    orderLabelsWork.sort(function (a, b) { return a - b; });
    return "{\n        labels: " + JSON.stringify(orderLabelsWork) + ",\n        datasets: " + JSON.stringify(datasetsLine) + "\n    }";
}
function dataLines(emotionDate) {
    var datasetsLine = [];
    var labelsDate = [];
    var usersLabel = new Map();
    emotionDate.forEach(function (info) {
        labelsDate.push(info.date);
        info.scorePersons.forEach(function (data) {
            var arrayScore = usersLabel.get(data.name) == undefined ? [] : usersLabel.get(data.name);
            arrayScore.push(data.score);
            usersLabel.set(data.name, arrayScore);
        });
    });
    var indexAxis = 1;
    usersLabel.forEach(function (data, key) {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        datasetsLine.push({ label: key,
            borderColor: "#" + randomColor,
            backgroundColor: "#" + randomColor,
            data: data,
            fill: false,
            lineTension: 0.1 });
    });
    return "{\n        labels: " + JSON.stringify(labelsDate) + ",\n        datasets: " + JSON.stringify(datasetsLine) + "\n    }";
}
function graficaLine(linesData) {
    return "\n        var ctx = document.getElementById('canvas').getContext('2d');\n        window.myLine = Chart.Line(ctx, {\n            data: " + linesData + ",\n            options: {\n                responsive: true,\n                hoverMode: 'index',\n                stacked: false,\n                title: {\n                    display: true,\n                    text: 'Emocion en chat'\n                },\n                scales: {\n                    yAxes: [{\n                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance\n                        display: true,\n                        position: 'left',\n                        id: 'y-axis-1',\n                    }, {\n                        type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance\n                        display: true,\n                        position: 'right',\n                        id: 'y-axis-2',\n\n                        // grid line settings\n                        gridLines: {\n                            drawOnChartArea: false, // only want the grid lines for one axis to show up\n                        },\n                    }],\n                }\n            }\n        });";
}
function graficaCompleta(emotionDate, dataLinesR) {
    return graficaLine(dataLinesR(emotionDate));
}
function encapsularHTML(esqueletoHTML) {
    return "\n<!DOCTYPE html>\n<head>\n    <meta charset=\"UTF-8\">\n    <!-- Latest compiled and minified CSS -->\n    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">              \n    <title>\n        " + esqueletoHTML.title + "\n    </title>\n</head> \n<body>     \n    <!-- jQuery library -->\n    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js\"></script>          \n    <!-- Latest compiled JavaScript -->\n    <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js\"></script>   \n    <script src=\"http://www.chartjs.org/dist/2.7.1/Chart.bundle.js\"></script>   \n    <script src=\"https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.js\"></script>                   \n    <h1> " + esqueletoHTML.title + " </h1>\n            " + esqueletoHTML.body + " \n\n    <script>" + esqueletoHTML.script + " </script>\n</body>    \n</html>  ";
}
var htmlFile = encapsularHTML({ title: 'Emociones chat',
    body: "<canvas id=\"canvas\" width=\"441\" height=\"220\" class=\"chartjs-render-monitor\" style=\"display: block; width: 441px; height: 220px;\"></canvas>",
    script: graficaCompleta(resultEmotionDate, dataLines) });
fs.writeFile("../public/viewEmotionDate.html", htmlFile, function (error) {
    if (error)
        console.log(error);
    else
        console.log("El archivo fue creado viewEmotionDate");
});
htmlFile = encapsularHTML({ title: 'Relacion fecha trabajo y emociones chat',
    body: "<canvas id=\"canvas\" width=\"441\" height=\"220\" class=\"chartjs-render-monitor\" style=\"display: block; width: 441px; height: 220px;\"></canvas>",
    script: graficaCompleta(resultEmotionWork, dataLinesDateWorkEmotion) });
fs.writeFile("../public/viewEmotionWorkDate.html", htmlFile, function (error) {
    if (error)
        console.log(error);
    else
        console.log("El archivo fue creado viewEmotionWorkDate");
});
htmlFile = encapsularHTML({ title: 'Relacion Emociones chat',
    body: "<canvas id=\"canvas\" width=\"441\" height=\"220\" class=\"chartjs-render-monitor\" style=\"display: block; width: 441px; height: 220px;\"></canvas>",
    script: graficaCompleta(resultEmotionWork, dataLinesWorkEmotion) });
fs.writeFile("../public/viewEmotionWork.html", htmlFile, function (error) {
    if (error)
        console.log(error);
    else
        console.log("El archivo fue creado viewEmotionWork");
});
