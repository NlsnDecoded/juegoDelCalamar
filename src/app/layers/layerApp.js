import React, {useEffect, useRef, useState} from "react";
import AddCompetitor from "../actions/AddCompetitor";
import RecognizeCompetitor from "../actions/RecognizeCompetitor";
import SaveKnn from "../actions/SaveKnn";
import Webcam from "react-webcam";
// import tf from "@tensorflow/tfjs";
// import {KNNClassifier} from "@tensorflow-models/knn-classifier"
// import {MobileNet} from "@tensorflow-models/mobilenet"
// import * as MobileNet from "@tensorflow-models/mobilenet";
// import * as tf  from "@tensorflow/tfjs";

const LayerApp = () => {
    const tf = require('@tensorflow/tfjs');
    const mobilenet = require('@tensorflow-models/mobilenet');
    const knnClassifier = require('@tensorflow-models/knn-classifier');

    let [net,setNet] = useState(null);
    // let [classifier,setClassifier] = useState(null);
    let [netLoaded,setNetLoaded] = useState(false);
    let [webcam,setWebcam] = useState(null);
    let [tensorFlow,setTensorFlow] = useState(null);
    let [classifier,setClassifier] = useState(knnClassifier.create());


    const webcamRef = useRef(null);
    const webcamElement = document.getElementById('webcam');

    // const initialiseTensorflow = async () => {
    //     await tf.ready().then(r=>{console.log("tensorInit",r);setTensorFlow(r)});
    //     tf.getBackend();
    // }

    // useEffect(() => {
    //     (async () => {
    //
    //         // initialise Tensorflow
    //         await initialiseTensorflow();
    //         await tf.data.webcam(webcamElement,{resizeHeight:200,resizeWidth:200}).then(r =>{
    //             setWebcam(r);
    //             console.log("completedLoadWebCam",r)
    //         });
    //
    //         // load the model
    //         // setClassifier(knnClassifier.create());
    //         await mobileNet.load()
    //             .then(r => {
    //                 setNet(r);
    //                 setNetLoaded(true)
    //                 console.log("modelLoadedComplete",r);
    //             });
    //
    //     })();
    // }, []);
    //
    // useEffect(() => {
    //     console.log("completed",netLoaded)
    // }, [netLoaded]);

    const [model, setModel] = useState();
    async function loadModel() {
        try {
            const model = await mobilenet?.load();
            setModel(model);
            console.log("set loaded Model");
            setNetLoaded(true)

            // await tf.data.webcam(webcamElement,{resizeHeight:200,resizeWidth:200}).then(r =>{
            //     setWebcam(r);
            //     console.log("completedLoadWebCam",r)
            // });
            // setWebcam(await tf.data.webcam(webcamElement,{resizeHeight:200,resizeWidth:200}));
            // try {
                await tf.data.webcam(webcamElement,{resizeHeight:200,resizeWidth:200}).then(result =>setWebcam(result) );
            // } catch (e){
            //     console.log("onSetWebCam",e)
            // }

        }
        catch (err) {
            console.log(err);
            console.log("failed load model");
        }
    }
    useEffect(() => {
        tf.ready().then(() => {
            loadModel();
        });
    }, []);

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };


    return <>
        <div>LayerMain</div>
        <Webcam
            id="webcam"
            audio={false}
            height={200}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            videoConstraints={videoConstraints}
        />

        <br />
        {netLoaded && model && webcam && webcamElement? <AddCompetitor net={model} classifier={classifier} webcam={webcam} tf={tf}  webcamElement={webcamElement}/>:<div>empty</div>}
        <br />
        {netLoaded && model && webcam && webcamElement? <RecognizeCompetitor net={model} classifier={classifier} webcam={webcam} tf={tf} webcamElement={webcamElement} />:<div>empty</div>}
        {netLoaded && model && webcam && webcamElement? <SaveKnn net={model} classifier={classifier} />:<div>empty</div>}

    </>
}

export default LayerApp;