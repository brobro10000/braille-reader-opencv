let video = document.getElementById("videoInput"); // video is the id of video tag

var thresholdSelected = 0;
video.width = 640;
video.height = 480;
function changeThreshold(e){
  if(e.target.id){
    thresholdSelected = e.target.id.split('radio')[1]
  }
  return thresholdSelected
}
navigator.mediaDevices
.getUserMedia({ video: true, audio: false })
.then(function(stream) {
  var thresholdMethod = [cv.THRESH_OTSU,cv.THRESH_TRIANGLE,cv.THRESH_BINARY,cv.THRESH_BINARY_INV]
    video.srcObject = stream;
    video.play();
    
    var minVal = 0
    var maxVal = 255
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);

    let cap = new cv.VideoCapture(video);
    var min = document.getElementById('min')
    var max = document.getElementById('max')

    var minOutput = document.getElementById('minVal')
    var maxOutput = document.getElementById('maxVal')

    const FPS = 120;
    function processVideo() {
      minOutput.innerHTML = minVal
      maxOutput.innerHTML = maxVal

      min.oninput = function(){
        minVal =parseFloat(this.value)
        max.min = minVal
        minOutput.innerHTML = minVal
      }
      max.oninput = function(){
        maxVal = parseFloat(this.value)
        min.max = maxVal
        maxOutput.innerHTML = maxVal
      }
      try {
        // if (!streaming) {
          //   // clean and stop.
          //   src.delete();
          //   dst.delete();
          //   return;
          // }
          let begin = Date.now();
          // start processing.
          cap.read(src);
          let ksize = new cv.Size(5, 5);
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
          cv.GaussianBlur(dst, dst, ksize, 0, 0);
          cv.threshold(dst,dst,minVal,maxVal,thresholdMethod[thresholdSelected])
          // schedule the next one.
          cv.imshow("canvasOutput", dst);
        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
      } catch (err) {
        console.error(err);
      }
    }

    // schedule the first one.
    setTimeout(processVideo, 0);
  })
  .catch(function(err) {
    console.log("An error occurred! " + err);
  });

  
