import React, {useEffect,useState} from "react";
import AddCompetitor from "../actions/AddCompetitor";
import RecognizeCompetitor from "../actions/RecognizeCompetitor";


const LayerApp = () => {
    const tf = require('@tensorflow/tfjs');
    const mobilenet = require('@tensorflow-models/mobilenet');
    const knnClassifier = require('@tensorflow-models/knn-classifier');

    let [net,setNet] = useState(null);
    let [classifier,setClassifier] = useState(null);
    let [netLoaded,setNetLoaded] = useState(false);
    let [webcam,setWebcam] = useState(null);

    const webcamElement = document.getElementById('webcam');

    const initialiseTensorflow = async () => {
        await tf.ready();
        tf.getBackend();
    }

    useEffect(() => {
        (async () => {
            // initialise Tensorflow
            initialiseTensorflow();
            // load the model
            setClassifier(knnClassifier.create());
            await mobilenet.load()
                .then(r => {
                    setNet(r);
                    setNetLoaded(true)
                    console.log("modelLoadedComplete",net);
                });
            await tf.data.webcam(webcamElement,{resizeHeight:200,resizeWidth:200}).then(r =>{
                setWebcam(r);
            });
        })();
    }, []);

    useEffect(() => {
        console.log("completed",netLoaded)
    }, [netLoaded]);

    return <>
        <div>LayerMain</div>
        {console.log("actualizaCompoentnte")}
        --------------------------------
        {/*<br />*/}
        {/*<RecognizeCompetitor />*/}
        {netLoaded? <AddCompetitor net={net} classifier={classifier} webcam={webcam}/>:<div>empty</div>}
        {/*--------------------------------*/}
        <br />
        {netLoaded? <RecognizeCompetitor net={net} classifier={classifier} webcam={webcam} />:<div>empty</div>}
    </>
}

export default LayerApp;