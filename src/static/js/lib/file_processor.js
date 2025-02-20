import * as d3 from 'd3';


// csv file must have header
function csv_loader(filename, callback){
  d3.csv(filename, function(data){
    callback(data);
  });
}


function json_loader(filename, callback){
  // d3.csv(filename).then(data => {
  d3.json(filename, function(data){
    callback(data);
  });
}


function series_file_loader(filename, callback){
  // d3.csv(filename).then(data => {
  d3.csv(filename, function(data){ 
    let series_data = [];
    let series_days = [];
    let series_start = data.columns[2];   // column0: index, column1: page
    let series_period = data.columns.length-2;
    
    // series_days = [...Array(series_period).keys()].map(i => {
    //   let date_begin = new Date(series_start);
    //   let date_next = date_begin.setDate(date_begin.getDate()+i);
    //   return new Date(date_next).toISOString().slice(0, 10);
    // });

    series_days = [...Array(series_period).keys()].map(i => 'd'+i);

    data.forEach(item => {
      let item_name = item.name;
      let item_series = series_days.map(date => parseFloat(item[date]));
      series_data.push({"name": item_name, "data": item_series});
    });

    // -> Manipulate loaded data
    callback(series_data);
	});
}


function wgts_file_loader(filename, callback){
  // d3.csv(filename).then(data => {
  d3.csv(filename, function(data){
    let patterns = Object.keys(data[0]).sort((a,b) => a-b);
    let incorrelated_series = [];  // series indices

    // -> Check if series incorrelated to any pattern
    data.map((d,i) => {
      let series_wgts = patterns.map(p => parseFloat(d[p]));
      let zero_wgt_flag = true;
      series_wgts.forEach(w => {
        if(w!=0) zero_wgt_flag = false;
      });
      if(zero_wgt_flag==true)
        incorrelated_series.push(i);
    });

    // -> Get formatted pattern weights
    let wgts_data = {};
    for (let p of patterns){
      let ptn_wgts = data.map(d => parseFloat(d[p]));
      wgts_data[p] = ptn_wgts;
    }

    callback(wgts_data);

    // -> Test
    // let top_series = [149, 3, 58, 99, 29, 127, 142, 162, 107, 88, 53, 37, 139, 77, 90, 71]; 
    // TSAnalyzer.evalDistribution(top_series, wgts_data);   
  });
}



export{
  csv_loader,
  json_loader,
  series_file_loader,
  wgts_file_loader,
}



