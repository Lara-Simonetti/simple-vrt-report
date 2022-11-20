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
    
//    for(let i = 0; i < files.length; i++){
//        if(files[i].slice(0,5) == "after"){
//            steps.push(files[i].slice(6).slice(0, -4));
//        }
//    }
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
            fs.writeFileSync(`./final-results/compare-${steps[i]}.png`, data.getBuffer());
        }
    console.log('------------------------------------------------------------------------------------')
    console.log("Execution finished. Check the report under the results folder")
    return resultInfo;
}


getSteps();
(async ()=>console.log(await executeComparison()))();
