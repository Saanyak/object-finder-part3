status = "";
input_text = "";
objects = [];

function setup() {
    canvas = createCanvas(400,390);
    canvas.position(600,300);
    video = createCapture(VIDEO);
    video.size(400,390);
    video.hide();
}

function start() {
    object_detector = ml5.objectDetector("cocossd",modelLoaded);
    document.getElementById("status").innerHTML = "Status : Detecting Objects";
    input_text = document.getElementById("input_id").value;
}

function modelLoaded() {
    console.log("Model Loaded");
    status = true;
}

function draw() {
    image(video,0,0,400,390);
    if(status != "") {
        object_detector.detect(video,gotResults);
        for(i = 0; i < objects.length; i++) {
            document.getElementById("status").innerHTML = "Status : Objects Detected";
            console.log(objects.length);
            fill("#2668c9");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%",objects[i].x + 15,objects[i].y + 15);
            noFill();
            stroke("#2668c9");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if(objects[i].label == input_text) {
                video.stop();
                object_detector.detect(gotResults);
                document.getElementById("object_found").innerHTML = input_text+" Found";
                var synth = window.speechSynthesis;
                var utterThis = new SpeechSynthesisUtterance(input_text+"found");
                synth.speak(utterThis);
            }
            else {
                document.getElementById("object_found").innerHTML = input_text+" Not Found"
            }
        }
    }
}

function gotResults(error,results) {
    if(error){
        console.error(error);
    }
    else{
        console.log(results);
        objects = results;
    }
}