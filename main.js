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
