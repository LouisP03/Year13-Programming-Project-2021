//chosen canvas dimensions
canvas_width = 750;
canvas_height = 525;

//value of brush width set to defaut value of slider
bwidth = document.getElementById("brush-width").value;

//currentColour set to current default colour selected on page load
var redvalue = document.getElementById('redSlider').value;
var greenvalue = document.getElementById('greenSlider').value;
var bluevalue = document.getElementById('blueSlider').value;

currentColour = {
    R: String(redvalue),
    G: String(greenvalue),
    B: String(bluevalue)
};

chosenName = "Louis";

//dropperStatus set to false on page load
dropperStatus = false;

class Queue {
    constructor() {
        this.queue = [];
    }

    enqueue(item) {
        this.queue[this.queue.length] = item;
    }

    dequeue() {
        return this.queue.shift();
    }

    peek() {
        return this.queue[0];
    }

    get length() {
        return this.queue.length;
    }

    value(index) {
        return this.queue[index];
    }

    clear() {
        this.queue = [];
    }
};

//objects instantiated from Queue class
pos1 = new Queue();
pos2 = new Queue();


//runs on page load
function setup() {

    //query selector selects based on class name, i.e., all three colour sliders
    const sliders = document.querySelectorAll('.colourSlider');
    //for each colour slider, get each one...
    sliders.forEach(slider => {
        //... and add an input event listener...
        slider.addEventListener("input", () => {
            //... which when triggered, retrieves the values from all three colour sliders
            var redvalue = document.getElementById('redSlider').value;
            var greenvalue = document.getElementById('greenSlider').value;
            var bluevalue = document.getElementById('blueSlider').value;

            //all three colour values updated in the global currentColour object.
            currentColour = {
                R: String(redvalue),
                G: String(greenvalue),
                B: String(bluevalue)
            };
            console.log("R: " + String(currentColour.R) + ", G: " + String(currentColour.G) + ", B: " + String(currentColour.B));
        });
    });

    //selects the brush width slider from the document, adds an event listening listening for
    //input event into the slider
    document.getElementById("brush-width").addEventListener("input", () => {
        //once an input into the slider is receives, bwidth is set to the new value of the slider,
        //i.e., the new brush width
        bwidth = document.getElementById("brush-width").value;
        console.log("Brush width: " + String(bwidth));
    });

    //creates a canvas with given dimensions using p5.js, setting parent element to the canvas-container
    var canvas = createCanvas(canvas_width, canvas_height);
    canvas.parent('canvas-container');
    background(211);

    //var socket = io.connect('https://compsci-project-2021.herokuapp.com/');
    socket = io.connect('https://compsci-project-2021.herokuapp.com/');
};

//this function is called when colour dropper is clicked (to select it)
//the function changes a flag between true and false as mousePressed() needs to be able to 
//determine if the colour dropper is selected
function toggleDropper() {
    //if false, set to true, change cursor to colour dropper image
    if (dropperStatus === false) {
        dropperStatus = true;
        document.body.style.cursor = "url('cursor_image.png'), auto";
    //this block of code should theoretically not run since when the colour dropper is used,
    //dropperStatus is set to false automatically 
    } else {// else if dropperStatus === true...
        dropperStatus = false;
        document.body.style.cursor = "auto";
    }
}

//called when a message is sent by clicking on button
function sendMessage() {
    //message retrieved by selecting the message text <input> and getting value
    var message = document.getElementById('messageEntry').value;
    
    //create JavaScript Object that will be sent to server
    var messageData = {
        msg: message,
        clientName: chosenName
        //room: roomID
    };

    //select the chat-dump container (where all messages will be located)
    var chatDump = document.getElementById('chat-dump');
    //create new message <div> container - containing just the text of the message
    var div = document.createElement('div');
    //give the new <div> a class of 'chat-message'
    div.classList.add('chat-message');
    //make the message bold
    div.fontWeight = 'bold';

    //if no client name given, set the text of the message to the messge
    //concatenated with a default username anonymous...
    if (messageData.clientName === "") {
        div.innerText = "Anonymous >> " + messageData.msg;
    } else {
        ///...otherwise, concatenate message with the chosen username
        div.innerText = messageData.clientName + " >> " + messageData.msg;
    }

    //make the new message div a child of the chat-dump container so it appears within
    chatDump.appendChild(div);
    //send the messageData to the server along with the event name so the server knows
    //how to handle it
    socket.emit('send-chat-message', messageData);
    //clear the message input box once message has been sent (which is when this function is called)
    document.getElementById('messageEntry').value = "";

};

//called when mouse dragged on canvas
function mouseDragged() {
    //data object that is sent to the server and added to Queue object
    var dragData = {
        x: mouseX,
        y: mouseY,
        px: pmouseX,
        py: pmouseY,
        brushWidth: bwidth,
        red: currentColour.R,
        green: currentColour.G,
        blue: currentColour.B
        //room: roomID
    };

    //sets the properties of the drawing about to take place to current selected properties
    strokeWeight(parseInt(dragData.brushWidth));
    stroke(parseInt(dragData.red), parseInt(dragData.green), parseInt(dragData.blue));

    //add data set to queue
    pos1.enqueue(dragData);

    //if queue length is 4 (i.e. there are enough vertices available to create a curve), create curve
    if (pos1.length === 4) {
        noFill();
        beginShape();
        curveVertex(pos.value(0).x, pos.value(0).y);
        curveVertex(pos.value(0).x, pos.value(0).y);
        curveVertex(pos.value(1).x, pos.value(1).y);
        curveVertex(pos.value(2).x, pos.value(2).y);
        curveVertex(pos.value(3).x, pos.value(3).y);
        curveVertex(pos.value(3).x, pos.value(3).y);
        endShape();

        //remove the oldest (uneeded) data set from the queue
        pos1.dequeue();
    }

    socket.emit('mouse-dragged', dragData);
}

function mousePressed() {
    //if position of mouse within canvas, perform function
    if (mouseX >= 0 && mouseX <= canvas_width) {
        if (mouseY >= 0 && mouseY <= canvas_height) {
            //data to send to server
            var clickData = {
                x: mouseX,
                y: mouseY,
                brushWidth: bwidth,
                red: currentColour.R,
                green: currentColour.G,
                blue: currentColour.B
                //room: roomID
            };
            //if dropper selected, get colour value at mouse position and update currentColour and colour indicators...
            if (dropperStatus === true) {
                var dropperColour = get(clickData.x, clickData.y);

                document.getElementById('redSlider').value = dropperColour[0];
                document.getElementById('greenSlider').value = dropperColour[1];
                document.getElementById('blueSlider').value = dropperColour[2];

                dropperStatus = false;

                currentColour = {
                    R: String(dropperColour[0]),
                    G: String(dropperColour[1]),
                    B: String(dropperColour[2])
                }

                var newBorderStyle = String(bwidth) + 'px solid rgb(' + currentColour.R + ', ' + currentColour.G + ', ' + currentColour.B + ')';
                document.getElementById('sub-container').style['border-left'] = newBorderStyle;
                document.getElementById('sub-container').style['border-right'] = newBorderStyle;

                document.body.style.cursor = 'auto';
            } else {
                //... otherwise, if colour dropper not selected, draw a circle at the mouse position with selected width and colour
                noStroke();
                fill(clickData.red, clickData.green, clickData.blue);
                ellipse(clickData.x, clickData.y, clickData.brushWidth, clickData.brushWidth);
                //emit this event to server
                socket.emit('mouse-clicked', clickData);
            }
        };
    };
};