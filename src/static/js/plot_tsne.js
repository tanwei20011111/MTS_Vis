import * as d3 from 'd3';
import {request, post_request} from '../../network/request';



function rescale(tsne_pnts, div_size){
	let padding_x = 10;    // CHANGE
	let padding_y = 10;
	let width = div_size[0];
	let height = div_size[1];
	let points = [];
	// Scale x
	let x_min = Math.min(...tsne_pnts.map(pnt => {return pnt[0];}));
	let x_max = Math.max(...tsne_pnts.map(pnt => {return pnt[0];}));
	// console.log("Min X: ", x_min, x_max);
	let x = d3.scaleLinear()
              .domain([x_min-padding_x, x_max+padding_x])
              .range([0, width]);

	// Scale y
	let y_min = Math.min(...tsne_pnts.map(pnt => {return pnt[1];}));
	let y_max = Math.max(...tsne_pnts.map(pnt => {return pnt[1];}));
	// console.log("Min y: ", y_min, y_max);
	let y = d3.scaleLinear()
	          .domain([y_min-padding_y, y_max+padding_y])
	          .range([0, height]);
	
	points = tsne_pnts.map(pnt => {return [x(pnt[0]), y(pnt[1])]});
	return points;
}



function plotScatterPnts(container, points){
	let num_pnts = points.length;
	let scatters = container.selectAll("scatter_dots")
			                  .data(points)
			                  .enter().append("circle")
			                  .attr("class", "scatter_dot")
			                  .attr("id", function(d, i){ return i;})
			                  .attr("cx", function (d) { return d[0]; } )
			                  .attr("cy", function (d) { return d[1]; } )
			                  .attr("r", 1.6)
			                  .attr("fill", function(d, i){
			                  		return d[2];
				              })
				              .on("click", function(d){
				              	console.log("Pnt Text: ", d[1]);
				              });
}



function plotTsne(feature_data, com_series, container){
	console.log("t-SNE called...");
	let div_rect = document.getElementById(container).getBoundingClientRect();

    let url = '/tsne';
    let data =  JSON.stringify({features: feature_data});  
    let config = { headers: {'Content-Type': 'application/json'} };

    new Promise( (resolve, reject) => {
        post_request(url, data, config).then(res => {
            let data = res.data;    
            resolve(data);    
        }).catch(err => {console.log(err);});

    }).then( (data) => {     
    	console.log("DDDDD ...", data);     
		let div_w = div_rect.width;
		let div_h = div_rect.height;
		let div_t = div_rect.top;     // top-y
		let div_l = div_rect.left;    // top-x

		let tsne_pnts = data["tsne_pnts"]; 
		let scaled_pnts = rescale(tsne_pnts, [div_w, div_h]);
		// -> Draw points
		let svg = d3.select("#"+container).append("svg")
						  .attr('id', 'tsne_svg')
						  .attr("width", div_w-5)    // CHANGE
						  .attr("height", div_h-5)
						  .attr("transform", "translate(1,1)");

		let color_map = {'c0': '#ef8a62', 'c1': '#67a9cf', 'c2': '#99d594'};
		// let translated_pnts = scaled_pnts.map(p => [p[0], p[1]]);
		let translated_pnts = scaled_pnts.map( (p, i) => {
			let com = undefined;
			for (let c_id in com_series){
				if (c_id != 'modularity'){
					let mem_series = com_series[c_id];
					if (mem_series.includes('s'+i))
						com = c_id;
				}
			}
			return [p[0], p[1], color_map[com]]; });

		console.log("translated_pnts ...", translated_pnts);

		plotScatterPnts(svg, translated_pnts);


		// Save SVG
		// setTimeout(() => {

		// 	var svg = document.getElementById('tsne_svg');

		//     // Serialize the SVG to a string
		//     var serializer = new XMLSerializer();
		//     var svgString = serializer.serializeToString(svg);

		//     // Create a Blob object from the SVG string
		//     var svgBlob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});

		//     // Create a URL for the Blob object
		//     var svgUrl = URL.createObjectURL(svgBlob);

		//     // Create a temporary anchor element and trigger a download
		//     var downloadLink = document.createElement("a");
		//     downloadLink.href = svgUrl;
		//     downloadLink.download = "tsne_visualization.svg"; // Name the file
		//     document.body.appendChild(downloadLink);
		//     downloadLink.click();
		//     document.body.removeChild(downloadLink);

		// }, 3000);
		

    });
}



export{
	plotTsne,
}



