

const ColorPicker=()=>{
    const img = new Image();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

        console.log("selectArea")
        // const image = document.getElementById("resultCanvas");
        // console.log(image)
        // document.getElementById("result-areaSelected").appendChild(image);
        // console.log(image)




        img.addEventListener('load', () => {
            ctx.drawImage(img, 0, 0);
            img.style.display = 'none';
        });


    const hoveredColor = document.getElementById('hovered-color');
    const selectedColor = document.getElementById('selected-color');


    function pick(event, destination) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;
        if(ctx){
            const pixel = ctx.getImageData(x, y, 1, 1);
            const data = pixel.data;

            const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
            destination.style.background = rgba;
            destination.textContent = rgba;

            return rgba;
        }
        else{
            return null;
        }
    }

    canvas.addEventListener('mousemove', event => pick(event, hoveredColor));
    canvas.addEventListener('click', event => pick(event, selectedColor));

    return <div>
        <canvas id="canvas" width="400" height="200"></canvas>
    </div>
}
export default ColorPicker;