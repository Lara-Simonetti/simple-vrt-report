const config = require("./config.json");
const fs = require('fs');
const compareImages = require("resemblejs/compareImages");

steps = [];
folders = ['second-results', 'first-results']
fileType = '.png'

function getSteps(){
    var files = fs.readdirSync('./first-results/');
    for(let i = 0; i < files.length; i++){
        steps.push(files[i].slice(0,-4));
    }
}

async function executeComparison(){
    let resultInfo = {}
    for(let i = 0; i < steps.length; i++){
            const data = await compareImages(
                fs.readFileSync(`./first-results/${steps[i]}${fileType}`),
                fs.readFileSync(`./second-results/${steps[i]}${fileType}`)
                
            );
            resultInfo[steps[i]] = {
                isSameDimensions: data.isSameDimensions,
                dimensionDifference: data.dimensionDifference,
                rawMisMatchPercentage: data.rawMisMatchPercentage,
                misMatchPercentage: data.misMatchPercentage,
                diffBounds: data.diffBounds,
                analysisTime: data.analysisTime
            }
            fs.writeFileSync(`./final-results/${steps[i]}${fileType}`, data.getBuffer());
        }
    console.log('------------------------------------------------------------------------------------')
    console.log("Execution finished. Check the report under the results folder")
    return resultInfo;
}

function comparisonsHTML(){
    folders.push("final-results");
    result = "";
    for(let i = 0; i < steps.length; i++){
        result+=(`<div id="comparison-${steps[i]}" class="container">
    <h2 class="mt-2 mb-3">Visual Regression Testing: ${steps[i]}</h2>
        <div class = "row">
                <div id = "first" class="col-md-4">
                    <h3 class="mt-2 mb-3"><small class="text-muted">First Execution</small></h3>
                    <img class="img-fluid" src="./first-results/${steps[i]}${fileType}" id="firstImage" label="Primera prueba ejecutada">
                </div>
                <div id = "second" class="col-md-4">
                    <h3 class="mt-2 mb-3"><small class="text-muted">Second Execution</small></h3>
                    <img class="img-fluid" src="./second-results/${steps[i]}${fileType}" id="secondImage" label="Segunda prueba ejecutada">
                </div>
                <div id = "final" class="col-md-4">
                    <h3 class="mt-2 mb-3"><small class="text-muted">Difference</small></h3>
                    <img class="img-fluid" src="./final-results/${steps[i]}${fileType}" id="finalImage" label="Comparación entre ambas pruebas">
                </div>
            </div>
            <hr>
    </div>`);
    }
    return result;
}

function createReport(){
    comparisons = comparisonsHTML();
    currentDate = new Date().toLocaleString();

    reportHTML = `<html>
    <head>
        <title> Visual Regression Testing Report </title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    </head>
    <div class = "container">
        <h1> Visual Regression Testing Report </h1>
        <h2><small class="text-muted">Date Generated: ${currentDate}</small></h2>
        <hr>
    </div>
    <body>
        ${comparisons}
    </body>
</html>`;
    fs.writeFileSync(`report.html`, reportHTML);
}

// Obtain steps to compare
getSteps();

// Execute comparison
(async ()=>console.log(await executeComparison()))();

// Create HTML report
(async ()=>createReport(await executeComparison()))();