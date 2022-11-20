const config = require("./config.json");
const fs = require('fs');
const compareImages = require("resemblejs/compareImages");
steps = [];

function getSteps(){
    var files = fs.readdirSync('./results/');
    for(let i = 0; i < files.length; i++){
        if(files[i].slice(0,5) == "after"){
            steps.push(files[i].slice(6).slice(0, -4));
        }
    }
}

async function executeComparison(){
    console.log("Inicia la comparación");
    let resultInfo = {}
   for(let i = 0; i < steps.length; i++){
        const data = await compareImages(
            fs.readFileSync(`./results/before-${steps[i]}.png`),
            fs.readFileSync(`./results/after-${steps[i]}.png`)
            
        );
        resultInfo[steps[i]] = {
            isSameDimensions: data.isSameDimensions,
            dimensionDifference: data.dimensionDifference,
            rawMisMatchPercentage: data.rawMisMatchPercentage,
            misMatchPercentage: data.misMatchPercentage,
            diffBounds: data.diffBounds,
            analysisTime: data.analysisTime
        }
        fs.writeFileSync(`./results/compare-${steps[i]}.png`, data.getBuffer());
    }
    console.log('------------------------------------------------------------------------------------')
    console.log("Execution finished. Check the report under the results folder")
    return resultInfo;
}


getSteps();
(async ()=>console.log(await executeComparison()))();
