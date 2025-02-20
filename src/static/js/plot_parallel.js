import * as d3 from 'd3';
import {request, post_request} from '../../network/request';
import {edgeBundling} from './lib/d3-ForceEdgeBundling';


function plotParallel(container){
  let margin = {top: 25, right: 5, bottom: 5, left: 5};
  let width = 420;
  let height = 250;  // CHANGE

  // Parse the Data
  d3.csv("../../static/data/web/series_stats.csv", function(data) {  
    // -> Create svg for parallels
    let svg = d3.select("#"+container)
                  .append("svg")
                  .attr("width", width)
                  .attr("height", height-margin.bottom) 
                  .append("g")
                  .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

    let dimensions = d3.keys(data[0]).filter(function(d) { return d != "Species" });

    let y = {};      // scales
    for (let i in dimensions) {
      name = dimensions[i]
      y[name] = d3.scaleLinear()
                  .domain( d3.extent(data, function(d) { return +d[name]; }) )
                  .range([height-55, 0])   // CHANGE

      // y[name].brush = d3.brushY()
      //           .extent([[-5, y[name].range()[1]], [5, y[name].range()[0]]]) //刷子范围
      //           .on("brush", brush);
    }


    let x = d3.scalePoint()
              .range([0, width])
              .padding(1)
              .domain(dimensions);

    // straight lines
    function path(d) {
        return d3.line()(dimensions.map(function(p) { 
                                          return [x(p), y[p](d[p])]; }));
    }

    // curved lines
    const line = d3.line()
                    .curve(d3.curveBundle);

    // Draw the lines
    svg
      .selectAll("myPath")
      .data(data)
      .enter().append("path")
      .attr("d",  path)
      // .attr("d",  d => line(dimensions.map( function(p) { 
      //                                     return [x(p), y[p](d[p])]; } )))
      .style("fill", "none")
      .style("stroke", "#91bfdb")
      .style("stroke-width", .8)
      .style("opacity", 0.8);


    // ------------ Draw bundled lines (BEGN) ------------ //
    // let lines = d3.select('#'+container).selectAll('path');
    // let start_pnts = [], end_pnts =[];
    // lines.each(function(d) {
    //   let parse = d3.select(this).attr("d");  
    //   let start = parse.split("L")[0].split("M")[1].split(",");
    //   start_pnts.push(start);
    //   let end = parse.split("L")[1].split(",");
    //   end_pnts.push(end);
    // });

    // let start_nodes = [];
    // start_pnts.forEach(p => {
    //   let px = parseFloat(p[0]), py = parseFloat(p[1]);
    //   start_nodes.push({"x": px, "y": py});
    // });
    // let end_nodes = [];
    // end_pnts.forEach(p => {
    //   let px = parseFloat(p[0]), py = parseFloat(p[1]);
    //   end_nodes.push({"x": px, "y": py});
    // });

    // let node_data = {}, edge_data = [];;
    // let num_nodes = start_nodes.length;
    // for (let i = 0; i < num_nodes; i++) {
    //   node_data[i.toString()] = start_nodes[i];
    //   node_data[(i+num_nodes).toString()] = end_nodes[i];
    //   edge_data.push({"source":i.toString(), "target":(i+num_nodes).toString()});
    // }

    // let fbundling = edgeBundling()
    //                   .nodes(node_data)
    //                   .edges(edge_data);
    // let results   = fbundling();  

    // let d3line = d3.line()
    //                    .x(function(d){ return d.x; })
    //                    .y(function(d){ return d.y; })
    //                    .curve(d3.curveLinear);
                      
    // results.forEach(function(edge_subpoint_data){ 
    //   svg.append("path")
    //      .attr("d", d3line(edge_subpoint_data))
    //       .style("stroke-width", 1)
    //       .style("stroke", "#69b3a2")
    //       .style("fill", "none")
    //       .style('stroke-opacity',0.5); 
    // });
    // ------------ Draw bundled lines (END) ------------ //




    // Draw the axis:
    svg.selectAll("myAxis")
      // For each dimension of the dataset I add a 'g' element:
      .data(dimensions).enter()
      .append("g")
      // I translate this element to its right position on the x axis
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      // And I build the axis with the call function
      .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
      // Add axis title
      .append("text")
      .attr('transform', 'rotate(-20)')
      .style("text-anchor", "middle")
      .style("font-size", 10)
      .style("font-weight", "bold")
      .attr("y", -13)
      .text(function(d) { return d; })
      .style("fill", "grey");

    svg.selectAll(".tick text")
       .style("font-size", 8)

    // Add a brush for each axis.
    // svg.append("svg:g")
    //     .attr("class", "brush")
    //     .each(function(d) { 
    //       console.log("HJHJHJH: ", y[d])
    //       d3.select(this).call(y[d].brush); })
    //     .selectAll("rect")
    //     .attr("x", -8)
    //     .attr("width", 16);


      // Add box plot
      // svg.selectAll("myAxis")
      //     .data(dimensions).enter()
      //     .append("g")
      //     .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      //     .append('rect')
      //     .attr('x', -5)
      //     .attr('y', 10)
      //     .attr('width', 10)
      //     .attr('height', 30)
      //     .attr('stroke', 'black')
      //     .attr('stroke-width', '1')
      //     .style("fill", "lightgray")
      //     .style("opacity", .8);
      function brush() {
        let actives = [];
        //filter brushed extents
        svg.selectAll(".brush")
            .filter(function(d) {
                return d3.brushSelection(this);
            })
            .each(function(d) {
                actives.push({
                    dimension: d,
                    extent: d3.brushSelection(this)
                });
            });
        //set un-brushed foreground line disappear
        // foreground.classed("fade", function(d,i) {
        //     return !actives.every(function(active) {
        //         let dim = active.dimension;
        //         return active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim])  <= active.extent[1];
        //     });
        // });

      }

  })

}






export{
  plotParallel,
}



