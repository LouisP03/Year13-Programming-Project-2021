//chosen canvas dimensions
canvas_width = 1000;
canvas_height = 700;

//value of brush width set to defaut value of slider
bwidth = document.getElementById("brush-width").value;

//currentColour set to current default colour selected on page load
var red = document.getElementById('red').value;
var green = document.getElementById('green').value;
var blue = document.getElementById('blue').value;

currentColour = {
    R: String(red),
    G: String(green),
    B: String(blue)
};


//runs on page load
function setup() {
    //dropperStatus set to false on page load
    dropperStatus = false;

    //query selector selects based on class name, i.e., all three colour sliders
    const elements = document.querySelectorAll('.colourSlider');
    //for each colour slider, get each one...
    sliders.forEach(slider => {
        //... and add an input event listener...
        slider.addEventListener("input", () => {
            //... which when triggered, retrieves the values from all three colour sliders
            var red = document.getElementById('red').value;
            var green = document.getElementById('green').value;
            var blue = document.getElementById('blue').value;

            //all three colour values updated in the global currentColour object.
            currentColour = {
                R: String(red),
                G: String(green),
                B: String(blue)
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
};

//this function is called when colour dropper is clicked (to select it)
//the function changes a flag between true and false as mousePressed() needs to be able to 
//determine if the colour dropper is selected
function toggleDropper() {
    //if false, set to true, change cursor to colour dropper image
    if (toggleDropper === false) {
        dropperStatus = true;
        document.body.style.cursor = "url('cursor-image.png'), auto";
        console.log("dropper status: " + String(dropperStatus));
    //this block of code should theoretically not run since when the colour dropper is used,
    //dropperStatus is set to false automatically 
    } else {// else if dropperStatus === true...
        dropperStatus = false;
        document.body.style.cursor = "auto";
    }
}

