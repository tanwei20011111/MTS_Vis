import * as d3 from "d3";

function plotViolin(container) {
    // 设置图形的尺寸和边距
    const margin = {
            top: 10,
            right: 0,
            bottom: 20,
            left: 4
        },
        width = 142 - margin.left - margin.right,
        height = 120 - margin.top - margin.bottom;

    // 在指定容器中添加 svg 元素，并添加一个整体平移组（考虑边距）
    const svg = d3
        .select("#" + container)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // 读取 CSV 数据文件
    d3.csv("static/data/violin_data1_test.csv", function (violin_data) {
        // d3.csv("static/data/HZ/vis_data/violin_chart/violin_1_2.csv", function (violin_data) {
        // 构建 Y 轴比例尺，设置数据范围为[-1,1]
        const y = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

        // 添加 Y 轴（左侧），并进行适当的平移调整
        svg
            .append("g")
            .style("opacity", 0.5)
            .attr("stroke-width", 0.7)
            .style("font", "8px Arial")
            .call(
                d3
                .axisLeft(y)
                .tickValues(d3.range(-1, 1.1, 0.5))
                .tickFormat(d3.format(".1f")).tickSize(2)
            )
            .attr("transform", "translate(20,0)")
            .selectAll("text") // 选择 y 轴上的所有文本标签
            .attr("transform", "rotate(-45)") // 旋转文本标签 45 度
            .style("text-anchor", "start") // 将文本对齐到起始位置
            .attr("transform", "translate(-10, 0) rotate(-45)"); // 向左平移 10 像素并旋转 45 度

        // 构建 X 轴比例尺（类别型比例尺）
        const x = d3
            .scaleBand()
            .range([0, width - 40])
            .domain(["pearson", "spearman", "kendall"])
            .padding(0.2); //调整x轴间距

        const abbreviations = {
            pearson: "Ps",
            spearman: "Sp",
            kendall: "Kd",
        };
        // 添加 X 轴（下侧），并进行位置微调
        svg
            .append("g")
            .style("opacity", 0.5)
            .attr("stroke-width", 0.7)
            .style("font", "8px Arial")
            .attr("transform", "translate(20," + height + ")")
            .call(
                d3.axisBottom(x).tickFormat((d) => abbreviations[d]).tickSize(2).tickPadding(1) // Map the original labels to abbreviations
            );

        // 定义直方图函数，用于计算每个组内的分箱
        const histogram = d3
            .histogram()
            .domain(y.domain())
            .thresholds(y.ticks(20))
            .value((d) => d);

        // 按照 metric 分组，并计算各组的直方图数据
        const sumstat = d3
            .nest()
            .key((d) => d.metric)
            .rollup(function (d) {
                const input = d.map((g) => parseFloat(g.val));
                const bins = histogram(input);
                return bins;
            })
            .entries(violin_data);

        // 找到所有分箱中的最大计数，用于确定 violin 图的宽度比例
        let maxNum = 0;
        sumstat.forEach((group) => {
            const groupMax = d3.max(group.value.map((a) => a.length));
            if (groupMax > maxNum) {
                maxNum = groupMax;
            }
        });

        // 定义水平比例尺，用于将计数值映射为像素（宽度）
        const xNum = d3
            .scaleLinear()
            .range([0, x.bandwidth()])
            .domain([-maxNum, maxNum]);

        // 添加 violin 图形，并利用 x 比例尺定位每个分组
        svg
            .selectAll("myViolin")
            .data(sumstat)
            .enter()
            .append("g")
            // 使用 x(d.key) 来定位每个 violin，并额外偏移 20 像素
            .attr("transform", function (d) {
                return "translate(" + (x(d.key) + 20) + ",0)";
            })
            .append("path")
            .datum((d) => d.value)
            .style("stroke", "none")
            .style("fill", "#B0C4B1")
            .attr(
                "d",
                d3
                .area()
                .x0((d) => xNum(-d.length))
                .x1((d) => xNum(d.length))
                .y((d) => y(d.x0))
                .curve(d3.curveCatmullRom)
            );

        // 添加带抖动的单个数据点
        const trans_x = 10;
        const jitterWidth = 10;
        svg
            .selectAll("indPoints")
            .data(violin_data)
            .enter()
            .append("circle")
            .attr("class", "indPoints")
            .attr("cx", function (d) {
                // 根据 metric 定位，并额外加上抖动及偏移
                return x(d.metric) - jitterWidth / 2 + Math.random() * jitterWidth + 20;
            })
            .attr("cy", (d) => y(parseFloat(d.val)))
            .attr("r", 0)
            .attr("transform", "translate(" + trans_x + ",0)")
            .style("fill", "black")
            .attr("stroke", "black");

        // 如需添加 box plot 部分，可将相应代码取消注释并根据需求进行调整
    });
}

export {
    plotViolin
};