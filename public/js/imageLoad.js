async function onOpenCvReady() {
  var element = document.getElementById('navInner')
  element.innerHTML = `
  <a class="navbar-brand" href="#">
    <img src="./images/opencv.svg" alt="" width="60" height="48" class="align-text-center">
    OpenCV.js - Braille Reader
  </a>
  OpenCV.js Loaded
`

}
let video = document.getElementById("videoInput"); 
var clickCount = 0;
var thresholdSelected = 0;
var filterSelected = 0;
var flag = 0;
video.width = 640;
video.height = 480;
var index = {}
// var filters = ['grayscale', 'gaussianblur', 'threshold', 'cannyedge']
function changeThreshold(e) {
  if (e.target.id) {
    thresholdSelected = e.target.id.split('radio')[1]
  }
  var min = document.getElementById('min')
  var max = document.getElementById('max')
  if (thresholdSelected == "1" || thresholdSelected == "0") {
    min.setAttribute('disabled', '')
    max.setAttribute('disabled', '')
  } else {
    min.removeAttribute('disabled')
    max.removeAttribute('disabled')
  }
  return thresholdSelected
}
function addFilter(e) {
  if (e.target.innerHTML) {
    filterSelected = e.target.innerHTML
    filterSelected = filterSelected.replace(' ', '').toLowerCase()
    if (index[filterSelected]) {
      delete index[filterSelected]
    } else
      index[filterSelected] = 1
  }
  return filterSelected
}


navigator.mediaDevices
  .getUserMedia({ video: true, audio: false })
  .then(function (stream) {
    var thresholdMethod = [cv.THRESH_OTSU, cv.THRESH_TRIANGLE, cv.THRESH_BINARY, cv.THRESH_BINARY_INV]
    video.srcObject = stream;
    video.play();

    var minVal = 0
    var maxVal = 255
    var minValH = 0
    var maxValH = 1000

    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    // let fgbg = new cv.BackgroundSubtractorMOG2(500, 25, false);
    let cap = new cv.VideoCapture(video);
    var min = document.getElementById('min')
    var max = document.getElementById('max')
    var minOutput = document.getElementById('minVal')
    var maxOutput = document.getElementById('maxVal')
    let imgElement = document.getElementById('imageSrc');
    let inputElement = document.getElementById('fileInput');

    var minH = document.getElementById('minH')
    var maxH = document.getElementById('maxH')
    var minHOutput = document.getElementById('minValH')
    var maxHOutput = document.getElementById('maxValH')

    var toggleThreshold = document.getElementById('btncheck2')
    var toggleCannyEdge = document.getElementById('btncheck3')

    inputElement.addEventListener('change', (e) => {
      imgElement.src = URL.createObjectURL(e.target.files[0]);
    }, false);

    let templ = cv.imread('imageSrc')
    // let mask = new cv.Mat();
    // cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF, mask);
    const FPS = 15;
    function processVideo() {
      // let templ = cv.imread('imageSrc')
      minOutput.innerHTML = minVal
      maxOutput.innerHTML = maxVal

      minHOutput.innerHTML = minValH
      maxHOutput.innerHTML = maxValH

      min.oninput = function () {
        minVal = parseFloat(this.value)
        max.min = minVal
        minOutput.innerHTML = minVal
      }
      max.oninput = function () {
        maxVal = parseFloat(this.value)
        min.max = maxVal
        maxOutput.innerHTML = maxVal
      }

      minH.oninput = function () {
        minValH = parseFloat(this.value)
        maxH.min = minValH
        minHOutput.innerHTML = minValH
      }
      maxH.oninput = function () {
        maxValH = parseFloat(this.value)
        minH.max = maxValH
        maxHOutput.innerHTML = maxValH
      }


      let video = document.getElementById('videoInput');
      let cap = new cv.VideoCapture(video);

      // let src = cv.imread('imageCanvasInput');
      let templ = cv.imread('imageSrc');
      // let dst = new cv.Mat();
      // cv.matchTemplate(src, templ, dst, cv.TM_CCOEFF, mask);
      // let result = cv.minMaxLoc(dst, mask);
      // let maxPoint = result.maxLoc;
      // let color = new cv.Scalar(255, 0, 0, 255);
      // let point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows);
      // cv.rectangle(src, maxPoint, point, color, 2, cv.LINE_8, 0);
      // cv.imshow('canvasOutput', src);
      // src.delete(); dst.delete(); mask.delete();


      try {
        if (!stream) {
          // clean and stop.
          src.delete();
          dst.delete();
          return;
        }
        let begin = Date.now();
        // start processing.
        cap.read(src);

        cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY,0);
        // let ksize = new cv.Size(3, 3);
        // cv.GaussianBlur(dst, dst, ksize, 0, 0);

        if (index.threshold) {
          cv.threshold(dst, dst, minVal, maxVal, thresholdMethod[thresholdSelected])
          toggleCannyEdge.setAttribute('disabled', '')
          delete index.cannyedge
        } else {
          toggleCannyEdge.removeAttribute('disabled')
        }
        if (index.cannyedge) {
          cv.Canny(dst, dst, minValH, maxValH, 3, true);
          toggleThreshold.setAttribute('disabled', '')

          delete index.threshold
        } else {
          toggleThreshold.removeAttribute('disabled')
        }
        // fsbg.apply(dst,dst)
        // schedule the next one.

        cv.imshow("canvasOutput", dst);

        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
      } 
      catch (err) {
        console.error(err);
      }
    }

    // schedule the first one.
    setTimeout(processVideo, 0);
  })
  .catch(function (err) {
    console.log("An error occurred! " + err);
  });


