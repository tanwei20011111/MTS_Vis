import * as d3 from 'd3';



function color(min, max, val){
	const colorRange = ['#ffffff', '#2c7bb6'];   // blue(2c7bb6) -> red
	const colorList = d3.scaleSqrt().range(colorRange).domain([min, max]);

	return colorList(val);
}


function addLegend(svg){
	var colorScale = d3.scaleLinear()
										  .domain([0, 178])    // same with min/max above
										  .range(["#ffffff", "#2c7bb6"]);


	let legend = svg.append("g")
								  .attr("class", "legend")
								  .attr("transform", "translate(" + (-10) + "," + (-15) + ")");

	legend.append("rect")
				  .attr("width", 280)
				  .attr("height", 8)
				  .attr("transform", "rotate(0) translate(10)")
				  // .attr("transform", "translate(10, 1000)")
				  .attr("opacity", .8)
				  .style("fill", "url(#gradient)");

	// legend.append("text")
	// 		  .attr("x", 0)
	// 		  .attr("y", -2)
	// 		  .attr("font-size", 12)
	// 		  .attr("transform", "rotate(0)")
	// 		  .text("0");

	// legend.append("text")
	// 		  .attr("x", 80)
	// 		  .attr("y", -2)
	// 		  .attr("font-size", 12)
	// 		  .attr("transform", "rotate(0)  translate(200)")
	// 		  .text("178");    // the largest frequency

	let gradient = legend.append("defs")
											  .append("linearGradient")
											  .attr("id", "gradient")
											  .attr("x1", "0%")
											  .attr("y1", "0%")
											  .attr("x2", "100%")
											  .attr("y2", "0%");

	gradient.append("stop")
				  .attr("offset", "0%")
				  .attr("stop-color", colorScale(0));

	gradient.append("stop")
				  .attr("offset", "100%")
				  .attr("stop-color", colorScale(178));
}


function gridSetting(div_id, data){
	// CHANGE
	let padding_w = 2, padding_h = 2;
	let svg_trans_x = 0, svg_trans_y = -15;

	let num_rows = 15, num_cols = data[0].data.length;      // CHANGE === num_cols: same with time steps

	let div_rect = document.getElementById(div_id).getBoundingClientRect();
	let div_w = div_rect.width-padding_w;     
	let div_h = div_rect.height-padding_h;

	let cell_w = div_w/num_cols;               
	let cell_h = div_h/num_rows;


	if (div_id.includes('granger')){
		num_rows = num_cols = data.length;
		padding_w = 2;  padding_h = 2;
		svg_trans_x = 2; svg_trans_y = 2;
		cell_w = 2, cell_h = 2;
		div_w = cell_w*num_cols, div_h = cell_h*num_rows;
	}

	return {'div_w': div_w, 'div_h': div_h,
					'cell_w': cell_w, 'cell_h': cell_h,
				  'num_rows': num_rows, 'num_cols': num_cols,
				  'svg_trans_x': svg_trans_x, 'svg_trans_y': svg_trans_y};
}


