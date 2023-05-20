import React, {useState} from "react";
import pixelmatch from "pixelmatch";
import {convertImageToCanvas} from "../util/Util"
import kmeans, {kmeansGenerator} from "ml-kmeans";


const RedLigth = ({webcamRef, predictImageFunction, updateDataResultChanges}) => {
    const kmeans = require('ml-kmeans');
    const numberOfClusters = 40; // Number of aggregate dots desired

    const initialImage = 'initialImage';
    const secondImage = 'secondImage';
    //precisionDifference:: Matching threshold, ranges from 0 to 1. Smaller values make the comparison more sensitive. 0.1 by default.
    const precisionDifference = 0.3;
    let [percentImageChanged,setPercentImageChanged] =useState(0);

    async function captureInitialImage(imageId) {
        const imageSrc = await webcamRef.current.getScreenshot();
        const img = document.getElementById(imageId);
        img.setAttribute('src', imageSrc);
    };


    const comparePixelMatch = async function (img1, img2) {
        var cnvBefore = convertImageToCanvas(img1);
        var cnvAfter = convertImageToCanvas(img2);

        var ctxBefore = cnvBefore.getContext("2d");
        var ctxAfter = cnvAfter.getContext("2d");

        let imgDataBefore = ctxBefore.getImageData(0,0,cnvBefore.width, cnvBefore.height);
        let imgDataAfter = ctxAfter.getImageData(0,0, cnvAfter.width, cnvAfter.height);

        const hght = imgDataBefore.height;
        const wdth = imgDataBefore.width;

        var imgDataOutput = new ImageData(wdth, hght);
        var numDiffPixels = pixelmatch(imgDataBefore.data, imgDataAfter.data,
            // imgDataOutput.data, wdth, hght, {threshold: 0.1,alpha:1,diffColor:[147, 141, 170, 1]});
            imgDataOutput.data, wdth, hght, {threshold: precisionDifference ,alpha:0,diffColor:[255, 2, 0, 1]});
        // const canvasFinal =  document.createElement(numDiffPixels.width, numDiffPixels.height);
        const canvasFinal = document.createElement("canvas");
        canvasFinal.width = wdth;
        canvasFinal.height = hght;
        percentImageChanged = ((numDiffPixels*100)/(wdth*hght));
        console.log( wdth*hght,"Porcentaje Modificado:"+ percentImageChanged )
        const contextFinal = canvasFinal.getContext('2d');
        // Draw the generated image with differences on the canvas
        contextFinal.putImageData(imgDataOutput, 0, 0);
        // Add the canvas element to the div element to show
        // document.getElementById("result-container").appendChild(canvasFinal);
        let canvasURL = canvasFinal.toDataURL("image/jpeg",0.5)
        const canvaElm = document.getElementById("resultCanvas")
        canvaElm.setAttribute('src',canvasURL)
    }


    //Fill all the dotImages as redColor to get the position
    let canvas;
    let ctx;
    const [dataResultChanges,setDataResultChanges] = useState([]);
    const [dataResultChangesForClustering,setDataResultChangesForClustering] = useState([]);
    let [resultDataClustering,setResultDataClustering] = useState([]);
    const selectArea = async function () {
        console.log("selectArea")
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        var cnvBefore = convertImageToCanvas("resultCanvas");
        ctx.drawImage(cnvBefore, 0, 0);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const rgbaDefault = `rgba(${255}, ${255}, ${255}, ${1})`;
        const rgbaDefaultArray = [255, 2, 0, 1];

        for(var j=0; j<imageData.width; j++){
            for(var k=0; k<imageData.height; k++){
                const x=j;
                const y=k;
                const imageByPixel = ctx.getImageData(x, y, 1, 1);
                const data = imageByPixel.data;
                const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;

                if (rgba !== rgbaDefault) {
                    dataResultChanges.push({position: {x: x, y: y}, color: rgba})
                    dataResultChangesForClustering.push([x,y])
                }
            }
        }
        console.log(dataResultChanges)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);

        //actualizamos La Función con el tamaño de las diferencias
        updateDataResultChanges(dataResultChanges.length)
        //Hacemos el Clustering también
        await kClustering()
    }


    const kClustering = async function (){
        console.log("kClustering")
        // Extract the coordinates from the dots array
        //         const data = dataResultChanges.map(dot => [dot.x, dot.y]);

        // Perform k-means clustering
        //         const kmeans = new KMeansResult();
                // const { clusters, centroids } = kmeans.cluster(data, numberOfClusters);
                // const { clusters, centroids } = kmeans.kmeans(data, numberOfClusters); //kmeansGenerator(data, numberOfClusters);
                resultDataClustering = kmeans.kmeans(dataResultChangesForClustering, numberOfClusters);
                console.log("CLUSTER AND CENTROIDS", resultDataClustering, resultDataClustering.centroids )
                // console.log(clusters,centroids)
    }


