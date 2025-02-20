import * as d3 from "d3";

function plotBarLine(container, transition_data) {
  let matrix_id = container.replace("matrix", "mtx");
  console.log("Matrix_id: ", matrix_id);
  console.log("Transition data: ", transition_data[matrix_id]);

  let dataset = transition_data[matrix_id];

  let margin = {
      top: 10,
      right: 20,
      bottom: 10,
      left: 10,
    },
    width = 41,
    height = 41;

  // 定义横轴（直接指定4个标签）
  let xScale = d3
    .scaleBand()
    .rangeRound([0, width])
    .padding(0.1)
    .domain(["pp", "pn", "sp", "sn"]);

  // 柱状图使用 d[2] 的数据
  let maxBar = d3.max(dataset, (d) => d[2]);
  let yScale = d3
    .scaleLinear()
    .rangeRound([height, 0])
    // 坐标轴最大值取 d[2] 的最大值，最小值固定为 -10
    .domain([-10, maxBar]);

  // 折线图与柱状图共用相同的比例尺（修改：yScale2范围设为[-1,1]）
  let yScale2 = d3.scaleLinear().rangeRound([height, 0]).domain([-1, 1]); // 修改点1：设置独立域

  let svg = d3
    .select("#" + container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  let g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // 绘制 x 轴（保持不变）
  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickSize(2).tickPadding(2))
    .selectAll("text")
    .style("text-anchor", "middle")
    .style("font-size", "5px")
    .style("fill", "lightgrey"); // Set the x-axis text color to red

  // Set the color of the x-axis line (the axis path) and ticks
  g.selectAll(".axis--x path").style("stroke", "lightgrey"); // Set the axis line color to red

  g.selectAll(".axis--x line").style("stroke", "lightgrey"); // Set the tick lines color to red

  // 绘制左侧 y 轴（柱状图对应，保持不变）
  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(yScale).ticks(4).tickSize(2).tickPadding(1))
    .selectAll("path") // 选择轴线
    .attr("stroke", "steelblue") // 设置轴线颜色
    .style("stroke-width", 1); // 设置轴线宽度
  // 绘制右侧 y 轴（使用新的独立域）
  g.append("g")
    .attr("class", "axis axis--y2")

    .attr("transform", "translate(" + width + ", 0)")
    .call(d3.axisRight(yScale2).ticks(4).tickSize(2).tickPadding(0))
    .selectAll("path") // 选择轴线
    .attr("stroke", "lightgrey") // 设置轴线颜色
    .style("stroke-width", 1); // 设置轴线宽度

  // 选择并设置刻度线的颜色
  g.selectAll(".axis--y line") // 选择两条轴的刻度线
    .attr("stroke", "steelblue") // 设置刻度线颜色
    .style("stroke-width", 1); // 设置刻度线宽度
  g.selectAll(".axis--y2 line") // 选择两条轴的刻度线
    .attr("stroke", "lightgrey") // 设置刻度线颜色
    .style("stroke-width", 1); // 设置刻度线宽度
  // 选择文本并设置字体大小
  g.selectAll("text")
    .style("font-size", "5px") // Set font size
    .style("fill", "lightgrey"); // Set font color to red

  // 绘制柱状图（保持不变）
  let bar = g.selectAll("rect").data(dataset).enter().append("g");

  let rect_w = 6;
  let rect_interval = 4;
  bar
    .append("rect")
    .attr("x", (d, i) => rect_w * i + rect_interval * (i + 1))
    .attr("y", (d) => yScale(d[2]))
    .attr("width", rect_w)
    .attr("height", (d) => height - yScale(d[2]))
    .attr("class", (d) => {
      let s = "bar ";
      if (d[2] < 400) {
        return s + "bar1";
      } else if (d[2] < 800) {
        return s + "bar2";
      } else {
        return s + "bar3";
      }
    });

  // 计算折线图数值（保持不变）
  const calcLineValue = (d) => Math.min(d[2] + 1.4, maxBar);

  // 绘制圆点（修改：使用yScale替代yScale2）
  // g.selectAll("circle")
  //   .data(dataset)
  //   .enter()
  //   .append("circle")
  //   .attr("class", "dot")
  //   .attr("cx", (d, i) => rect_w * i + rect_interval * (i + 1) + rect_w / 2)
  //   .attr("cy", (d) => yScale(calcLineValue(d))) // 修改点2：切换比例尺

  g.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")

    .attr("cx", (d, i) => rect_w * i + rect_interval * (i + 1) + rect_w / 2)
    .attr("cy", (d) => yScale(calcLineValue(d)))
    .attr("r", 1.8)
    .style("fill", "lightgrey"); // Set the fill color to blue

  // 绘制折线（修改：使用yScale替代yScale2）
  let line = d3
    .line()
    .x((d, i) => rect_w * i + rect_interval * (i + 1) + rect_w / 2)
    .y((d) => yScale(calcLineValue(d))) // 修改点3：切换比例尺
    .curve(d3.curveMonotoneX);

  g.append("path")
    .datum(dataset)
    .attr("class", "line")
    .attr("d", line)
    .style("stroke", "lightgrey")
    .attr("stroke-width", 1);
}

export { plotBarLine };
