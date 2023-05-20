import React from "react";

const AddCompetitor = ({net, classifier, webcam}) => {
    // const tf = require('@tensorflow/tfjs');
    // const classes = ["Untrained", "Carla", "Nelson" , "Paper", "CellPhone","Rock"]

    async function addExample(classId) {
        try {
            console.log("Training");
            const img = await webcam.capture();
            const activation = net.infer(img, true);

            console.log("classID", classId);
            classifier.addExample(activation, classId);
            //liberamos el tensor
            img.dispose();
        } catch (e) {
            console.log(e)
        }
    }

    return <>
        <button id="btnUntrained" onClick={() => addExample(0)}>Untrained</button>
        <button id="btnNelson2" onClick={() => addExample(1)}>Carla</button>
        <button id="btnNelson3" onClick={() => addExample(2)}>Nelson</button>
        <button id="btnNelson4" onClick={() => addExample(3)}>Paper</button>
        <button id="btnNelson5" onClick={() => addExample(4)}>CellPhone</button>
        <button id="btnNelson5" onClick={() => addExample(5)}>Rock</button>

        {/*<RedLigth webcamRef={webcamRef} />*/}
    </>
}

export default AddCompetitor;