function plotGrid(container, data){
	let div_id = container;
	let setting = gridSetting(div_id, data);

	let width = setting.cell_w, height = setting.cell_h;
	let div_w = setting.div_w, div_h = setting.div_h;
	let num_cols = setting.num_cols, num_rows = setting.num_rows;
	let svg_trans_x = setting.svg_trans_x, svg_trans_y = setting.svg_trans_y;


	// which cell the data point lies 
	function getCoordinates(data, flag){
		let arr1d = [].concat(...data);
		// console.log("arr1d: ", arr1d);

		let delta = 0;     // CHANGE
		let max = Math.max(...arr1d)+delta;
		let min = Math.min(...arr1d)-delta;
		
		let coordinates = new Array();
		// console.log("MMMMMnnnnn: ", max, min);

		for (let i=0; i<data.length; i++){  // row, series
			for (let j=0; j<data[i].length; j++){  // column, step
				let x = j;
				// let y = Math.floor(((data[i][j]-min)/(max-min)*height*num_rows)/height)+1;
				let y = num_rows-Math.floor((data[i][j]-min)/(max-min)*num_rows);
				if (flag=='granger'){
					y = i;
				}
				coordinates.push([x,y]);
			}
		}
		// console.log("coordinates: ", coordinates);
	  return coordinates;
	}


	function frequency(arr, element) {
	  let count = 0;
	  for (let i = 0; i < arr.length; i++) {
	    if (JSON.stringify(arr[i])==JSON.stringify(element)){
	      count++;
	    }
	  }
	  return count;
	}


	function getGridData(coordinates, flag){
		let gridData = [];

		for (let i=0; i<num_cols; i++){  
			for (let j=0; j<num_rows; j++){
				if (flag=='granger'){
					gridData.push({'col': i, 'row': j});  
				}
				else{
					let count = frequency(coordinates, [i,j]); 
					gridData.push({'col': i, 'row': j, 'val': count});
				}
			}
		}
		return gridData;
	}


	data = data.map( d => d.data);
	let flag = '';
	if (div_id.includes('granger'))
		flag = 'granger';

	let coordinates = getCoordinates(data, flag);    
	let gridData = getGridData(coordinates);

	if (div_id.includes('granger'))
		gridData = gridData.map( d => {return {'col': d.col, 'row': d.row, 'val': data[d.row][d.col]};} );

	let v_min = Math.min(...gridData.map(d => d.val));
  let v_max = Math.max(...gridData.map(d => d.val));
  // console.log("v_min: ", v_min, v_max);

	let svg = d3.select("#"+div_id)
							.append("svg")
							.attr("id", 'heat_svg')
						  .attr("width", div_w)
						  .attr("height", div_h)
							.append("g")
						  .attr("transform",
						        "translate(" + svg_trans_x + "," + svg_trans_y + ")");   

	// --------------------- Discrete (BEGN) --------------------- //
  let cols = d3.map(gridData, function(d){return d.col;}).keys();
  let rows = d3.map(gridData, function(d){return d.row;}).keys();

  // Build X scales and axis:
  let x = d3.scaleBand()
				    .range([0, div_w])
				    .domain(cols);
  svg.append("g")
	    .style("font-size", 0)
	    .attr("transform", "translate(0," + div_h + ")")   
	    .call(d3.axisBottom(x).tickSize(0))
	    .select(".domain").remove();

  // Build Y scales and axis:
  let y = d3.scaleBand()
				    .range([div_h, 0])
				    .domain(rows);

  // create a tooltip
  let tooltip = d3.select("#"+div_id)
							    .append("div")
							    .style("opacity", 0)
							    .attr("class", "tooltip")
							    .style("background-color", "white")
							    .style("border", "solid")
							    .style("border-width", "2px")
							    .style("border-radius", "5px")
							    .style("padding", "3px");

  // Three function that change the tooltip when user hover / move / leave a cell
  let mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  let mousemove = function(d) {
    tooltip
      .html("The exact value of<br>this cell is: " + d.val)
      .style("left", (d3.mouse(this)[0]+20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  let mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // bbox
  // svg.append("rect")
  //     .attr("x", 0)
  //     .attr("y", 0)
  //     .attr("width", div_w-10)
  //     .attr("height", div_h-30)
  //     .style("fill", 'transparent')
  //     .style("stroke-width", .5)
  //     .style("stroke", "grey");

  // add the squares
  // console.log("gridData: ", gridData);

  svg.selectAll()
	    .data(gridData, function(d) {return d.col+':'+d.row;})
	    .enter()
	    .append("rect")
	      .attr("x", function(d) { return x(d.col); })
	      .attr("y", function(d) { return div_h-y(d.row); })
	      .attr("width", width)
	      .attr("height", height)
	      .style("fill", function(d) {return color(v_min, v_max, d.val); } )
	      .style("stroke-width", .5)
	      .style("stroke", "white")
	      .style("opacity", 0.8)
	    // .on("mouseover", mouseover)
	    // .on("mousemove", mousemove)
	    // .on("mouseleave", mouseleave);


	// present representatives (web set) 
	// let s1 = [14, 12, 12, 14, 14, 10, 12, 13, 15, 15, 13, 12, 17, 17, 15, 15, 15, 13, 15, 16, 12, 15, 13, 9, 12, 11, 10, 11, 16, 10, 9];
 //  let s2 = [82, 53, 46, 37, 57, 48, 57, 31, 71, 94, 32, 78, 59, 90, 45, 60, 45, 50, 75, 136, 26, 86, 69, 37, 35, 57, 84, 57, 45, 70, 73]
	// electricity
	let s1 = [10.22607634,10.67107634,9.40785497,9.310771,9.15856488,9.58859543,9.57948855,9.79209159,9.63016031,9.09603053,8.84943512,9.7290916,9.85258778,9.80848091,9.56454962,10.02782443,9.22203053,9.32338168,9.28670993,9.06503816,9.48580153,9.62247328,10.14583206,10.02767176,9.47416793,9.44405344,9.10907634,9.43411451,9.55464122,9.59022137,9.53927481];
	let s2 = [23.79187494,29.262375,24.55124996,27.799125,29.26437501,34.08337486,26.44524991,30.71849998,30.55899994,28.39049995,20.40399998,37.92487499,40.49825016,28.09912513,26.16912502,26.25724998,27.37862502,27.35475005,30.41424993,29.59349995,22.47199999,27.63287504,25.61024987,27.33875,26.55399995,24.75087499,21.42225004,25.44374999,27.92424995,27.19812498,23.15287504];
	
	// let s1 = [7.70232979,7.83762766,6.8092766,6.93751064,6.67607447,6.99776596,7.01161702,6.93556383,6.54419149,6.68322341,6.10385107,6.82559575,7.07273405,7.12575532,7.01195745,7.06375532,6.81335106,6.95819149,6.82772341,6.67218085,6.63134042,6.74090426,7.16460638,6.9137766,6.3188617,6.5584149,6.54655319,6.92561703,6.97281915,6.9862234,6.92789361]
 //  let s2 = [26.11757136,30.89842857,22.82242853,24.41057141,24.77914289,27.58071423,20.98099989,27.59471424,27.78585711,23.43185709,16.57114286,35.28471433,32.03671429,28.42757156,23.01857141,25.63314284,24.52857141,25.55885717,26.87242854,29.02128564,19.86042857,22.8134286,21.40057133,24.29285713,28.11014281,26.659,22.08728576,21.91228573,24.41385706,23.65414281,20.89785717]
 //  let s3 = [16.63775676,17.86956757,16.00964867,15.34013515,15.46543242,16.17070272,16.10327028,17.0492162,17.47018922,15.22586485,15.82470272,17.10554052,16.9149189,16.62405404,16.04951353,17.55816216,15.34137838,15.33224325,15.53386486,15.14418918,16.73767569,16.94321622,17.71975675,17.93864867,17.49035134,16.77513514,15.61927027,15.80705405,16.11386486,16.20578378,16.17359459]
 //  let s4 = [7.512,17.81,36.653,51.5190001,60.6609999,79.6019993,64.6950001,52.5850001,49.9709997,63.101,47.2339998,56.4059996,99.7290013,25.8000001,48.2230003,30.6259999,47.3290003,39.9260002,55.2069996,33.5990001,40.7529999,61.3690001,55.0779997,48.6600001,15.6609999,11.3939999,16.767,50.1639998,52.4970002,52.0060001,38.9380001]
	let min = 0, max = 100;
	// let coord_s1 = s1.map( (s, i) => {return {'x': (i+1), 'y': Math.floor(((s-min)/(max-min)*height*num_rows)/height)+1}; } );
	// let coord_s2 = s2.map( (s, i) => {return {'x': (i+1), 'y': Math.floor(((s-min)/(max-min)*height*num_rows)/height)+1}; } );
	
	let coord_s1 = s1.map( (s, i) => {return {'x': (i), 'y': Math.floor((s-min)/(max-min)*num_rows)}; } );
	let coord_s2 = s2.map( (s, i) => {return {'x': (i), 'y': Math.floor((s-min)/(max-min)*num_rows)}; } );
	// let coord_s3 = s3.map( (s, i) => {return {'x': (i), 'y': Math.floor((s-min)/(max-min)*num_rows)}; } );
	// let coord_s4 = s4.map( (s, i) => {return {'x': (i), 'y': Math.floor((s-min)/(max-min)*num_rows)}; } );


	let representatives_data = [coord_s1, coord_s2];   // , coord_s3, coord_s4
	// Define the line function
	let lineFunction = d3.line()
										    .x(function(d) { return x(d.x); })
										    .y(function(d) { return y(d.y); })
										    .curve(d3.curveLinear);

	// Draw the path
	let path = svg.selectAll("path")
								.data(representatives_data)
							  .enter()
						    .append("path")
						    .attr("d", lineFunction)
						    .attr("transform", 'translate(5,13)')
						    .attr("stroke", "#fdae61")
						    .attr("stroke-width", 1.5)
						    .attr("fill", "none");

	// --------------------- Discrete (END) --------------------- //

	if (div_id == 'grid')
		addLegend(svg);


	// --------------------- Continuous (BEGN) --------------------- //
	// let margin = {'left': 10, 'right': 10, 'bottom': 10, 'top': 10};

	// // Add X axis
 //  var x = d3.scaleLinear()
	// 			    .domain([0, 31])
	// 			    .range([margin.left, div_w - margin.right]);
 //  svg.append("g")
	//     .attr("transform", "translate(0," + div_h + ")")
	//     .call(d3.axisBottom(x));

 //  // Add Y axis
 //  var y = d3.scaleLinear()
	// 			    .domain([0, num_rows])
	// 			    .range([div_h-margin.bottom, margin.top]);
 //  svg.append("g")
	//     .call(d3.axisLeft(y));

 //  // Prepare a color palette
 //  var color = d3.scaleLinear()
	// 				      .domain([0, 1]) // Points per square pixel.
	// 				      .range(["white", "#69b3a2"])

 //  // compute the density data
 //  var densityData = d3.contourDensity()
	// 								    .x(function(d) { return x(d.col); })
	// 								    .y(function(d) { return y(d.row); })
	// 								    .size([div_w, div_h])
	// 								    .bandwidth(20)
	// 								    (gridData);

 //  // show the shape!
 //  svg.insert("g", "g")
	//     .selectAll("path")
	//     .data(densityData)
	//     .enter().append("path")
 //      .attr("d", d3.geoPath())
 //      .attr("fill", function(d) { return color(d.val); })
	// --------------------- Continuous (END) --------------------- //


	// Save SVG
	// setTimeout(() => {
	// 	let svgData = $("#heat_svg")[0].outerHTML;
	// 	let svgBlob = new Blob([svgData], {type:"image/svg+xml;charset=utf-8"});
	// 	let svgUrl = URL.createObjectURL(svgBlob);
	// 	let downloadLink = document.createElement("a");
	// 	downloadLink.href = svgUrl;
	// 	downloadLink.download = "grid_svg.svg";
	// 	document.body.appendChild(downloadLink);
	// 	downloadLink.click();
	// 	document.body.removeChild(downloadLink);
	// }, 3000);

}



export{
  plotGrid,
}






