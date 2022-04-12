const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth-60;
canvas.height = 400;

let start_background_color = "white";
let context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0,0,canvas.width,canvas.height);

let draw_color = "black";
let draw_width = "2";
let is_drawing = false;

let free_draw = true;
let draw_line = false;
let draw_rect = false;
let draw_cir = false;

let restore_array = []
let index = -1

let X = 0;
let Y = 0;

function change_color(element){
    draw_color = element.style.background;
}

canvas.addEventListener("touchstart",start,false);
canvas.addEventListener("touchmove",draw,false);
canvas.addEventListener("mousedown",start,false);
canvas.addEventListener("mousemove",draw,false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);


function start(event){
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft,
        event.clientY - canvas.offsetTop);
    X = event.clientX;
    Y = event.clientY;
    draw(event);
    event.preventDefault();
}

function draw(event){
    if (!free_draw) return;
    if (is_drawing) {
        context.lineTo(event.clientX - canvas.offsetLeft,
            event.clientY - canvas.offsetTop);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
}

function stop(event){
    if (is_drawing){ 
        if (draw_line) {
            context.strokeStyle = draw_color;
            context.lineWidth = draw_width;
            context.lineTo(event.clientX - canvas.offsetLeft,
                event.clientY - canvas.offsetTop);
        }
        else if (draw_rect){
            let x = event.clientX;
            let y = event.clientY;
            let w = Math.abs(X-x);
            let h = Math.abs(Y-y);
            if (X > x) X = x;
            if (Y > y) Y = y;
            context.strokeStyle = draw_color;
            context.lineWidth = draw_width;
            context.strokeRect(X - canvas.offsetLeft,
                Y - canvas.offsetTop,
                w,h);

        }
        else if (draw_cir) {
            let x = event.clientX;
            let y = event.clientY;
            let r = Math.sqrt((X - x) * (X - x) + (Y - y) * (Y - y))
            context.strokeStyle = draw_color;
            context.lineWidth = draw_width;
            context.moveTo(X - canvas.offsetLeft + r,
                Y - canvas.offsetTop);
            context.arc(X - canvas.offsetLeft,
                Y - canvas.offsetTop, r, 0 ,2 * Math.PI);
        }
        context.stroke();
        context.closePath();
       
    }
    event.preventDefault();

    if (event.type != 'mouseout'){
        restore_array.push(context.getImageData(0,0,canvas.width,canvas.height));
        index += 1;
    }
    else {
        if (is_drawing) {
            restore_array.push(context.getImageData(0,0,canvas.width,canvas.height));
            index += 1;
        }
    }
    is_drawing = false;
}

function clear_canvas() {
    context.fillStyle = start_background_color;
    context.clearRect(0,0,canvas.width,canvas.height);
    context.fillRect(0,0,canvas.width,canvas.width);

    restore_array = [];
    index = -1;
}

function undo_last(){
    if (index <= 0) {
        clear_canvas();
    }else {
        index -= 1;
        restore_array.pop();
        context.putImageData(restore_array[index],0 ,0);
    }
}

function draw_Line() {
    free_draw = false;
    draw_line = true;
    draw_rect = false;
    draw_cir = false;
}

function FreeDraw() {
    free_draw = true;
    draw_line = false;
    draw_rect = false;
    draw_cir = false;
}

function draw_Rect(){
    draw_rect = true;
    free_draw = false;
    draw_line = false;
    draw_cir = false;
}

function draw_Circ() {
    draw_cir = true;
    draw_rect = false;
    free_draw = false;
    draw_line = false;
}

function saveAs(){
    var image = canvas.toDataURL("image/jpg")
    var a = document.getElementById("download")
    a.href = image
}