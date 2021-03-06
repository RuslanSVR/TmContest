var wSize = {};
    wSize.W = document.body.clientWidth;
    wSize.H = window.innerHeight;
var portraitOrientation;
var chartBoardHeight;

//detects screen orientation
if (wSize.W < wSize.H) {
  portraitOrientation = true;
  chartBoardHeight = Math.round(wSize.W / 1.2);
}else {
  portraitOrientation = false;
  chartBoardHeight = Math.round(wSize.H / 1.2);
}

function getMaxArr(array){
  return Math.max.apply(Math, array);
};
function getMinArr(array){
  return Math.min.apply(Math, array);
};

function getPath(arrX,arrY){
  let minX = getMinArr(arrX.slice(1));
  let minY = getMinArr(arrY.slice(1));
  let maxY = getMaxArr(arrY.slice(1));
  console.log('Path-MinY:' + minY + ' Path-MaxY: ' + maxY);

chartPath = 'M' + ((arrX[1]-minX) / 100000) + ',' + (400-arrY[1]+minY);
for (let i = 2; (i < arrX.length) && (i < arrY.length); i++) {
  chartPath += ' L' + ((arrX[i]-minX) / 100000) + ',';
  chartPath += (400-arrY[i]+minY);
  //console.log('y[' + i + ']'+ (400-arrY[i]+minY));
}
return chartPath;
}

function drawPath(chart,elId){
  //console.log(chart.paths[1]);
  for (let i = 1; i < chart.paths.length; i++) {
      document.write("<path d=\"" + (chart.paths[i]) + "\" stroke=" + (chart.colors[chart.columns[i][0]]));
      document.write(" stroke-width=\"1\" fill=\"transparent\" vector-effect=\"non-scaling-stroke\"  ");
      document.write(" />");
  }
}

/*
function getExtremum(chart) {
  let minY = [];
  let maxY = [];
  let i = 1;
  do {
    minY[i-1] = getMinArr(chart.columns[i].slice(1));;
    maxY[i-1] = getMaxArr(chart.columns[i].slice(1));;
    i++;
  } while (i < chart.columns.length);
  let ext = {};
  ext.minY = getMinArr(minY);
  ext.maxY = getMaxArr(maxY);
  ext.minX = getMinArr(chart.columns[0].slice(1)) / 100000;
  ext.maxX = getMaxArr(chart.columns[0].slice(1)) / 100000;
  ext.widthX = ext.maxX-ext.minX;
  return ext;
}
*/
function getExtremum(chart) {
  let minY = [];
  let maxY = [];
  let i = 1;
  do {
    minY[i-1] = getMinArr(chart.columns[i].slice(1));;
    maxY[i-1] = 400-getMaxArr(chart.columns[i].slice(1)) + getMinArr(chart.columns[i].slice(1)); //inversion
    i++;
  } while (i < chart.columns.length);
  let ext = {};
  ext.minY = 400-getMaxArr(maxY); //inversion
  ext.maxY = 400-getMinArr(minY); //inversion
  ext.height = ext.minY - ext.maxY;
  ext.minX = 0;
  ext.maxX = (getMaxArr(chart.columns[0].slice(1)) -getMinArr(chart.columns[0].slice(1))) / 100000;
  ext.widthX = ext.maxX-ext.minX;
  return ext;
}



var x1 = 15424128;
var y1 = 0;
var vbWidth = 47952;
var vbHeight = 273;

console.log(wSize);
console.log("Portrait: " + portraitOrientation);

