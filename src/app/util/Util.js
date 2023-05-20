export function convertImageToCanvas(imageID) {
    const image = document.getElementById(imageID);
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    canvas.getContext("2d").drawImage(image, 0, 0);
    // image.style = "width: 400px";
    return canvas;
}

export function convertImageToCanvasXY(imageID,x,y) {
    const image = document.getElementById(imageID);
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    canvas.getContext("2d").drawImage(image, x, y);
    // image.style = "width: 400px";
    return canvas;
}

// export async function base64ToFile(dataURL, fileName) {
//     const arr = dataURL.split(',');
//     const mime = arr[0].match(/:(.*?);/)[1];
//     return (fetch(dataURL)
//         .then(function (result) {
//             return result.arrayBuffer();
//         }));
// }


export function _base64ToArrayBufferxx(base64) {
    const arr = base64.split(',');
    base64 = arr[0].match(/:(.*?);/)[1];
    return Uint8Array.from(window.atob(base64), (v) => v.charCodeAt(0));
}

export async function _base64ToArrayBuffer(base64) {
    const arr = base64.split(',');
    base64 = arr[0].match(/:(.*?);/)[1];
    const binary_string = base64;
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}