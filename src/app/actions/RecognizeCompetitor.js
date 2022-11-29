import React, {useState} from "react";
import {convertImageToCanvas} from "../util/Util";

const RecognizeCompetitor = ({net,classifier, webcam}) => {
    const classes = ["Untrained", "Carla", "Nelson" , "Dino", "OK","Rock"]

    async function recognizeImage() {
        // const classifier = knnClassifier.create();
        // net= await mobilenet.load();
        const imgEl = document.getElementById("lastImageCaptured");
        const descEl = document.getElementById("descripcion_imagen");

        // const result = await net.classify(imgEl);
        const activation = net.infer(imgEl, "conv_preds");
        var result2;
        try {

            result2 = await classifier.predictClass(activation);

            document.getElementById('console').innerText = `
             prediction: ${classes[result2.label]}\n
             probability: ${result2.confidences[result2.label]}`;
        } catch (error) {
            result2 = {};
        }
        // console.log(result);
        console.log("result2::: ",result2);
        descEl.innerHTML = JSON.stringify(result2);
    }

    return <>
        <div style={{color:'blue'}}>---------------</div>
        <button id="btnRecognize" onClick={() => recognizeImage()}>Recognize Imagen</button>
        <div id="descripcion_imagen"></div>
        <div style={{color:'red',font:'bold'}}>Inferencia2</div>
        <div id="console"></div>
    </>
}

export default RecognizeCompetitor;