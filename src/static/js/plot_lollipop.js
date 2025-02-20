import * as d3 from 'd3';


function plotLolli(container, data){
	// set the dimensions and margins of the graph
	let margin = {top: 3, right: 3, bottom: 3, left: 8},
	    width = 160 - margin.left - margin.right,
	    height = 50 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	let svg = d3.select("#"+container)
				  .append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				  .append("g")
				    .attr("transform",
				          "translate(" + margin.left + "," + margin.top + ")");


	// X axis
	let x = d3.scaleBand()
			  .range([ 0, width ])
			  .domain(data.map(function(d) { return d.lag; }))
			  .padding(1);
	svg.append("g")
		  .attr("transform", "translate(0," + height + ")")
		  .call(d3.axisBottom(x))
		  .selectAll("text")
		    .attr("transform", "translate(-10,0)rotate(-45)")
		    .style("text-anchor", "end");

	// Add Y axis
	let y = d3.scaleLinear()
				  .domain([-0.6, 1])
				  .range([ height, 0]);
	svg.append("g")
		  .call(d3.axisLeft(y));

	// Lines
	svg.selectAll("myline")
		  .data(data)
		  .enter()
		  .append("line")
		    .attr("x1", function(d) { return x(d.lag); })
		    .attr("x2", function(d) { return x(d.lag); })
		    .attr("y1", function(d) { return y(d.coe); })
		    .attr("y2", y(0))
		    .attr("stroke", "grey")

	// Circles
	svg.selectAll("mycircle")
		  .data(data)
		  .enter()
		  .append("circle")
		    .attr("cx", function(d) { return x(d.lag); })
		    .attr("cy", function(d) { return y(d.coe); })
		    .attr("r", "2")
		    .style("fill", "#69b3a2")
		    .attr("stroke", "black")

	// y=0 line
	svg.append("line")
	   .attr("x1", 0)
	   .attr("y1", 10*height/16)
	   .attr("x2", width)
	   .attr("y2", 10*height/16)
	   .style("stroke", "grey")
	   .style("stroke-width", 1);


}



export{
  plotLolli,
}