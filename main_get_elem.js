//document.body.clientWidth ширина экрана
//getComputedStyle вычисленные стили
//  console.log('ScrollBarSvg width: ', getComputedStyle(svgchartid).width);

var wSize = {};
wSize.W = document.body.clientWidth;
wSize.H = window.innerHeight;
console.log(wSize);
window.addEventListener("resize", function getWindowSize() {
  wSize.W = document.body.clientWidth;
  wSize.H = window.innerHeight;
  console.log(wSize);
}, false);


document.getElementById('scrollBarSvg').setAttribute('y',"200"); //need to delete from here

var sWidth = 800;
var sHeight = 150;
var coln = 0
var axis = charts[coln].columns[0];
var y0Col = charts[coln].columns[1];
var y1Col = charts[coln].columns[2];

//-----------style and size dection
svgchartid.style.height = document.body.clientWidth / 2;
var sBarH = 100;

function f_getDate(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var time = months[a.getMonth()] + ' ' + a.getDate();
  return time;
}

axis.shift();
y0Col.shift();
y1Col.shift();

function getMaxArr(array){
  return Math.max.apply(Math, array);
};
function getMinArr(array){
  return Math.min.apply(Math, array);
};

function drawChartFromArray(xArr,yArr,sW,sH,chColor) {
  //var yShift = parseInt(getComputedStyle(cCtrlid).y,10) + 2; //shift for Y
  var xMin = getMinArr(xArr);
  var xMax = getMaxArr(xArr);
  var yMin = getMinArr(yArr);
  var yMax = getMaxArr(yArr);

  sH = parseInt(getComputedStyle(scrollBarSvg).height,10);
  console.log('sW: ',sW);
  console.log('sH: ',sH);
  var xK = (xMax - xMin) / sW; //коф. преобразования x
  //var yK = (yMax - yMin) / (sH-yShift*2); //коф. преобразования y

  //document.write("<p>"+ 'xMin= '+ xMin + ' xMax= ' + xMax + ' xK= ' + xK + " sW= " + document.body.clientWidth + "</p>");
  document.write("<p>"+ 'xMin= '+ xMin + ' xMax= ' + xMax +  " sW= " + document.body.clientWidth + "</p>");
  document.write("<p>"+ 'yMin= '+ yMin + ' yMax= ' + yMax  + "</p>");
  //document.write("<p>"+ 'yMin= '+ yMin + ' yMax= ' + yMax + ' yK= ' + yK + "</p>");
//x'[i] = x[i] - x[min] - приведение к новой системе координат svgView(к нулю)

//create path for chart
  var pathChart = 'M';
/*
  pathChart = pathChart + Math.ceil(((xArr[0]-xMin) / xK), 1) + ',';
  pathChart = pathChart + Math.ceil(sH-((yArr[0]-yMin) / yK) - yShift, 1); //разобраться с вычитанием
  for (var i = 1; (i < xArr.length) && (i < yArr.length); i++) {
    pathChart = pathChart + ' L' + ((xArr[i]-xMin) / xK) + ',';
    pathChart = pathChart + (sH-((yArr[i]-yMin) / yK) - yShift);
  }
*/

  pathChart = pathChart + (xArr[0]-xMin) + ',';
  pathChart = pathChart + (278-yArr[0]); //разобраться с вычитанием
  for (var i = 1; (i < xArr.length) && (i < yArr.length); i++) {
    pathChart = pathChart + ' L' + (xArr[i]-xMin) + ',';
    pathChart = pathChart + (278-yArr[i]);
  }

  /*crate chart*/
  var nChart = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  scrollBarSvg.appendChild(nChart);
  nChart.setAttribute('d',pathChart);
  nChart.setAttribute('stroke', chColor);
  nChart.setAttribute('stroke-width', '1');
  nChart.setAttribute('fill', 'transparent');
  nChart.setAttribute('vector-effect','non-scaling-stroke');
  nChart.setAttribute('id', 'col');
  document.write("<p>" + "Chart points: " + pathChart + "</p>");
}


function getCoords(elem) {
  var box = elem.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };

}


function drawSlider(lCtrlPos,rCtrlPos){
  ctrlW = parseInt(getComputedStyle(lCtrlid).width,10);//get control width
  document.getElementById('lCtrlid').setAttribute('x',lCtrlPos); //drawing left control
  document.getElementById('rCtrlid').setAttribute('x',rCtrlPos-ctrlW); //drawing right control
  //drawing border
  document.getElementById('slBrdId').setAttribute('x',lCtrlPos+ctrlW-1);
  document.getElementById('slBrdId').setAttribute('width',rCtrlPos-lCtrlPos-ctrlW*2+2);
  //drawing central control
  document.getElementById('cCtrlid').setAttribute('x',lCtrlPos+ctrlW);
  document.getElementById('cCtrlid').setAttribute('width',rCtrlPos-lCtrlPos-ctrlW*2);
  //--------------------//
  document.getElementById('lSlide').setAttribute('width',lCtrlPos); //drawing left slide
  //drawing right slide//
  document.getElementById('rSlide').setAttribute('x',rCtrlPos);
  document.getElementById('rSlide').setAttribute('width',parseInt(getComputedStyle(svgchartid).width,10)-rCtrlPos);
}

var lCpos = 200;
    rCpos = 450;

function lCtrlHandler(e) {
  console.log( 'Спасибо!' );

  var cntrlPlace = getCoords(lCtrlid);
  var shiftX = e.pageX;
  document.getElementById('col').setAttribute('d', 'M10 10' );

}
//drawSlider(lCpos,rCpos);
drawChartFromArray(axis,y0Col,document.body.clientWidth,sBarH,charts[coln].colors.y0);
//drawChartFromArray(axis,y1Col,document.body.clientWidth,sBarH,charts[coln].colors.y1);
// /document.getElementById('lCtrlid').addEventListener("click",lCtrlHandler);


console.log('ClientWidth: ',document.body.clientWidth);
console.log('InnerWidth: ',window.innerWidth);
console.log('InnerHeight: ',window.innerHeight);