for (var i = 0; i < charts.length; i++) {
  document.write("<div><font class='chartTitles' id='chartTitle"+ i + "'>" + "Chart: #" + (i+1) + "</font></div>"); //create title element for each chart
  //document.write("<div><svg x='0' width='100%' height='601px'  preserveAspectRatio='none' class='svgCharts' id='svgChart"+ i + "' xmlns=\"http://www.w3.org/2000/svg\">"); //create svg element for each chart
    //create path for i chart and set state true for charts. This attributes adds to chart object
    charts[i].states = ['false'];
    charts[i].paths = [];
    for (var j = 1; (j < charts[i].columns.length); j++) {
      charts[i].states[j] = true; //set state for j chart
      charts[i].paths[j] = getPath(charts[i].columns[0],charts[i].columns[j]); //creates path for j chart
    }
    //document.write("<svg class='chartBoardsMarks' id='chartBoardMark"+ i + "' xmlns=\"http://www.w3.org/2000/svg\">" + "</svg>"); //marking for chartboard i
    let ext = getExtremum(charts[i]);
    x1 = ext.minX;
    vbWidth = ext.widthX*1.2;
    y1 = ext.maxY;
    vbHeight = ext.height;
    document.write("<div><svg x='0' y='0' width='400px' height=400px viewbox='" + x1 + ' ' + y1 + ' ' + vbWidth + ' ' + vbHeight + "' preserveAspectRatio='none' class='chartBoards' id='chartBoard"+ i + "' xmlns=\"http://www.w3.org/2000/svg\" " + "" + ">"); //create chart board i
      //document.write(" viewbox=\"0 0 100 100\" >");
    drawPath(charts[i],i);
    document.write("</div></svg>");
    //document.write("<svg class='dateBars' id='dateBar"+ i + "' xmlns=\"http://www.w3.org/2000/svg\">" + "</svg>"); //create date bar i
    //document.write("<svg class='scrollBars' id='scrollBar"+ i + "' xmlns=\"http://www.w3.org/2000/svg\">" + "</svg>"); //create scrollbar i
    //document.write("<svg class='buttonBars' id='buttonBar"+ i + "' xmlns=\"http://www.w3.org/2000/svg\">" + "</svg>"); //create button bar i
  //document.write("</svg></div>"); //close svgCharts
  console.log(getExtremum(charts[i]));
}
console.log(charts[0]);


var uTime = 1528016400000;
function f_getDate(UNIX_timestamp, tView){ //tView[t - time, d - date]
  var uStamp = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var time = 'error: Invalid view type';
  if (tView == 'd') {
      time = uStamp.getDate() + ' ' + months[uStamp.getMonth()];
  } else if (tView == 't') {
      time = ('0' + uStamp.getHours()).substr(-2) + ':' + ('0' + uStamp.getMinutes()).substr(-2);
  }
  return time;
}

console.log('Time: ' + f_getDate(uTime,'t'));


function getChart(url){
  return new Promise(function(resolve, reject){
    var chart = new XMLHttpRequest();
    chart.open('GET', url, true);
    chart.onreadystatechange = function () {
      if (chart.readyState == 4) {
          if(chart.status == 200) {
            try{resolve(JSON.parse(chart.responseText));}
            catch(err){reject(err);}
          }
          else {reject(chart.status);}
      }
    };
    chart.send(null);
  });
}

for (var i = 1; i <= 5; i++) {
  getChart('input_s/' + i + '/overview.json').then(
      function(chart_obj) {console.log(chart_obj);},
      function(error){console.log(error);}
  );
}
/*
getChart('input_s/1/overview.json').then(
    function(chart_obj) {console.log(chart_obj);},
    function(error){console.log(error);}
);*/


function getLine(chart, ch_num) { //returns polyline for line type chart --input: columns, scaled [true,false]
  let line = [];
  let maxY = 0;
  for (var i = 1; i < chart.length; i++) {
    maxY = getMaxArr(chart[i].slice(1));
    line[i-1] = '';
    for (var j = 1; j < chart[i].length; j++) {
      line[i-1] += (j-1) + ',' + (maxY - chart[i][j]) + ' ';
    }
    document.getElementById('chartBoard' + ch_num).innerHTML = "<polyline points='20,20 40,50 60,40' stroke='red' stroke-width='3' fill='none' vector-effect='non-scaling-stroke' />";
  }
  return line;
}
