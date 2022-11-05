import imagediff from "imagediff";
import Webcam from "react-webcam";
import {useCallback, useRef} from "react";
import pixelmatch from "pixelmatch";
import * as fs from "fs";
var webcam;
const webcamElement = document.getElementById('webcam');

const PNG = require('pngjs').PNG;

const dataImage=[]
const toUint8Array = require('base64-to-uint8array')
const Image = () => {
// Create a variable from the first image

    /**
     * Callback that should be executed when the images are finally loaded.
     *
     **/
    const onImagesLoaded = function (img1,img2) {

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
            imgDataOutput.data, wdth, hght, {threshold: 0.1,alpha:1});


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
        document.getElementById("result-container").appendChild(canvasFinal);


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

////////////////////////////////////////////////////////////
// console.log(imageSrc1)
    return (
        <div>
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
                height={300}
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

            <div id="result-container" style={{width:'400px',height:'200px'}}></div>
            <br />

            <div
                id="divImgSvgId2"
                ref={refContainer}
                className="image-icon"
            />

        </div>

    );
}

export default Image;
