import * as d3 from 'd3';
const cellSize = 10;    // CHANGE
// const cellcolor = ["white","#E5F0F7","#FCE6D5", "#FFF2CA", "#E3F2D9", "#D4F4F1"];
// const cellcolor = ['red', 'green', 'blue', 'orange'];   // 1: pp, 2: pn, 3: sp, 4: sn
const cellcolor = ['#94CAC1', '#F5F6BA', '#C2BFD7', '#EB8F83', '#8AAFC9', '#EAB470'];

function plotTreemap(mst_matrix, treemap_data, size, svg){
	const treemapData = treemap_data;

	// 定义四组不同的treemap数据，每组有四个矩形
    // const treemapData = [
    //     [
    //     { name: "A1", value: 10 },
    //     { name: "B1", value: 20 },
    //     { name: "C1", value: 30 },
    //     { name: "D1", value: 40 }
    //     ],
    //     [
    //     { name: "A2", value: 15 },
    //     { name: "B2", value: 25 },
    //     { name: "C2", value: 35 },
    //     { name: "D2", value: 45 }
    //     ],
    //     [
    //     { name: "A3", value: 25 },
    //     { name: "B3", value: 60 },
    //     { name: "C3", value: 25 },
    //     { name: "D3", value: 30 }
    //     ],
    //     [
    //     { name: "A4", value: 20 },
    //     { name: "B4", value: 10 },
    //     { name: "C4", value: 30 },
    //     { name: "D4", value: 40 }
    //     ]
    // ];

    // 获取每个对角线方块右侧中心作为节点的位置
	const nodePositions = [];
	for (let i = 0; i < size; i++) {
	    const x = i * cellSize + cellSize; // 对角线方块的右侧中心
	    const y = i * cellSize + cellSize / 2;
	    nodePositions.push({ x, y });
	}

    // 创建一个treemap布局
	const treemap = d3.treemap()
					    .size([cellSize, cellSize])  // treemap的大小与单个方格一致
					    .padding(2);  // 方块之间的间距

	// 在对角线上的方块上绘制不同的treemap
	svg.selectAll('.treemap')
	    .data(d3.range(size))  // 对角线的索引
	    .enter().append('g')
	    .attr('class', 'treemap')
	    .attr('transform', (d) => `translate(${d * cellSize}, ${d * cellSize})`)
	    .each(function(d, i) {
		    const g = d3.select(this);
		    // 使用不同的treemap数据
		    const currentTreemapData = treemapData[i];  // 获取当前对角线位置的treemap数据
		    // 创建树形图的根节点
		    const root = d3.hierarchy({ children: currentTreemapData })
		                   .sum(d => d.value); // 计算每个节点的大小
		    // 布局计算
		    treemap(root);

		    // 绘制当前方块中的 treemap
		    const customColors = ["#FCE6D5", "#FFF2CA", "#E3F2D9", "#D4F4F1"];

		    const cell = g.selectAll('rect')
		        .data(root.leaves())  // 获取树形图的叶子节点（即4个矩形）
		        .enter().append('rect')
		        .attr('x', d => d.x0)
		        .attr('y', d => d.y0)
		        .attr('width', d => d.x1 - d.x0)
		        .attr('height', d => d.y1 - d.y0)
		        .attr('fill', (d, i) => {
		        	// console.log("ddddd: ", d.data.name);
		        	let block_color = undefined;
		        	if (d.data.name == 'pearson_pos')
		        		block_color = cellcolor[0];
		        	else if (d.data.name == 'pearson_neg')
		        		block_color = cellcolor[1];
		        	else if (d.data.name == 'spearman_pos')
		        		block_color = cellcolor[2];
		        	else if (d.data.name == 'spearman_neg')
		        		block_color = cellcolor[3];
		        	return block_color; })
		        .attr('stroke', '#ccc');
	    });

	// 绘制节点
	// const nodeRadius = 3;
	// svg.selectAll('.node')
	//     .data(nodePositions)
	//     .enter().append('circle')
	//     .attr('class', 'node')
	//     .attr('cx', d => d.x)
	//     .attr('cy', d => d.y)
	//     .attr('r', nodeRadius)
	//     .attr('fill', '#ccc');

	// 创建弧线连接节点
	const links = [];
	for (let i = 0; i < size; i++) {
	    for (let j = i + 1; j < size; j++) { // 只绘制上三角部分的边

		    if (parseFloat(mst_matrix[i][j]) > 0) {
		        links.push({ source: i, target: j ,weight: mst_matrix[i][j]});
		    }
	    }
	}

	// 绘制弧线
	svg.selectAll('.link')
	    .data(links)
	    .enter().append('path')
	    .attr('class', 'link')
	    .attr('d', (d) => {
		    const sourceNode = nodePositions[d.source];
		    const targetNode = nodePositions[d.target];

		    // 计算y坐标差值
		    const y1 = sourceNode.y;
		    const y2 = targetNode.y;
		    const r = Math.abs(y2 - y1) / 1; // 控制弧线的弯曲程度
		    const direction = y1 < y2 ? 1 : 0; // 控制弧线方向（根据y坐标的关系）

		    // 返回路径字符串
		    return `M${sourceNode.x},${y1} A${r},${r} 0 0,${direction} ${targetNode.x},${y2}`;
	    })
	    .attr('fill', 'none')
	    .attr('stroke', (d) => {
	    	return cellcolor[parseInt(d.weight)-1]})
	    .attr('stroke-width', 0.8);
}



function plotMatrix(adj_matrix, mst_matrix, treemap_data, svg){
    const size = adj_matrix.length;

	// 绘制矩阵的矩形单元格
	svg.selectAll('rect')
	    .data(() => {
	    let cells = [];
	    for (let i = 0; i < size; i++) {
	        for (let j = 0; j <= i; j++) { // 只绘制下三角部分
	        cells.push({ i, j, value: adj_matrix[i][j] });
	        }
	    }

	    return cells;
	    })
	    .enter().append('rect')
	    .attr('x', d => d.j * cellSize)
	    .attr('y', d => d.i * cellSize)
	    .attr('width', cellSize)
	    .attr('height', cellSize)
	    .attr('fill', d => {
	    	return cellcolor[Math.floor(parseFloat(d.value))-1];
	    })
	    .attr('opacity',d => d.value-Math.floor(d.value)+0.05)   // CHANGE: avoid 0 value
	    .attr('stroke', '#ccc');


	// draw triangular matrix
	plotTreemap(mst_matrix, treemap_data, size, svg);

	
}


export{
  plotMatrix,
}