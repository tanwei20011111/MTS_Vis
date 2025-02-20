import * as d3 from "d3";

// 'data': [ { type: 'A', occurrence: 5 }, { type: 'B', occurrence: 8 }, ... ]
function plotBar(div_container, data) {
  let y_max = 8; // CHANGE: normalize among multiple bar plots
  let margin = {
    top: 10,
    right: 8,
    bottom: 15,
    left: 8
  };
  let width = 132 - margin.left - margin.right;
  let height = 110 - margin.top - margin.bottom;

  // 在div中添加svg，并根据margin做整体平移
  let svg = d3
    .select("#" + div_container)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // x 轴比例尺：range注意预留左侧位置(这里从10开始)
  let x = d3
    .scaleBand()
    .range([10, width])
    .domain(
      data.map(function (d) {
        return d.type;
      })
    )
    .padding(0.2);

  // y 轴比例尺
  let y = d3.scaleLinear().domain([0, y_max]).range([height, 0]);

  const abbreviations = {
    pearson_pos: "pp",
    spearman_neg: "sn",
    spearman_pos: "sp",
  };
  // 添加 x 轴
  svg
    .append("g")
    .attr("class", "bar-x-axis")

    .attr("transform", "translate(0," + height + ")")
    .style("text-anchor", "end")
    .style("font-size", "8px")
    .call(
      d3
      .axisBottom(x)
      .tickFormat((d) => abbreviations[d])
      .tickSize(2)
      .tickPadding(1) // Map the original labels to abbreviations
    );

  // 添加 y 轴：将其放置在x轴左侧（这里x方向平移10，与x比例尺起点对应）
  svg
    .append("g")
    .attr("class", "bar-y-axis")

    .attr("transform", "translate(10,0)")
    .call(d3.axisLeft(y).ticks(5).tickSize(2).tickPadding(1))
    .selectAll("text")
    .style("font-size", "8px")
    .attr("transform", "rotate(-45)") // 旋转文本标签 45 度
    .style("text-anchor", "start") // 将文本对齐到起始位置
    .attr("transform", "translate(-10, 0) rotate(-45)"); // 向左平移 10 像素并旋转 45 度

  // 绘制柱状图
  let y_vals = data.map((d) => parseInt(d.occurrence, 10));
  svg
    .append("g")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.type);
    })
    .attr("y", function (d) {
      return y(d.occurrence);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.occurrence);
    })
    .attr("fill", function (d) {
      if (parseInt(d.occurrence, 10) === Math.max(...y_vals)) return "#ec9a9a";
      else return "#efcac4";
    })
    .on("mouseover", function (event, d) {
      console.log("柱状图数据: ", d.occurrence);
    });
  svg
    .selectAll("path, line") // Select all axis lines (path and line)
    .attr("stroke", "lightgrey"); // 设置轴线颜色
  svg
    .selectAll("text")
    .style("fill", "lightgrey")
    .style("font-size", "10px"); // Set font size; // Set font color to red // 设置轴线颜色; // Set font size
}

export {
  plotBar
};