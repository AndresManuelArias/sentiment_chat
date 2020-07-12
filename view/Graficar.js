"use strict";
exports.__esModule = true;
var fs = require('fs');
function encapsularHTML(esqueletoHTML) {
    return "\n<!DOCTYPE html>\n<head>\n    <meta charset=\"UTF-8\">\n    <!-- Latest compiled and minified CSS -->\n    <link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css\">              \n    <title>\n        " + esqueletoHTML.title + "\n    </title>\n</head> \n<body>     \n    <!-- jQuery library -->\n    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js\"></script>          \n    <!-- Latest compiled JavaScript -->\n    <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js\"></script>   \n    <script src=\"http://www.chartjs.org/dist/2.7.1/Chart.bundle.js\"></script>   \n    <script src=\"https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.js\"></script>                   \n    <h1> " + esqueletoHTML.title + " </h1>\n            " + esqueletoHTML.body + " \n\n    <script>" + esqueletoHTML.script + " </script>\n</body>    \n</html>  ";
}
function converDataLine(data, columX, columY) {
    var labels = new Map();
    var dataColumnX = data.map(function (row) {
        var arrayGuardar = labels.get(row[columY.label]);
        if (arrayGuardar) {
            labels.set(row[columY.label], arrayGuardar.concat([row[columY.data]]));
        }
        else {
            labels.set(row[columY.label], []);
        }
        return row[columX];
    });
    var datasets = [];
    labels.forEach(function (row, key) {
        var randomColor = Math.floor(Math.random() * 16777215).toString(16);
        datasets.push({
            label: key,
            data: row,
            borderColor: "#" + randomColor,
            backgroundColor: "#" + randomColor,
            fill: false,
            lineTension: 0.1
        });
    });
    return {
        labels: dataColumnX,
        datasets: datasets
    };
}
function graficaLine(data, columX, columY, optionGrafi) {
    return "\n         var ctx = document.getElementById('d" + optionGrafi.id + "').getContext('2d');\n         window.myLine = Chart.Line(ctx, {\n             data: " + JSON.stringify(converDataLine(data, columX, columY)) + ",\n             options: {\n                 responsive: true,\n                 hoverMode: 'index',\n                 stacked: false,\n                 title: {\n                     display: true,\n                     text: '" + optionGrafi.tittle + "'\n                 },\n                 scales: {\n                     yAxes: [{\n                         type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance\n                         display: true,\n                         position: 'left',\n                         id: 'y-axis-1',\n                     }, {\n                         type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance\n                         display: true,\n                         position: 'right',\n                         id: 'y-axis-2',\n \n                         // grid line settings\n                         gridLines: {\n                             drawOnChartArea: false, // only want the grid lines for one axis to show up\n                         },\n                     }],\n                 }\n             }\n         });";
}
function canvas(id) {
    return "<canvas id=\"d" + id + "\" width=\"441\" height=\"220\" class=\"chartjs-render-monitor\" style=\"display: block; width: 441px; height: 220px;\"></canvas>";
}
var Graficar = /** @class */ (function () {
    function Graficar(configurarGraficar) {
        this.colectionElementGrafit = [];
        if (configurarGraficar) {
            this.configurarGraficar = configurarGraficar;
        }
    }
    Graficar.prototype.graficaLine = function (data, columX, columY, tittle) {
        var indice = this.colectionElementGrafit.length;
        var elementGrafit = {
            element: canvas(indice),
            codigo: graficaLine(data, columX, columY, { id: indice, tittle: tittle })
        };
        this.colectionElementGrafit.push(elementGrafit);
        if (this.configurarGraficar) {
            var body_1 = "";
            var codigo_1 = "";
            this.colectionElementGrafit.forEach(function (element) {
                body_1 += element.element;
                codigo_1 += element.codigo;
            });
            var htmlFile = encapsularHTML({ title: this.configurarGraficar.title,
                body: body_1,
                script: codigo_1
            });
            fs.writeFile(this.configurarGraficar.savePage, htmlFile, function (error) {
                if (error)
                    console.log(error);
                else
                    console.log("grafica linea agregada");
            });
        }
        return elementGrafit;
    };
    return Graficar;
}());
exports.Graficar = Graficar;
