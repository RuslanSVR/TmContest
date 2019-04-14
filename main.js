var uTime = 1554508800000;
    ch_max = 5;
    charts = [];
var def_int = 6; //default date diff
function f_getDate(UNIX_timestamp, tView){ //tView[t - time, d1 - 1 Apr, d2 - 1 April 2019, day - Saturday]
  var uStamp = new Date(UNIX_timestamp);
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var time = 'error: Invalid view type';
  if (tView == 'd1') {
      time = uStamp.getDate() + ' ' + (months[uStamp.getMonth()]).substr(0,3);
  } else if (tView == 'd2') {
      time = uStamp.getDate() + ' ' + months[uStamp.getMonth()] + ' ' + uStamp.getFullYear();
  } else if (tView == 't') {
      time = ('0' + uStamp.getHours()).substr(-2) + ':' + ('0' + uStamp.getMinutes()).substr(-2);
  } else if (tView == 'day') {
      time = days[uStamp.getDate()];
  }
  return time;
}

console.log('Time_t: ' + f_getDate(uTime,'t'));
console.log('Time_d1: ' + f_getDate(uTime,'d1'));
console.log('Time_d2: ' + f_getDate(uTime,'d2'));
console.log('Time_day: ' + f_getDate(uTime,'day'));


function getChart(url, ch_num){
  return new Promise(function(resolve, reject){
    var chart = new XMLHttpRequest();
    chart.open('GET', url, true);
    chart.onreadystatechange = () => {
      if (chart.readyState == 4) {
          if(chart.status == 200) {
            try{resolve([ch_num, JSON.parse(chart.responseText)])}
            catch(err){reject(err);}
          }
          else reject(chart.status);
      }
    };
    chart.send(null);
  });
}

function getMaxArr(array){
  return Math.max.apply(Math, array);
};
function getMinArr(array){
  return Math.min.apply(Math, array);
};

  //let minX = getMinArr(arrX.slice(1));

function drawLine(chart, ch_num) { //returns polyline for line type chart --input: columns, scaled [true,false]
  let line = '';
  let html_str = '';
  let maxY = 0;
  for (var i = 1; i < chart.columns.length; i++) {
    maxY = getMaxArr(chart.columns[i].slice(1));
    line = '';
    for (var j = 1; j < chart.columns[i].length; j++) {
      line += (j-1) + ',' + (maxY - chart.columns[i][j]) + ' ';
    }
    html_str += "<polyline points='" + line + "' stroke='" + chart.colors[chart.columns[i][0]] + "' stroke-width='1' fill='none' vector-effect='non-scaling-stroke' /> ";

  }
  document.getElementById('chartBoard' + ch_num).setAttribute('viewBox', '0 0 ' + chart.columns[0].length +' '+ maxY);
  document.getElementById('chartBoard' + ch_num).innerHTML = html_str;
}



//on onSuccess for each chart
function onSuccess(charts) {
  let date_int = def_int;
  //document.getElementById('chartBoard' + charts[0]).setAttribute('viewBox', '0 7 7 ' + charts[0]);
  document.getElementById('date-interval-' + charts[0]).innerHTML = f_getDate(charts[1].columns[0][charts[1].columns[0].length-1-date_int], 'd2') + ' - ' + f_getDate(charts[1].columns[0][charts[1].columns[0].length-1], 'd2'); //set date interval in right corner
  if (charts[1].stacked) {
    if (charts[1].percentage) {
      console.info('Chart# ',charts[0], 'stacked percentage',charts);
    } else {
      console.info('Chart# ',charts[0], ' stacked', charts);
    }
  } else if (charts[1].y_scaled) {
      //scaling
      let scaling_k = getMaxArr(charts[1].columns[1].slice(1)) / getMaxArr(charts[1].columns[2].slice(1));
      console.warn('scaling_k: ',scaling_k);
      let i = 2;
      if (scaling_k < 1) {
        scaling_k = 1 / scaling_k;
        i = 1;
      }
      for (let j = 1; j < charts[1].columns[i].length; j++)
        charts[1].columns[i][j] = Math.round(charts[1].columns[i][j]*scaling_k);
      //end of scaling



      console.info('Chart# ',charts[0], ' y_scaled',charts);
  } else if ((charts[1].types.y0) == "bar") {
      console.info('Chart# ',charts[0], ' bar',charts);

  } else if ((charts[1].types.y0) == "line") {
      console.info('Chart# ',charts[0], ' line',charts);
      drawLine(charts[1],charts[0]);
  }
}


let x1 = 0; let y1 = 0; //delete from here
for (let i = 1; i <= 5 ; i++) {
  document.write("<div class='chartsHeader'><div class='chartsName'><font class='chartTitles' id='chartTitle"+ i + "'>" + "Chart: #" + i + "</font></div><div class='chart-interval'><font class=date-interval id=date-interval-" + i + ">Test</font></div></div>"); //create title element for each chart
  document.write("<div><svg x='0' y='0' width='400px' height=400px viewbox='0 0 0 0' preserveAspectRatio='none' class='chartBoards' id='chartBoard"+ i + "' xmlns=\"http://www.w3.org/2000/svg\" " + "" + ">"); //create chart board i
  document.write("</div></svg>");
}


var charts = [];
for (let i = 1; i <= ch_max; i++) {
    getChart('input_s/' + i + '/overview.json', i)
      .then(resolve => {
        onSuccess(resolve);
        charts[resolve[0]] = resolve[1];
      })
      .catch(error => console.log(error));
}


console.info(charts);
