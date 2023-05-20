import React, {useEffect, useState} from "react";
import {convertImageToCanvas} from "../util/Util";
import * as mobilenet from "@tensorflow-models/mobilenet";

const LoadKnn = ({classifier, tf}) => {
    const loadKnn = async ()=>{
        const storageKey = "knnClassifier";
        let datasetJson = localStorage.getItem(storageKey);
        classifier.setClassifierDataset(Object.fromEntries(JSON.parse(datasetJson)?.map(([label, data, shape]) => [label, tf.tensor(data, shape)]) ||[]));
    };
    return <>
        <div>
            <div style={{color:'blue'}}>---------------</div>
                <button id="btnLoadKnnId" onClick={() => loadKnn()}>LOAD KNN</button>
        </div>

    </>
}

export default LoadKnn;