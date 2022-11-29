import imagediff from "imagediff";
import Webcam from "react-webcam";
import {useCallback, useRef, useState} from "react";
import pixelmatch from "pixelmatch";
import * as fs from "fs";
var webcam;
const webcamElement = document.getElementById('webcam');

const PNG = require('pngjs').PNG;

const dataImage=[]
const toUint8Array = require('base64-to-uint8array')

const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow-models/mobilenet');
const knnClassifier = require('@tensorflow-models/knn-classifier');
//******TENSORFLOW-libs*********///

const classifier = knnClassifier.create();
var net;
/////*******************////
const Image = () => {
// Create a variable from the first image

    const [dataResultChanges,setDataResultChanges] = useState([]);
    /**
     * Callback that should be executed when the images are finally loaded.
     *
     **/
    const onImagesLoaded = async function  (img1,img2) {
        console.log("Cargando modelo de identificacion de imagenes");
        net= await mobilenet.load();

        // const ImageA = document.getElementById("imageA");
        const ImageA = document.getElementById(img1);

        // Create a variable from the second image
        const ImageB = document.getElementById(img2);

        // let loadedImages = 1;


        // Increment the images loaded flag

        // loadedImages++;

        // Skip execution of the callback if the 2 images have been not loaded
        // Otherwise continue with the diff
        // console.log("asdfasdf",ImageA)
        // if (loadedImages !== 2) {
        //     return;
        // }
        if (ImageA && ImageB !== null) {
            // Create the image that shows the difference between the images
            const diff = imagediff.diff(ImageA, ImageB, 0);
            // const diff = imagediff.noConflict(ImageA, ImageB, 0);
            console.log("diff", diff)
            // Create a canvas with the imagediff method (with the size of the generated image)
            const canvas = imagediff.createCanvas(diff.width, diff.height);
            console.log("createCanvas", canvas)
            // Retrieve the 2d context
            const context = canvas.getContext('2d');
            // Draw the generated image with differences on the canvas
            context.putImageData(diff, 0, 0);
            // context.drawImage(diff, 0, 0);
            console.log("canvas2", canvas)
            // Add the canvas element to the div element to show
            document.getElementById("result-container").appendChild(canvas);
            // Display some alert !
            // alert("Done!");

            // ImageA.addEventListener("load", onImagesLoaded, false);
            // ImageB.addEventListener("load", onImagesLoaded, false);
            // console.log(resultA)

            // other wise
            // const myCanvas = document.getElementById('my-canvas');
            // const myContext = myCanvas.getContext('2d');
            // myContext.drawImage(canvas, 0, 0);
            // const mario = new Image();
            // mario.src = './mario.png';
            // mario.onload = () => {
            //     ctx.drawImage(     // Image     mario,     // ---- Selection ----     0, // sx     MARIO_HEIGHT * 2, // sy     MARIO_WIDTH, // sWidth     MARIO_HEIGHT, // sHeight     // ---- Drawing ----     0, // dx     0, // dy    MARIO_WIDTH, // dWidth     MARIO_HEIGHT // dHeight   ); };
            }
    };


    const webcamRef = useRef(null);
    const refContainer = useRef(null);
    let imageCamera1;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const capture =(imgId)=> useCallback(
        () => {
            const container = refContainer.current;
            const imageSrc = webcamRef.current.getScreenshot();
            // console.log("imagenCamtured",imageSrc)
            imageCamera1=imageSrc;
            // const img = document.createElement('img');
            if(imgId==='both'){
                const img1 = document.getElementById('imagenCamera1');
                const img2 = document.getElementById('imagenCamera2');
                // img.setAttribute('src', imageSrc);
                img1.setAttribute('src', imageSrc);
                img2.setAttribute('src', imageSrc);
            }else{
                const img2 = document.getElementById(imgId);
                // img.setAttribute('src', imageSrc);
                img2.setAttribute('src', imageSrc);
                // container.appendChild(img);
                const obj=new Object();
                obj.id=imgId;
                obj.data=imageSrc;
                dataImage.push(obj);
            }
        },
        [webcamRef]
    );
    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user"
    };


    const comparePixelMatch = async function (img1, img2) {
        console.log("comparPixelMatch")
        const ImageA = document.getElementById(img1);
        // Create a variable from the second image
        const ImageB = document.getElementById(img2);

        const {width, height} = ImageA;
        const diff = new PNG({width, height});
        console.log(dataImage)
        let immmX;
        let immmY;
        // await base64ToFile(dataImage[0].data, 'test')

        // console.log(dataImage[0].data)
        const arr1 = dataImage[0].data.split(',');
        const database64 = arr1[0].match(/:(.*?);/)[1];
        const arr = toUint8Array(database64)
        // console.log("arr",arr)
        const arr5 = dataImage[0].data.split(',');
        const database645 = arr5[0].match(/:(.*?);/)[1];
        const arr6 = toUint8Array(database645)
        console.log("arr",arr,"arr6",arr6)
        await _base64ToArrayBuffer(dataImage[0].data)
            .then(res=>{
                immmX=res.result;
                console.log("completed1")
            })

        var reader = new FileReader();
        // await base64ToFile(dataImage[1].data, 'test2')
        await _base64ToArrayBuffer(dataImage[1].data)
            .then(res=>{
                immmY= res.result
                console.log("completed2",res)
            })

        console.log(immmX, immmY)

        // const numDiffPixels = pixelmatch(ImageA, ImageB, diff, 800, 600, {threshold: 0.1});
        // const numDiffPixels = pixelmatch(dataImage[0].data, dataImage[1].data, diff, 800, 600, {threshold: 0.1});
        // const numDiffPixels = pixelmatch(arr, arr6, diff, 800, 600, {threshold: 0.1});
        // console.log(numDiffPixels)


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
            imgDataOutput.data, wdth, hght, {threshold: 0.1,alpha:0,diffColor:[255, 2, 0, 1]});


        // const canvasFinal =  document.createElement(numDiffPixels.width, numDiffPixels.height);
        const canvasFinal = document.createElement("canvas");
        canvasFinal.width = wdth;
        canvasFinal.height = hght;
        console.log( wdth*hght,"Porcentaje Modificado:"+ (numDiffPixels*100)/(wdth*hght) )
        console.log("createCanvas", canvasFinal)
        console.log("numDiffPixels", numDiffPixels)
        // Retrieve the 2d context
        console.log("imgDataOutput", imgDataOutput)

        const contextFinal = canvasFinal.getContext('2d');
        // Draw the generated image with differences on the canvas
        contextFinal.putImageData(imgDataOutput, 0, 0);
        // contextFinal.drawImage(numDiffPixels, 0, 0);
        console.log("canvas2", canvasFinal)
        // Add the canvas element to the div element to show
        // document.getElementById("result-container").appendChild(canvasFinal);
        let canvasURL = canvasFinal.toDataURL("image/jpeg",0.5)
        const canvaElm = document.getElementById("resultCanvas")
        canvaElm.setAttribute('src',canvasURL)



        ///////////////////////////////
        //Lets try to draw a rectangle based on color R,G,B   [255, 255, 0]
        //We will start to drawing a rectangle

    }




    function convertImageToCanvas(imageID) {
        var image = document.getElementById(imageID);
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        canvas.getContext("2d").drawImage(image, 0, 0);
        // image.style = "width: 400px";
        return canvas;
    }

    function convertImageToCanvasXY(imageID,x,y) {
        var image = document.getElementById(imageID);
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        canvas.getContext("2d").drawImage(image, x, y);
        // image.style = "width: 400px";
        return canvas;
    }

    async function base64ToFile(dataURL, fileName) {
        const arr = dataURL.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        return (fetch(dataURL)
            .then(function (result) {
                return result.arrayBuffer();
            }));
    }


    function _base64ToArrayBufferxx(base64) {
        const arr = base64.split(',');
        base64 = arr[0].match(/:(.*?);/)[1];
        return Uint8Array.from(window.atob(base64), (v) => v.charCodeAt(0));
    }

        async function _base64ToArrayBuffer(base64) {
        const arr = base64.split(',');
        base64 = arr[0].match(/:(.*?);/)[1];
        var binary_string = base64;
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
////////////////////////////////////////////////////////////
//     const img = new Image();
//     const canvas = document.getElementById('canvas');
    let canvas;

    let ctx;
    const selectArea = async function () {
        console.log("selectArea")
        const image = document.getElementById("resultCanvas");
        // console.log(image)
        // document.getElementById("result-areaSelected").appendChild(image);
        // console.log(image)
        // const img = new Image();
         canvas = document.getElementById('canvas');
        // img.crossOrigin = 'anonymous';
        // img.src = './assets/rhino.jpg';
         ctx = canvas.getContext('2d');
        // img.addEventListener('load', () => {
        var cnvBefore = convertImageToCanvas("resultCanvas");
            ctx.drawImage(cnvBefore, 0, 0);
            // img.style.display = 'none';
        // });
        // canvas.addEventListener('mousemove', event => pick(event, hoveredColor));
        canvas.addEventListener('click', event => pick(event, selectedColor));

        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var pixels = imageData.data;
        var numPixels = imageData.width * imageData.height;

        // const rgbaDefault = `rgba(${147}, ${141}, ${170}, ${1})`;
        const rgbaDefault = `rgba(${255}, ${255}, ${255}, ${1})`;
        // const rgbaDefault = `rgba(${255}, ${2}, ${0}, ${1})`;
        const rgbaDefaultArray = [255, 2, 0, 1];
        // for (var i = 0; i < numPixels; i++) {
        //     // const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        //     // const rgba = `rgba(${pixels[i*4]}, ${pixels[i*4+1]}, ${pixels[i*4+2]}, ${pixels[i*4+3] / 255})`;
        //     let rgba = {r:0,g:0,b:0};
        //     rgba.r += pixels[i];
        //     rgba.g += pixels[i+1];
        //     rgba.b += pixels[i+2];
        //
        //     // if(rgba===rgbaDefault){
        //     if( rgba!==rgbaDefault) {
        //         console.log(rgba)
        //         const bounding = canvas.getBoundingClientRect();
        //
        //         const x = pixel.clientX - bounding.left;
        //         const y = pixel.clientY - bounding.top;
        //         console.log("detectedPlace", pixels[i],bounding,x,y)
        //     }
        //     // console.log(rgba)
        //     // console.log(pixels[i*4])
        // };


        // const rgbaDefault = `rgba(${147}, ${141}, ${170}, ${1})`;
        for(var j=0; j<imageData.width; j++){
            for(var k=0; k<imageData.height; k++){
                const bounding = canvas.getBoundingClientRect();
                // const xi = j - bounding.left;
                // const yi = k - bounding.top;
                const x=j;
                const y=k;
                const imageByPixel = ctx.getImageData(x, y, 1, 1);
                // const imageByPixel = ctx.getImageData(k, j, 1, 1);
                const data = imageByPixel.data;
                const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;

                const a = JSON.stringify(Array.from(data));
                const b = JSON.stringify(Array.from(rgbaDefaultArray));

                // console.log(rgba)
                if (rgba !== rgbaDefault) {
                // if (a === b) {
                    // console.log("detectedPlace",j,k,x,y)
                    // console.log("shouldbeRED")
                    // console.log("detectedPlace",x,y)
                    // console.log("rgba",rgba)
                    dataResultChanges.push({position: {x: x, y: y}, color: rgba})
                }
            }
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(imageData, 0, 0);
    }


    const hoveredColor = document.getElementById('hovered-color');
    const selectedColor = document.getElementById('selected-color');


    function pick(event, destination) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;
        // console.log(x,event.clientX,bounding.left)
        // console.log(y,event.clientY,bounding.top)
        const pixel = ctx.getImageData(x, y, 1, 1);
        const data = pixel.data;

        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        // destination.style.background = rgba;
        document.getElementById('hovered-color').style.background = rgba;
        document.getElementById('selected-color').style.background = rgba;
        console.log(rgba)
        document.getElementById('hovered-color').textContent = rgba+'  ['+x+','+y+']';
        document.getElementById('selected-color').textContent = rgba+'  ['+x+','+y+']';


        return rgba;
    }


    const drawRectangle = async function (){
        // console.log("data",dataResultChanges)
        for(var i=0;i<10;i++){
            const rndObject = dataResultChanges[Math.floor(Math.random() * dataResultChanges.length)];
            drawRectangleImages(rndObject.position.x,rndObject.position.y,net)
            console.log(rndObject.position.x,rndObject.position.y)
        }

    }

    const drawRectangleImages = async function (posX,posY) {
        var cnvBefore = convertImageToCanvas("imagenCamera2");
        var ctxBefore = cnvBefore.getContext("2d");
        // var imageData = ctx2.getImageData(159, 143, 200, 200);
        // var imageData = ctx2.getImageData(259, 165, 200, 200);
        // var imageData = ctx2.getImageData(277, 169, 200, 200);
        // var imageData = ctx2.getImageData(264, 56, 200, 200);
        ///////////
        // let imgDataBefore = ctxBefore.getImageData(259,165,150, 150);

        const hght = 100;
        const wdth = 100;

        // var imgDataOutput = new ImageData(100, 100);
        //     imgDataOutput=imgDataBefore;

        // const canvasFinal =  document.createElement(numDiffPixels.width, numDiffPixels.height);
        const canvasFinal = document.createElement("canvas");
        canvasFinal.addEventListener('click', event => pick(event, selectedColor));
        canvasFinal.width = wdth;
        canvasFinal.height = hght;
        const contextFinal = canvasFinal.getContext('2d');
        // Draw the generated image with differences on the canvas
        // contextFinal.putImageData(imgDataOutput, 0, 0);

        var image = document.getElementById('imagenCamera2');
        // const IMG_HEIGTH=image.height;
        // const IMG_WIDTH=image.width;
        const IMG_HEIGTH=100;
        const IMG_WIDTH=100;

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

        //con esto agregamos como child todas las imágenes al div como children
        // document.getElementById("result-container").appendChild(canvasFinal);
        let canvasURL = canvasFinal.toDataURL("image/jpeg",0.5)
        const canvaElm = document.getElementById("resultCanvasRectangle")
        canvaElm.setAttribute('src',canvasURL)

        //AGREGAMOS EL RECONOCIMIENTO DE IMAGENES CON TENSORFLOW
        const imgEl = document.getElementById("resultCanvasRectangle")
        const result = await net.classify(imgEl);
        console.log(result);
    }

    async function identifyImage(imgInput){
        const img = imgInput

        const result = await net.classify(img);
        const activation = net.infer(img, 'conv_preds');
        var result2;
        try {
            result2 = await classifier.predictClass(activation);
        } catch (error) {
            result2 = {};
        }

        const classes = ["Untrained", "Carla", "Nelson" , "Dino", "OK","Rock"]

        document.getElementById('console').innerText = `
      prediction: ${result[0].className}\n
      probability: ${result[0].probability}
    `;

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
    }

    const classes = ["Untrained", "Carla", "Nelson" , "Dino", "OK","Rock"]
    var webcam;
    //add example
    async function addExample (classId) {
        net= await mobilenet.load();
        // const img = await webcam.capture();
        // const img = webcamRef.current.getScreenshot();
        const img=convertImageToCanvas('imagenCamera1')

        // const img = document.getElementById('imagenCamera1')
        const activation = net.infer(img, true);
        classifier.addExample(activation, classId);
        //liberamos el tensor
        // img.dispose()
    }

////////////////////////////////////////////////////////////
// console.log(imageSrc1)
    return (

        <div>
            <button id="clase-b" onClick={()=>addExample(2)}>Nelson</button>
            <div id="console2"></div>
            <div id="loadContainer">
                {/*<img  id="imageA" src="/src/app/img/example_a.png"/>*/}
                {/*<img  id="imageA" src="/imgPublic/example_a.png" width="400px" height="400px"/>*/}
                <img  id="imageA" src="/imgPublic/imgA.png" width="200px" height="200px"/>
                {/*<img  id="imageA2" src="/imgPublic/sample2.jpg"/>*/}
                {/*<img src="/src/app/img/example_b.png" id="imageB" alt="img2"/>*/}
                {/*<img src="/imgPublic/example_b.png" id="imageB" alt="img2" width="400px" height="400px"/>*/}
                {/*<img src="/imgPublic/logo512.png" id="imageB" alt="img2" width="400px" height="400px"/>*/}
                {/*<img src="/imgPublic/example_bCopia.png" id="imageB" alt="img2" width="400px" height="400px"/>*/}
                <img src="/imgPublic/imgB.png" id="imageB" alt="img2" width="200px" height="200px"/>
                <img src="" id="imagenCamera1" width="400px" height="200px"/>
                <img src="" id="imagenCamera2" width="400px" height="200px"/>
            </div>

            <Webcam
                audio={false}
                height={200}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={400}
                videoConstraints={videoConstraints}
            />
            <button onClick={capture('imagenCamera1')}>Capture photo 1</button>
            <button onClick={capture('imagenCamera2')}>Capture photo 2</button>
            <button onClick={capture('both')}>CaptureBoth</button>

            <div>
                {/*<button onClick={()=>capture1(1) } >Capture Imagen1</button>*/}
                {/*<button onClick={()=>capture2() } >Capture Imagen2</button>*/}
            </div>
            <button onClick={()=>onImagesLoaded('imageA','imageB') } >Evaluate Imagen 1</button>
            <button onClick={()=>onImagesLoaded('imagenCamera1','imagenCamera2') } >Evaluate Imagen 2</button>
            <button onClick={()=>comparePixelMatch('imageA','imageB') } >Evaluate Imagen PIXELMATCH</button>
            <button onClick={()=>comparePixelMatch('imagenCamera1','imagenCamera2') } >Evaluate Imagen PIXELMATCH Camm</button>
            <button onClick={()=>selectArea() } >SelectArea</button>
            <button onClick={()=>drawRectangle() } >DrawRectangle</button>

            <div id="result-container" style={{width:'400px',height:'200px'}}></div>
            <br />
            <div id="result-areaSelected" style={{width:'400px',height:'200px',borderStyle: 'solid'}}>

                <img src="" id="resultCanvas" width="400px" height="200px"/>
                <canvas id="canvas" width="400" height="200" style={{borderStyle: 'solid'}}></canvas>
                <div>ColorPicked
                    <div id="selected-color" style={{border:1,width:'100px', heigth:'100px'}} >xx</div>
                    <div id="hovered-color"  style={{border:1,width:'100px', heigth:'100px'}}  >tt</div>
                </div>
                <canvas id="canvas22" width="400" height="200" style={{borderStyle: 'solid'}}></canvas>
                <img src="" id="resultCanvasRectangle" width="100px" height="100px"/>
            </div>
            <div
                id="divImgSvgId2"
                ref={refContainer}
                className="image-icon"
            />

        </div>

    );
}

export default Image;
