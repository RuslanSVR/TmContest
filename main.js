var uTime = 1528016400000;
    ch_max = 5;
    charts = [];
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


function onSuccess(chart_obj) {
  console.log(chart_obj);
}

for (var i = 1; i <= ch_max; i++) {
  getChart('input_s/' + i + '/overview.json').then(
    function(chart_obj) {console.log(chart_obj);},
    function(error){console.log(error);}
  );
  document.write("<div><font class='chartTitles' id='chartTitle"+ i + "'>" + "Chart: #" + i + "</font></div>"); //create title element for each chart
}
