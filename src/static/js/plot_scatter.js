import * as d3 from 'd3';


function plotScatter(container, data){
	  let margin = {top: 10, right: 30, bottom: 30, left: 60},
	      width = 330 - margin.left - margin.right,
	      height = 230 - margin.top - margin.bottom;

	  // append the svg object to the body of the page
	  let svg = d3.select("#"+container)
				  .append("svg")
				    .attr("width", width + margin.left + margin.right)
				    .attr("height", height + margin.top + margin.bottom)
				  .append("g")
				    .attr("transform",
				          "translate(" + margin.left + "," + margin.top + ")");

	  let x = d3.scaleLinear()
			    .domain([0, 100])
			    .range([ 0, width ]);
	  svg.append("g")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(x));
	  // Add Y axis
	  let y = d3.scaleLinear()
			    .domain([0, 100])
			    .range([ height, 0]);
	  svg.append("g")
	    .call(d3.axisLeft(y));

	  // Add dots
	  svg.append('g')
	    .selectAll("dot")
	    .data(data)
	    .enter()
	    .append("circle")
	      .attr("cx", function (d) { return x(parseFloat(d.pred)); } )
	      .attr("cy", function (d) { return y(parseFloat(d.true)); } )
	      .attr("r", function(d){
	      	// return 1.5;
	      	if ( parseFloat(d.true)<parseFloat(d.pred) )
	      		return 0;
	      	else return 2.3;
	      })
	      .style("fill", "#69b3a2")

	  var sym = d3.symbol().type(d3.symbolStar).size(26);
	  svg.append('g')
	    .selectAll("star")
	    .data(data)
	    .enter()
        .append("path")
        .attr("d", sym)
        .attr("fill", function(d){
	      	if ( parseFloat(d.true)<parseFloat(d.pred) )
	      		return 'steelblue';
	      	else return 'transparent';
	      })
        .attr("transform", function (d) { return "translate("+x(parseFloat(d.pred))+","+y(parseFloat(d.true))+")" });

}



export{
	plotScatter,
}