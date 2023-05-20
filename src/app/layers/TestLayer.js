import React, {useEffect, useRef, useState} from "react";
import SaveKnn from "../actions/SaveKnn";
import Webcam from "react-webcam";
import RedLigth from "../actions/RedLigth";
import LoadKnn from "../actions/LoadKnn";

const TestLayer = () => {
    const tf = require('@tensorflow/tfjs');
    const mobilenet = require('@tensorflow-models/mobilenet');
    const knnClassifier = require('@tensorflow-models/knn-classifier');

    let [netLoaded,setNetLoaded] = useState(false);
    let [webcam,setWebcam] = useState(null);
    let [classifier] = useState(knnClassifier.create());


    const webcamRef = useRef(null);
    const webcamElement = document.getElementById('webcam');

    const [model, setModel] = useState();

    //Competitors
    const classes = ["Untrained", "Carla", "Nelson", "Paper", "CellPhone", "Rock"]
    //
    let [counterDetection] = useState({});



    async function loadModel() {
        const webcamElement = webcamRef.current.video;
        try {
            const model = await mobilenet?.load();
            setModel(model);
            console.log("set loaded Model");
            setNetLoaded(true)

            setWebcam(webcamElement)

        }
        catch (err) {
            console.log(err);
            console.log("failed load model");
        }
    }


    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };

    async function addExample(classId) {
        try {
            // await tf.data.webcam(webcamElement, {resizeHeight: 200, resizeWidth: 200}).then(async result => {
            //     const img = await webcam.capture();
            const img = webcamRef.current.video;
            const activation = model.infer(img, true);
            classifier.addExample(activation, classId);
            //liberamos el tensor
            // img.dispose()
            // })
        } catch (e) {
            console.log("error", e)
        }
    }

    useEffect(() => {
        tf.ready().then(() => {
            loadModel();
        });
        // eslint-disable-next-line
    }, []);



    async function predictImg() {
        const img = webcamRef.current.video;
        const activation = model.infer(img, 'conv_preds');

        var result2;
        try {
            result2 = await classifier.predictClass(activation);

        } catch (error) {
            result2 = {};
        }

        // const classes = ["Untrained", "Carla", "Nelson", "Paper", "CellPhone", "Rock"]

        try {
            console.log(classes[result2.label], result2.confidences[result2.label])
        } catch (error) {
            document.getElementById("console2").innerText = "Untrained";
        }
    }


    const predictImgExported = async (imageData) => {
        console.log("predictImgExported")
        const imgEl = imageData;
        const activation = model.infer(imgEl, 'conv_preds');
        var result2;
        try {
            result2 = await classifier.predictClass(activation);

        } catch (error) {
            result2 = {};
        }

        // const classes = ["Untrained", "Carla", "Nelson", "Paper", "CellPhone", "Rock"]

        try {
            const competitor = classes[result2.label];
            const confidence = result2.confidences[result2.label];
            if(confidence===1){
                if(Object.keys(counterDetection)?.find(itm=> itm===competitor)){
                // if(Object.keys(counterDetection)?.find(itm2=> counterDetection[itm2]===competitor))
                //     Object.keys(counterDetection).map(itm=> itm[competitor]? {...itm[competitor], [competitor]:itm[competitor]+1 }:itm )
                    counterDetection= {...counterDetection, [competitor]:counterDetection[competitor]+1 }
                }else{
                    counterDetection[competitor]=1
                }
                console.log(counterDetection)
                // console.log(classes[result2.label], result2.confidences[result2.label])
            }
        } catch (error) {
            console.log("errror",error)
            // document.getElementById("console2").innerText = "Untrained";
        }
    }

    const updateDataResultChanges = async (dataResultLenght) => {
        try {
            console.log("dataResultOn TestLayer::",dataResultLenght)
        } catch (error) {
            console.log("errorOnUpdateDataResultTestLayer")
        }
    }

    const resultCompetitor = () => {
        console.log("resultCompetitor::",counterDetection)
    }

    return <>

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

        <div>
            <button id="btnUntrained" onClick={()=>addExample(0)}>Untrained</button>
            <button id="btnNelson2" onClick={()=>addExample(1)}>Carla</button>
            <button id="btnNelson3" onClick={()=>addExample(2)}>Nelson</button>
            <button id="btnNelson4" onClick={()=>addExample(3)}>Paper</button>
            <button id="btnNelson5" onClick={()=>addExample(4)}>CellPhone</button>
            <button id="btnNelson5" onClick={()=>addExample(5)}>Rock</button>
        </div>
        <button id="btnNelson5" onClick={()=>predictImg()}>Predict</button>
        <button id="btnNelson5" onClick={()=>resultCompetitor()}>Result Competitor</button>

        <div> <span> LOAD AND SAVE  KNN</span>
            {netLoaded && model && webcam && webcamElement? <LoadKnn classifier={classifier} tf={tf}/>:<div>empty</div>}
            {netLoaded && model && webcam && webcamElement? <SaveKnn classifier={classifier} />:<div>empty</div>}
        </div>

        <RedLigth webcamRef={webcamRef} predictImageFunction={predictImgExported} updateDataResultChanges={updateDataResultChanges}  />
    </>
}

export default TestLayer;