//Here we draw the rectangles image to detect who moved
    const drawRectangle = async function (){
        if(percentImageChanged>0){
            // for(var i=0;i<dataResultChanges.length;i++){
            const kMeansCentroidsResult= resultDataClustering.centroids;
            for(var i=0;i<kMeansCentroidsResult.length;i++){
            // for(var i=0;i<50;i++){
            //     const rndObject = dataResultChanges[Math.floor(Math.random() * dataResultChanges.length)];
            //     const imageDrawed = await drawRectangleImages(rndObject.position.x, rndObject.position.y,i)
            //---esta mal     const rndObject = dataResultChangesForClustering[Math.floor(Math.random() * dataResultChanges.length)];

                //newCodeTry using the clustering centroids Result----
                const imageDrawed = await drawRectangleImages(kMeansCentroidsResult[i][0], kMeansCentroidsResult[i][1],i)
                //-------
                //here we can try to detect who is in the image
                    predictImageFunction(imageDrawed)
                //here we need to work to get the right number of rectangles to try to draw and based on confidence try to identify the person
                //into rectangle that moved.

                // console.log(rndObject.position.x,rndObject.position.y)
            }
        }else{
            console.log("nothing to draw as Rectangles")
        }
    }

    const drawRectangleImages = async function (posX,posY,indexId) {
        const hght = 150;
        const wdth = 150;

        const canvasFinal = document.createElement("canvas");
        canvasFinal.width = wdth;
        canvasFinal.height = hght;
        const contextFinal = canvasFinal.getContext('2d');
        // Draw the generated image with differences on the canvas
        // var image = document.getElementById('imagenCamera2');
        var image = document.getElementById(secondImage);

        const IMG_HEIGTH=150;
        const IMG_WIDTH=150;

        contextFinal.drawImage(
            // Image
            image,
            // ---- Selection ----
            // 264, // sx
            // 56, // sy
            posX,
            posY,
            IMG_WIDTH, // sWidth
            IMG_HEIGTH, // sHeight
            // ---- Drawing ----
            0, // dx
            0, // dy
            IMG_WIDTH, // dWidth
            IMG_HEIGTH // dHeight
        );
        canvasFinal.setAttribute('id',`cavasChild-${indexId}`)
        //con esto agregamos como child todas las imágenes al div como children
        // document.getElementById("result-container").appendChild(canvasFinal);
        let canvasURL = canvasFinal.toDataURL("image/jpeg",0.5)
        // const canvaElm = document.getElementById("resultCanvasRectangle")
        const canvaElm = document.createElement("img")
        canvaElm.setAttribute('id',`imgChild-${indexId}`)
        canvaElm.setAttribute('width','400px')
        canvaElm.setAttribute('height','200px')
        canvaElm.setAttribute('src',canvasURL)
        document.getElementById("result-container").appendChild(canvaElm);
        return canvaElm;
    }

    const removeChilds = async function () {
        for(var i=0;i<100;i++) {
            document.getElementById(`imgChild-${i}`).remove();
        }

    }



    return <>
        <div style={{display:'flex'}}>
            <div id="captureInitialImageId" style={{backgroundColor:'yellow', paddingTop:'1em'}} title="InitialImg">
            <button id="btnUntrained" onClick={() => captureInitialImage(initialImage)}>Capture Initial Image</button>
            <img src="" id={initialImage} width="400px" height="200px"/>
            </div>

            <div id="captureSecondImageId" style={{backgroundColor:'#66CFFF', paddingTop:'1em'}} title="SecondImg">
                <button id="btnUntrained" onClick={() => captureInitialImage(secondImage)}>Capture Second Image</button>
                <img src="" id={secondImage} width="400px" height="200px"/>
            </div>
        </div>
        <div id="differencesId" style={{backgroundColor:'#66C333', paddingTop:'1em'}} title="DifferencesImg">
            <span>DIFERENCIAS</span>
            <button id="btnUntrained" onClick={() => comparePixelMatch(initialImage,secondImage)}>Watch differences</button>
            <br />
            <img src="" id="resultCanvas" width="400px" height="200px"/>
        </div>
        <div id="areaDifferencesId" style={{backgroundColor:'#9999FF', paddingTop:'1em'}} title="drawPicesOfImage">
            <button onClick={()=>selectArea() } >SelectArea</button>
            <br />
            <canvas id="canvas" width="400" height="200" style={{borderStyle: 'solid'}}></canvas>
        </div>
        <div>
            <button onClick={()=>kClustering() } >KClustering</button>
        </div>
        <div id="rectanglesImgId" style={{backgroundColor:'#faa74a', paddingTop:'1em'}} title="drawPicesOfImage">
            <button onClick={()=>drawRectangle() } >DrawRectangleImages</button>
            <button onClick={()=>removeChilds() } >REMOVE CHILDS</button>
            <br />
            <div id="result-container" style={{width:'400px',height:'200px'}}></div>
            <img src="" id="resultCanvasRectangle" width="100px" height="100px"/>
        </div>
    </>
}

export default RedLigth;