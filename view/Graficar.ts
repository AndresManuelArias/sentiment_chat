const fs = require('fs');
interface EsqueletoHTML {
    title:string,
    body:string,
    script:string
}
function encapsularHTML(esqueletoHTML:EsqueletoHTML):string{
    return `
<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">              
    <title>
        ${esqueletoHTML.title}
    </title>
</head> 
<body>     
    <!-- jQuery library -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>          
    <!-- Latest compiled JavaScript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>   
    <script src="http://www.chartjs.org/dist/2.7.1/Chart.bundle.js"></script>   
    <script src="https://cdn.jsdelivr.net/npm/vue@2.5.13/dist/vue.js"></script>                   
    <h1> ${esqueletoHTML.title} </h1>
            ${esqueletoHTML.body} 

    <script>${esqueletoHTML.script} </script>
</body>    
</html>  `;
}

interface Datasets{
    label:string,
    borderColor?:string,
    backgroundColor?:string,
    data:number[],
    fill?:boolean,
    lineTension?:number
}
interface Data {
    labels:string[],
    datasets:Datasets[]
}
interface ColumY{
    label:string,
    data:string
}
function converDataLine(data:JSON[],columX:string,columY:ColumY):Data{ 
    let labels:Map<string,number[]> = new Map()
    let dataColumnX = data.map(row =>{ 
        let arrayGuardar:number[] = labels.get(row[columY.label]);
        if(arrayGuardar){
            labels.set(row[columY.label],arrayGuardar.concat([row[columY.data]]))
        }else{
            labels.set(row[columY.label],[]);
        }
        return row[columX]
    });
    let datasets:Datasets[] = [];
    labels.forEach((row,key) => {
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        datasets.push({
            label:key,
            data:row,
            borderColor:`#${randomColor}`,
            backgroundColor:`#${randomColor}`,
            fill:false,
            lineTension:0.1
        });
    });
    return {
        labels:dataColumnX,
        datasets:datasets
    }
}

function      graficarBarras(data:JSON[],columX:string,columY:ColumY,optionGrafi:OptionGrafi):string{

    return`
    
    
    var myBarChart = new Chart(ctx, {
        type: 'bar',
        data: ${JSON.stringify(converDataLine(data,columX,columY))},
        options: {
            responsive: true,
            hoverMode: 'index',
            stacked: false,
            title: {
                display: true,
                text: '${optionGrafi.tittle}'
            }
    });`
 }
 function graficaLine(data:JSON[],columX:string,columY:ColumY,optionGrafi:OptionGrafi):string {
    return  `
         var ctx = document.getElementById('d${optionGrafi.id}').getContext('2d');
         window.myLine = Chart.Line(ctx, {
             data: ${JSON.stringify(converDataLine(data,columX,columY))},
             options: {
                 responsive: true,
                 hoverMode: 'index',
                 stacked: false,
                 title: {
                     display: true,
                     text: '${optionGrafi.tittle}'
                 },
                 scales: {
                     yAxes: [{
                         type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                         display: true,
                         position: 'left',
                         id: 'y-axis-1',
                     }, {
                         type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                         display: true,
                         position: 'right',
                         id: 'y-axis-2',
 
                         // grid line settings
                         gridLines: {
                             drawOnChartArea: false, // only want the grid lines for one axis to show up
                         },
                     }],
                 }
             }
         });`
 }

 interface ConfigurarGraficar {
    savePage:string
    title:string
 }
 interface ElementGrafit{
    element:string
    codigo:string
 }
 interface OptionGrafi{
     id:number,
     tittle:string
 }
 function canvas(id:number):string{
     return `<canvas id="d${id}" width="441" height="220" class="chartjs-render-monitor" style="display: block; width: 441px; height: 220px;"></canvas>`
 }
 export class Graficar{
    private configurarGraficar:ConfigurarGraficar
    private colectionElementGrafit:ElementGrafit[]
    constructor(configurarGraficar?:ConfigurarGraficar){
        this.colectionElementGrafit = [];
        if(configurarGraficar){
            this.configurarGraficar = configurarGraficar;
        }
    }
    public graficaLine(data:JSON[],columX:string,columY:ColumY,tittle?:string):ElementGrafit{
        let indice = this.colectionElementGrafit.length;
        let elementGrafit = {
            element:canvas(indice),
            codigo:graficaLine(data,columX,columY, {id:indice,tittle:tittle})
        };
        this.colectionElementGrafit.push(elementGrafit);
        if( this.configurarGraficar){
            let body = "";
            let codigo = "";
            this.colectionElementGrafit.forEach((element) => {
                body += element.element;
                codigo += element.codigo
            });
            let htmlFile =encapsularHTML({title:this.configurarGraficar.title,
                body:body,
                script:codigo
            });          
            fs.writeFile(this.configurarGraficar.savePage,htmlFile, error => {
                if (error)
                    console.log(error);
                else
                    console.log(`grafica linea agregada`);
            });
        }
        return elementGrafit; 
     }
     graficarBarras(data:JSON[],columX:string,columY:ColumY,tittle?:string):ElementGrafit{
        
        let indice = this.colectionElementGrafit.length;
        let elementGrafit:ElementGrafit = {
            element:canvas(indice),
            codigo:graficarBarras(data,columX,columY, {id:indice,tittle:tittle})
        };
        this.colectionElementGrafit.push(elementGrafit);
        if( this.configurarGraficar){
            let body = "";
            let codigo = "";
            this.colectionElementGrafit.forEach((element) => {
                body += element.element;
                codigo += element.codigo
            });
            let htmlFile =encapsularHTML({title:this.configurarGraficar.title,
                body:body,
                script:codigo
            });          
            fs.writeFile(this.configurarGraficar.savePage,htmlFile, error => {
                if (error)
                    console.log(error);
                else
                    console.log(`grafica linea agregada`);
            });
        }
        return elementGrafit; 
     }
 }