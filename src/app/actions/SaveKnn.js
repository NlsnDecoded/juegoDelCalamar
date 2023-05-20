import React from "react";

const SaveKnn = ({classifier}) => {

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