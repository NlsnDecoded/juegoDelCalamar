import React, {useState} from "react";
import {convertImageToCanvas} from "../util/Util";
import * as mobilenet from "@tensorflow-models/mobilenet";

const SaveKnn = ({net,classifier, webcam}) => {
    const classes = ["Untrained", "Carla", "Nelson" , "Paper", "CellPhone","Rock"]
    const tf = require('@tensorflow/tfjs');
    const secondImage = 'secondImage';
    const descriptionSecondImage = 'descripcion_second_imagen';

    const saveKnn = async () => {
        //obtenemos el dataset actual del clasificador (labels y vectores)
        let strClassifier = JSON.stringify(Object.entries(classifier.getClassifierDataset()).map(([label, data]) => [label, Array.from(data.dataSync()), data.shape]));
        const storageKey = "knnClassifier";
        //lo almacenamos en el localStorage
        localStorage.setItem(storageKey, strClassifier);
    };

    return <>
        <div id="saveKnn" style={{backgroundColor:'#AAFFEE', paddingTop:'1em'}} title="SaveKnn">
            <button id="btnRecognize" onClick={() => saveKnn()}>SAVE KNN</button>
        </div>
    </>
}

export default SaveKnn;