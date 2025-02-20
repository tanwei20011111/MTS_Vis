import * as d3 from 'd3';


let margin = {top: 3, right: 3, bottom: 3, left: 15},
    width = 350 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

function plotBox(data, container){
  let svg = d3.select("#"+container)
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
  
  let sumstat = d3.nest() 
                  .key(function(d) { return d.ptn;})
                  .rollup(function(d) {
                    let q1 = d3.quantile(d.map(function(g) { return g.wgt;}).sort(d3.ascending),.25)
                    let median = d3.quantile(d.map(function(g) { return g.wgt;}).sort(d3.ascending),.5)
                    let q3 = d3.quantile(d.map(function(g) { return g.wgt;}).sort(d3.ascending),.75)
                    let interQuantileRange = q3 - q1
                    let min = q1 - 1.5 * interQuantileRange
                    let max = q3 + 1.5 * interQuantileRange
                    return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
                  })
                  .entries(data)

  // Show the X scale
  let x = d3.scaleBand()
            .range([ 0, width ])
            .domain(["p0", "p1", "p2", "p3", "p4"])
            .paddingInner(1)
            .paddingOuter(.5);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("class", "axisGrey")
      .call(d3.axisBottom(x))

  // Show the Y scale
  const valuesOfWgts = data.map(dict => dict['wgt']);
  const minValOfWgt = Math.min(...valuesOfWgts);
  const maxValOfWgt = Math.max(...valuesOfWgts);

  let y = d3.scaleLinear()
            .domain([minValOfWgt-0.1, maxValOfWgt+0.1])    // CHANGE
            .range([height, 0])
  svg.append("g")
     .attr("class", "axisGrey")
     .call(d3.axisLeft(y))

  // Show the main vertical line    // HERE ===
  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key))})    
      .attr("x2", function(d){return(x(d.key))})
      .attr("y1", function(d){return(y(d.value.min))})
      .attr("y2", function(d){return(y(d.value.max))})
      .attr("stroke", "black")
      .style("width", 80)     

  // rectangle for the main box
  let boxWidth = 30;
  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.key)-boxWidth/2)})
        .attr("y", function(d){return(y(d.value.q3))})
        .attr("height", function(d){return(y(d.value.q1)-y(d.value.q3))})
        .attr("width", boxWidth )
        .attr("stroke", "black")
        .style("fill", "#69b3a2");

  // Show the median
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.key)-boxWidth/2) })
      .attr("x2", function(d){return(x(d.key)+boxWidth/2) })
      .attr("y1", function(d){return(y(d.value.median))})
      .attr("y2", function(d){return(y(d.value.median))})
      .attr("stroke", "black")
      .style("width", 80);

  // Add individual points with jitter
  let jitterWidth = 10;     
  svg
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d){return(x(d.ptn) - jitterWidth/2 + Math.random()*jitterWidth )})
      .attr("cy", function(d){return(y(d.wgt))})
      .attr("r", 1)
      .style("fill", "white")
      .attr("stroke", "black");
}


export{
  plotBox,
}



