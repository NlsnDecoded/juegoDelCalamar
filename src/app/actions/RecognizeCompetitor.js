import React, {useState} from "react";
import {convertImageToCanvas} from "../util/Util";
import * as mobilenet from "@tensorflow-models/mobilenet";

const RecognizeCompetitor = ({net,classifier, webcam, tf}) => {
    const classes = ["Untrained", "Carla", "Nelson" , "Paper", "CellPhone","Rock"]
    // const tf = require('@tensorflow/tfjs');
    const secondImage = 'secondImage';
    const descriptionSecondImage = 'descripcion_second_imagen';

    async function recognizeImage() {
        const imgEl = await webcam.capture();
        // const classifier = knnClassifier.create();
        // net= await mobilenet.load();
        // const imgEl = document.getElementById(secondImage);
        // const descEl = document.getElementById(descriptionSecondImage);
        // const result = await net.classify(imgEl);
        const activation = net.infer(imgEl, 'conv_preds');
        var result2;
        try {

            result2 = await classifier.predictClass(activation);

            document.getElementById('console').innerText = `
             prediction: ${classes[result2.label]}\n
             probability: ${result2.confidences[result2.label]}`;
        } catch (error) {
            result2 = {};
        }
        imgEl.dispose();
        // await tf.nextFrame();

        // console.log(result);
        // console.log("result2::: ",result2);
        // descEl.innerHTML = JSON.stringify(result2);
    }




    async function recognizeviaCamera() {


        // net= await mobilenet.load();
        //obtenemos datos del webcam
        // const webcamElement = document.getElementById('webcam');
        //  webcam = await tf.data.webcam(webcamElement,{resizeHeight:200,resizeWidth:200})
        console.log(net,webcam,classifier)
        while (true) {
            const img = await webcam.capture();
            const result = await net.classify(img);
            const activation = net.infer(img, 'conv_preds');

            var result2;
            try {
                result2 = await classifier.predictClass(activation);
                console.log(result2)
                document.getElementById('console').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;
            } catch (error) {
                result2 = {};
            }

            try {
                document.getElementById("console2").innerText = `
    prediction: ${classes[result2.label]}\n
    probability: ${result2.confidences[result2.label]}
    `;
            } catch (error) {
                document.getElementById("console2").innerText="Untrained";
            }
            // Dispose the tensor to release the memory.
            img.dispose();

            // Give some breathing room by waiting for the next animation frame to
            // fire.
            await tf.nextFrame();
        }
    }

    //recognizeLoop
    async function recognizeImageLoop() {
        // const classifier = knnClassifier.create();
        // net= await mobilenet.load();
        for(var i=0;i<100;i++){
            const imgEl = document.getElementById(`imgChild-${i}`);
            // const descEl = document.getElementById("descripcion_imagen");

            // const result = await net.classify(imgEl);
            console.log(imgEl)
            const activation = net.infer(imgEl, "conv_preds");
            var result2;
            try {

                result2 = await classifier.predictClass(activation);
                console.log(`
             prediction-${i}: ${classes[result2.label]} 
             probability-${i}: ${result2.confidences[result2.label]}`);
            } catch (error) {
                result2 = {};
            }

            // console.log(result);
            console.log("result2::: ",result2);

            // Give some breathing room by waiting for the next animation frame to
            // fire.
            await tf.nextFrame();
        }

    }

    const loadKnn = async ()=>{
        const storageKey = "knnClassifier";
        let datasetJson = localStorage.getItem(storageKey);
        classifier.setClassifierDataset(Object.fromEntries(JSON.parse(datasetJson).map(([label, data, shape]) => [label, tf.tensor(data, shape)])));
    };

    return <>
        <div>
            <div style={{color:'blue'}}>---------------</div>
            <button id="btnLoadKnnId" onClick={() => loadKnn()}>LOAD KNN</button>
            <div>
                <button id="btnRecognize" onClick={() => recognizeImage()}>Recognize Imagen</button>
                <button id="btnRecognize" onClick={() => recognizeviaCamera()}>Recognize Imagen via Camera</button>
                <div id={descriptionSecondImage}></div>
            </div>
            <div>
                <button id="btnRecognizeLoop" onClick={() => recognizeImageLoop()}>Recognize Loop</button>
                <div id="descripcion_imagen"></div>
                <div style={{color:'red',font:'bold'}}>Inferencia2</div>
            </div>

            <div id="console"></div><br/>
            <div id="console2"></div><br/>
        </div>

    </>
}

export default RecognizeCompetitor;