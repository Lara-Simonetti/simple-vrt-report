const config = require("./config.json");
const fs = require('fs');
const compareImages = require("resemblejs/compareImages");
steps = [];
folders = ["second-results", "first-results"]

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
                fs.readFileSync(`./first-results/${steps[i]}.png`),
                fs.readFileSync(`./second-results/${steps[i]}.png`)
                
            );
            resultInfo[steps[i]] = {
                isSameDimensions: data.isSameDimensions,
                dimensionDifference: data.dimensionDifference,
                rawMisMatchPercentage: data.rawMisMatchPercentage,
                misMatchPercentage: data.misMatchPercentage,
                diffBounds: data.diffBounds,
                analysisTime: data.analysisTime
            }
            fs.writeFileSync(`./final-results/${steps[i]}.png`, data.getBuffer());
        }
    console.log('------------------------------------------------------------------------------------')
    console.log("Execution finished. Check the report under the results folder")
    return resultInfo;
}

function comparisonsHTML(){
    folders.push("final-results");
    result = "";
    for(let i = 0; i < steps.length; i++){
        result+=(`<div id="comparison-${steps[i]}">
        <div id = "first">
            <img class="img2" src="./first-results/${steps[i]}.png" id="firstImage" label="Primera prueba ejecutada">
        </div>
        <div id = "second">
            <img class="img2" src="./second-results/${steps[i]}.png" id="secondImage" label="Segunda prueba ejecutada">
        </div>
        <div id = "final">
            <img class="img2" src="./final-results/${steps[i]}.png" id="finalImage" label="Comparación entre ambas pruebas">
        </div>`);
    }
    return result;
}

function createReport(){
    comparisons = comparisonsHTML();
    reportHTML = `<html>
    <head>
        <title> Reporte de Pruebas de Regresión Visual </title>
        <link href="index.css" type="text/css" rel="stylesheet">
    </head>
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