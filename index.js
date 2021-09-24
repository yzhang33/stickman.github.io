const videoElement = document.getElementsByClassName('input_video')[0];
videoElement.style.display = 'none';
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
//const grid = new LandmarkGrid(landmarkContainer);

function onResults(results) {
  if (!results.poseLandmarks) {
    //grid.updateLandmarks([]);
    return;
  }

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  //canvasCtx.drawImage(results.segmentationMask, 0, 0,
   //                   canvasElement.width, canvasElement.height);

  // Only overwrite existing pixels.
  canvasCtx.globalCompositeOperation = 'source-in';
  canvasCtx.fillStyle = '#00FF00';
  canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Only overwrite missing pixels.
  canvasCtx.globalCompositeOperation = 'destination-atop';
  // canvasCtx.drawImage(
  //       results.image, 0, 0, canvasElement.width, canvasElement.height);

  //console.log(results.poseLandmarks);

  var landmarks = results.poseLandmarks;
  
  for(var i=0;i<landmarks.length;i++){
    //calculate mid points
    canvasCtx.beginPath();
    drawHead(landmarks[0].x*1280,landmarks[0].y*720);
    var mid = [(landmarks[12].x+landmarks[11].x) / 2.0, (landmarks[12].y+landmarks[11].y) / 2.0]
    //left arm
    drawLine(landmarks[0].x*1280,landmarks[0].y*720+55,mid[0]*1280,mid[1]*720);
    drawLine(mid[0]*1280,mid[1]*720, landmarks[14].x*1280,landmarks[14].y*720);
    drawLine(landmarks[14].x*1280,landmarks[14].y*720,landmarks[18].x*1280,landmarks[18].y*720);
    //right arm
    drawLine(mid[0]*1280,mid[1]*720, landmarks[13].x*1280,landmarks[13].y*720);
    drawLine(landmarks[13].x*1280,landmarks[13].y*720,landmarks[17].x*1280,landmarks[17].y*720);
    var mid2 = [(landmarks[24].x+landmarks[23].x) / 2.0, (landmarks[24].y+landmarks[23].y) / 2.0]
    //lower body
    drawLine(mid[0]*1280,mid[1]*720, mid2[0]*1280,mid2[1]*720);
    drawLine(mid2[0]*1280,mid2[1]*720, landmarks[26].x*1280,landmarks[26].y*720);
    drawLine(mid2[0]*1280,mid2[1]*720, landmarks[25].x*1280,landmarks[25].y*720);
    drawLine(landmarks[25].x*1280,landmarks[25].y*720,landmarks[27].x*1280,landmarks[27].y*720);
    drawLine(landmarks[26].x*1280,landmarks[26].y*720,landmarks[28].x*1280,landmarks[28].y*720);
    //canvasCtx.closePath();

  }
  canvasCtx.globalCompositeOperation = 'source-over';
  // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
  //                {color: '#00FF00', lineWidth: 4});
  // drawLandmarks(canvasCtx, results.poseLandmarks,
  //               {color: '#FF0000', lineWidth: 2});
  canvasCtx.restore();
  //grid.updateLandmarks(results.poseWorldLandmarks);
}

const drawHead = (x,y)=>{
  canvasCtx.arc(parseInt(x), parseInt(y), 60, 0, Math.PI * 2);
  canvasCtx.fillStyle = "black";
  canvasCtx.fill();
  canvasCtx.font="100px Arial";
  canvasCtx.fillText("hello",200,300)
  
}

const drawLine = (x1,y1,x2,y2) =>{
  canvasCtx.lineWidth = 10;
  canvasCtx.moveTo(x1, y1);    // Move the pen to (30, 50)
  canvasCtx.lineTo(x2, y2);  // Draw a line to (150, 100)
  canvasCtx.stroke();
}

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: true,
  smoothSegmentation: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

pose.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 1280,
  height: 720
});

camera.start();