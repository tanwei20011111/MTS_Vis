<template>
  <div
    class="card text-center border-light view"
    style="height: 725px; width: 1300px"
  >
    <div class="card-header bg-light">
      <h6>Dynamics View</h6>
      <input
        type="image"
        src="../static/data/icons/refresh.png"
        class="icon"
        style="top: 13px; right: 20px"
        @click="init"
      />
    </div>
    <div class="ma-head">
      <div style="margin-top: 10px">
        <p
          style="
            margin-left: 10px;
            color: #aaa;
            font-weight: normal;
            display: inline;
            font-size: 15px;
          "
        >
          clustering:
        </p>
        <select
          style="
            margin-left: 10px;
            font-size: 14px;
            color: #aaa;
            border: 0.5px solid lightgrey; /* 边框粗细和颜色 */
            border-radius: 10px; /* 边框弧度 */
          "
        >
          <option value="" disabled selected hidden>please select</option>
          <option value="option1">k-means</option>
          <option value="option2">dbscan</option>
        </select>
        <p
          style="
            margin-left: 20px;
            color: #aaa;
            font-size: 14px;
            display: inline;
          "
        >
          k:
        </p>
        <input
          type="text"
          value=""
          style="color: lightgrey"
          class="input-field"
        />
      </div>

      <div
        style="
          margin-left: 20px;
          margin-top: 10px;
          color: #aaa;
          font-size: 15px;
        "
      >
        <p style="display: inline">skeleton:</p>
        <label>
          <input
            type="checkbox"
            class="checkbox"
            v-model="selectedRepresentatives"
            value="MST"
            @change="handleSelectChange"
          />
          mst
        </label>
        <label>
          <input type="checkbox" class="checkbox" value="top-k" />
          filtering
        </label>
      </div>
    </div>

    <!-- number input field outside ma-head -->
    <!--ma-main-->
    <div class="ma-main">
      <!--ma-left-->
      <div class="row">
        <div
          style="
            width: 1280px;
            height: 390px;
            margin: 10px;
            border: 0px solid #aaa;
            position: absolute;
            top: 130px;
            left: 3px;
            /* background-color: aquamarine; */
          "
          id="matrix_div"
          class="div-scroll"
        >
          <!-- <svg id="matrix1" width="800" height="800"></svg> -->
        </div>
        <div
          style="
            width: 1380px;
            height: 40px;
            margin-top: 470px;

            border: 1px solid rgba(209, 213, 232, 0.4);
            border-radius: 3px;

            /* background-color: aqua; */
          "
        >
          <div
            class="legend1"
            style="
              width: 100%;
              height: 100%;
              margin-left: 510px;
              margin-top: 10px;
              /* background-color: aqua; */
            "
          ></div>
        </div>
        <!-- Dynamically generated divs -->
        <div
          style="
            width: 1380px;
            height: 160px;

            margin-top: 60px;
            position: absolute;
            top: 520px;

            display: flex;
            /* border: 1px solid rgba(209, 213, 232, 0.4);
            border-radius: 3px; */
          "
        >
          <!-- Loop to generate 6 divs -->
          <div
            v-for="i in 6"
            :key="'sub-matrix-' + i"
            :id="'sub-matrix-' + i"
            class="matrix-container"
            style="
              width: 253px;
              height: 120px;
              margin: 5px;
              border: 1px solid #fff;
            "
          >
            <!-- Content for each matrix container can go here -->
          </div>
        </div>
      </div>
      <!--ma-right-->
    </div>
  </div>
</template>
<script>
import * as d3 from "d3";
import { request, post_request } from "../network/request";
import { plotMatrix } from "../static/js/plot_matrix";
import { plotBarLine } from "../static/js/plot_barline";
import {
  csv_loader,
  json_loader,
  series_file_loader,
  wgts_file_loader,
} from "../static/js/lib/file_processor";

export default {
  name: "matrix",

  data() {
    return {
      stackData: [
        {
          edge: "1_4",
          pp: 14,
          pn: 0,
          sp: 1,
          sn: 0,
        },
        {
          edge: "2_5",
          pp: 2,
          pn: 0,
          sp: 13,
          sn: 0,
        },
        {
          edge: "1_3",
          pp: 12,
          pn: 0,
          sp: 3,
          sn: 0,
        },
        {
          edge: "0_2",
          pp: 4,
          pn: 0,
          sp: 11,
          sn: 0,
        },
        {
          edge: "1_5",
          pp: 11,
          pn: 0,
          sp: 4,
          sn: 0,
        },
        {
          edge: "2_4",
          pp: 4,
          pn: 0,
          sp: 11,
          sn: 0,
        },
        {
          edge: "4_5",
          pp: 11,
          pn: 0,
          sp: 4,
          sn: 0,
        },
        {
          edge: "1_2",
          pp: 2,
          pn: 0,
          sp: 12,
          sn: 1,
        },
        {
          edge: "3_4",
          pp: 10,
          pn: 0,
          sp: 5,
          sn: 0,
        },
        {
          edge: "0_1",
          pp: 9,
          pn: 0,
          sp: 6,
          sn: 0,
        },
        {
          edge: "0_4",
          pp: 9,
          pn: 0,
          sp: 6,
          sn: 0,
        },
        {
          edge: "3_5",
          pp: 9,
          pn: 0,
          sp: 6,
          sn: 0,
        },
        {
          edge: "0_3",
          pp: 8,
          pn: 0,
          sp: 7,
          sn: 0,
        },
        {
          edge: "0_5",
          pp: 7,
          pn: 0,
          sp: 8,
          sn: 0,
        },
        {
          edge: "2_3",
          pp: 3,
          pn: 0,
          sp: 10,
          sn: 2,
        },
      ],

      stackData2: [
        {
          edge: "1_2",
          pp: 0,
          pn: 0,
          sp: 0,
          sn: 7,
        },
        {
          edge: "0_2",
          pp: 0,
          pn: 0,
          sp: 6,
          sn: 1,
        },
        {
          edge: "2_3",
          pp: 0,
          pn: 0,
          sp: 6,
          sn: 1,
        },
        {
          edge: "2_4",
          pp: 0,
          pn: 0,
          sp: 1,
          sn: 6,
        },
        {
          edge: "0_1",
          pp: 0,
          pn: 0,
          sp: 1,
          sn: 6,
        },
        {
          edge: "3_4",
          pp: 0,
          pn: 0,
          sp: 1,
          sn: 6,
        },
        {
          edge: "0_3",
          pp: 0,
          pn: 0,
          sp: 5,
          sn: 2,
        },
        {
          edge: "0_4",
          pp: 0,
          pn: 0,
          sp: 5,
          sn: 2,
        },
        {
          edge: "1_3",
          pp: 0,
          pn: 0,
          sp: 2,
          sn: 5,
        },
        {
          edge: "0_5",
          pp: 0,
          pn: 0,
          sp: 3,
          sn: 4,
        },
        {
          edge: "1_4",
          pp: 3,
          pn: 0,
          sp: 4,
          sn: 0,
        },
        {
          edge: "2_5",
          pp: 0,
          pn: 0,
          sp: 4,
          sn: 3,
        },
        {
          edge: "3_5",
          pp: 0,
          pn: 0,
          sp: 3,
          sn: 4,
        },
        {
          edge: "1_5",
          pp: 0,
          pn: 0,
          sp: 3,
          sn: 4,
        },
        {
          edge: "4_5",
          pp: 0,
          pn: 0,
          sp: 4,
          sn: 3,
        },
      ],

      stackData3: [
        {
          edge: "0_4",
          pp: 0,
          pn: 0,
          sp: 7,
          sn: 0,
        },
        {
          edge: "1_4",
          pp: 1,
          pn: 0,
          sp: 6,
          sn: 0,
        },
        {
          edge: "4_5",
          pp: 0,
          pn: 0,
          sp: 6,
          sn: 1,
        },
        {
          edge: "0_1",
          pp: 2,
          pn: 0,
          sp: 5,
          sn: 0,
        },
        {
          edge: "3_4",
          pp: 0,
          pn: 0,
          sp: 5,
          sn: 2,
        },
        {
          edge: "0_5",
          pp: 3,
          pn: 0,
          sp: 4,
          sn: 0,
        },
        {
          edge: "0_2",
          pp: 0,
          pn: 0,
          sp: 4,
          sn: 3,
        },
        {
          edge: "2_4",
          pp: 0,
          pn: 0,
          sp: 4,
          sn: 3,
        },
        {
          edge: "2_5",
          pp: 0,
          pn: 0,
          sp: 4,
          sn: 3,
        },
        {
          edge: "0_3",
          pp: 0,
          pn: 0,
          sp: 3,
          sn: 4,
        },
        {
          edge: "2_3",
          pp: 0,
          pn: 0,
          sp: 4,
          sn: 3,
        },
        {
          edge: "3_5",
          pp: 0,
          pn: 0,
          sp: 4,
          sn: 3,
        },
        {
          edge: "1_5",
          pp: 1,
          pn: 0,
          sp: 5,
          sn: 1,
        },
        {
          edge: "1_2",
          pp: 1,
          pn: 0,
          sp: 4,
          sn: 2,
        },
        {
          edge: "1_3",
          pp: 1,
          pn: 0,
          sp: 3,
          sn: 3,
        },
      ],
      stackData4: [
        {
          edge: "0_1",
          pp: 0,
          pn: 0,
          sp: 4,
          sn: 0,
        },
        {
          edge: "0_4",
          pp: 1,
          pn: 0,
          sp: 3,
          sn: 0,
        },
        {
          edge: "1_3",
          pp: 3,
          pn: 0,
          sp: 1,
          sn: 0,
        },
        {
          edge: "1_4",
          pp: 3,
          pn: 0,
          sp: 1,
          sn: 0,
        },
        {
          edge: "3_4",
          pp: 3,
          pn: 0,
          sp: 1,
          sn: 0,
        },
        {
          edge: "0_5",
          pp: 1,
          pn: 0,
          sp: 3,
          sn: 0,
        },
        {
          edge: "4_5",
          pp: 1,
          pn: 0,
          sp: 3,
          sn: 0,
        },
        {
          edge: "0_2",
          pp: 0,
          pn: 0,
          sp: 2,
          sn: 2,
        },
        {
          edge: "1_5",
          pp: 2,
          pn: 0,
          sp: 2,
          sn: 0,
        },
        {
          edge: "2_5",
          pp: 0,
          pn: 0,
          sp: 2,
          sn: 2,
        },
        {
          edge: "0_3",
          pp: 1,
          pn: 0,
          sp: 2,
          sn: 1,
        },
        {
          edge: "1_2",
          pp: 1,
          pn: 0,
          sp: 1,
          sn: 2,
        },
        {
          edge: "2_3",
          pp: 1,
          pn: 0,
          sp: 1,
          sn: 2,
        },
        {
          edge: "2_4",
          pp: 1,
          pn: 0,
          sp: 1,
          sn: 2,
        },
        {
          edge: "3_5",
          pp: 2,
          pn: 0,
          sp: 1,
          sn: 1,
        },
      ],

      stackData5: [
        {
          edge: "0_1",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "0_2",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "0_3",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "0_4",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "0_5",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "1_2",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "1_3",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "1_4",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "1_5",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "2_4",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "2_5",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "3_4",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "3_5",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "4_5",
          pp: 1,
          pn: 0,
          sp: 0,
          sn: 0,
        },
        {
          edge: "2_3",
          pp: 0,
          pn: 0,
          sp: 1,
          sn: 0,
        },
      ],

      colors: [
        "#94CAC1", //line-pos
        "#F5F6BA", //line-neg
        "#C2BFD7", //noline-pos
        "#EB8F83", //noline-neg

        // "hsl(0, 70%, 70%)", // 红色
        // "hsl(30, 70%, 70%)", // 橙色
        // "hsl(60, 70%, 70%)", // 黄色
        // "hsl(120, 70%, 70%)", // 绿色
        // "hsl(180, 70%, 70%)", // 青色
        // "hsl(240, 70%, 70%)", // 蓝色
        // "hsl(300, 70%, 70%)", // 紫色
      ],

      // 新增的选项绑定
      selectedRepresentatives: [], // 选中的复选框值

      adj_matrix_file: "../static/data2/adj_matrix_0.csv", // CHANGE, from 0
      adj_matrix_data: [],

      mst_matrix_file: "../static/data2/mst_matrix_1.csv", // CHANGE, from 1
      mst_matrix_data: [],

      matrix_pos_file: "../static/data2/matrix_coordinates_day1.json", // CHANGE
      matrix_pos_data: {},

      treemap_file: "../static/data2/treemap_12.json", // CHANGE, from 0
      treemap_data: [],
    };
  },

  props: ["seriesData"],

  created() {
    csv_loader(this.adj_matrix_file, (data) => {
      this.adj_matrix_data = data;
    });
    csv_loader(this.mst_matrix_file, (data) => {
      this.mst_matrix_data = data;
    });
    json_loader(this.treemap_file, (data) => {
      this.treemap_data = data;
    });
    json_loader(this.matrix_pos_file, (data) => {
      this.matrix_pos_data = data;
    });
  },
  methods: {
    handleSelectChange() {
      console.log("12");
      this.drawMatrix();
      this.drawMatrix();
      this.bottominit();
    },
    // init() {
    //   this.drawMatrix();
    //   // this.drawTransNode();
    // },

    drawMatrix() {
      let that = this;
      let matrix_w = 62,
        matrix_h = 60; // CHANGE: be smaller than 'delta'
      let delta_r = 80,
        delta_c = 100; // CHANGE

      let adj_matrix = that.adj_matrix_data;
      let mst_matrix = that.mst_matrix_data;
      let treemap_data = that.treemap_data;
      let matrix_pos = that.matrix_pos_data;
      let num_matrix = Object.keys(matrix_pos).length;

      let state_count = 0;

      for (let i = 0; i < num_matrix; i++) {
        let matrix_type = matrix_pos["mtx" + i]["type"];
        let row = matrix_pos["mtx" + i]["pos"][0];
        let col = matrix_pos["mtx" + i]["pos"][1];
        // console.log('row: ', row, 'col: ', col);

        // add div for each matrix
        const container = document.getElementById("matrix_div");
        const subDiv = document.createElement("div");
        subDiv.id = "sub_matrix_div" + i;
        container.appendChild(subDiv);
        // set div style
        subDiv.style.position = "absolute";
        subDiv.style.top = row * delta_r + "px";
        subDiv.style.left = col * delta_c + "px";
        subDiv.style.border = "red";

        // add svg for each matrix
        d3.select("#sub_matrix_div" + i)
          .append("svg")
          .attr("id", "matrix" + i)
          .attr("width", matrix_w)
          .attr("height", matrix_h);
        // .attr("transform", "translate("+col*delta_c+","+row*delta_r+")");

        const svg = d3.select("#matrix" + i);
        // add white background to cover part of the timeline
        svg
          .append("rect")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("stroke", "lightgrey")
          .attr("stroke-width", 1)
          .attr("fill", "white");

        if (matrix_type == "state") {
          let adj_matrix_file =
            "../static/data2/adj_matrix_" + String(state_count) + ".csv";
          let mst_matrix_file =
            "../static/data2/mst_matrix_" + String(state_count + 1) + ".csv";
          let tree_map_file =
            "../static/data2/treemap_" + String(state_count) + ".json";

          d3.csv(adj_matrix_file, function (adj_matrix) {
            d3.csv(mst_matrix_file, function (mst_matrix) {
              d3.json(tree_map_file, function (treemap_data) {
                plotMatrix(adj_matrix, mst_matrix, treemap_data, svg);
              });
            });
          });
          state_count++;
        } else {
          // HERE === load data for each 'transition' matrix
          let transition_file = "../static/data2/transition_nodes.json";
          d3.json(transition_file, function (transition_data) {
            plotBarLine("matrix" + i, transition_data);
          });
        }
      }

      // add timeline connecting matrices
      let point_pos = [];
      for (let i = 0; i < num_matrix; i++) {
        point_pos.push(matrix_pos["mtx" + i]["pos"]);
      }

      let timeline_svg = d3
        .select("#matrix_div")
        .append("svg")
        .attr("id", "timeline")
        .attr("width", 5600)
        .attr("height", 800); // CHANGE: same with 'matrix_div', 'width' should be large enough to cover area of x-overflow
      let timeline_g = timeline_svg
        .selectAll("rect")
        .data(point_pos)
        .enter()
        .append("g")
        .attr("transform", "translate(" + 3 + "," + 30 + ")"); // CHANGE: trans_x same with 'matrix_div' left
      let line = d3
        .line()
        .x(function (d) {
          return d[1] * delta_c;
        })
        .y(function (d) {
          return d[0] * delta_r;
        })
        .curve(d3.curveMonotoneX);

      timeline_g
        .append("path")
        .attr("class", "timeline")
        .attr("stroke", "grey")
        .attr("stroke-width", 1.5)
        .attr("fill", "transparent")
        .attr("d", line(point_pos));

      timeline_g
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) {
          return d[1] * delta_c;
        })
        .attr("cy", function (d) {
          return d[0] * delta_r;
        })
        .attr("r", 2);
    },

    // add explanation node for cluster transition
    drawTransNode() {
      let that = this;
      let matrix_w = 60,
        matrix_h = 60; // CHANGE: be smaller than 'delta'
      let delta_r = 80,
        delta_c = 80; // CHANGE

      d3.select("#matrix_div")
        .append("svg")
        .attr("id", "matrix5")
        .attr("width", matrix_w)
        .attr("height", matrix_h)
        .attr("transform", "translate(" + delta_c + "," + 0 * delta_r + ")");

      // const svg = d3.select("matrix5");
    },
    bottominit() {
      const stackDataList = [
        this.stackData,
        this.stackData2,
        this.stackData3,
        this.stackData4,
        this.stackData5,
      ];

      const keys = ["pp", "pn", "sp", "sn"];
      const margin = { top: 10, right: 5, bottom: 40, left: 30 }; // Increased bottom margin

      const colorScale = d3.scaleOrdinal().domain(keys).range(this.colors);

      // Clear the content of the legend1 div
      const legendContainer = d3.select(".legend1");

      legendContainer.html(""); // Clear previous legends

      // Create legends with squares and text beside them
      keys.forEach((key, index) => {
        const legendItem = legendContainer
          .append("div")
          .style("display", "inline-flex") // Inline-flex to align square and text horizontally
          .style("margin-right", "20px") // Space between legends
          .style("font-size", "12px") // Set font size
          .style("color", "lightgrey");

        // Create a square for each legend
        legendItem
          .append("div")
          .style("width", "15px")
          .style("height", "15px")
          .style("background-color", colorScale(key)) // Color of the square
          .style("margin-right", "10px"); // Space between the square and the text

        // Add text next to the square
        legendItem.append("span").text(key);
      });

      for (let i = 1; i <= 6; i++) {
        const container = d3.select(`#sub-matrix-${i}`);
        if (container.empty()) continue;
        container.html(""); // Clear previous content

        const width = 240;
        const height = 140;

        const svg = container
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create stacked data
        const stack = d3.stack().keys(keys);
        const stackedData = stack(stackDataList[i - 1]);

        // Adjust scale
        const xScale = d3
          .scaleBand()
          .domain(stackDataList[i - 1].map((d) => d.edge))
          .range([0, width - margin.left - margin.right])
          .padding(0.6); // X-axis padding

        const yScale = d3
          .scaleLinear()
          .domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))])
          .range([height - margin.top - margin.bottom, 0]);

        // Draw stacked bars
        svg
          .selectAll(".category")
          .data(stackedData)
          .enter()
          .append("g")
          .attr("fill", (d, i) => colorScale(keys[i]))
          .selectAll("rect")
          .data((d) => d)
          .enter()
          .append("rect")
          .attr("x", (d) => xScale(d.data.edge)) // X-axis uses categorical data
          .attr("y", (d) => yScale(d[1])) // Y-axis starting point uses the upper value
          .attr("width", 8) // Bar width
          .attr("height", (d) => yScale(d[0]) - yScale(d[1])); // Height calculated by the difference

        // Add X-axis (categorical axis)
        svg
          .append("g")

          .attr(
            "transform",
            `translate(0,${height - margin.top - margin.bottom})`
          )
          .call(d3.axisBottom(xScale))
          .selectAll("text")
          .attr("transform", "rotate(-45)")
          .style("text-anchor", "end")
          .attr("dx", "-0.5em")
          .attr("dy", "0.15em")

          .style("font", "6px Arial");

        // Add Y-axis (value axis)
        svg
          .append("g")
          .call(d3.axisLeft(yScale).ticks(4))

          .style("font", "10px Arial");
        svg
          .selectAll("path, line") // Select all axis lines (path and line)
          .attr("stroke", "lightgrey"); // 设置轴线颜色
        svg
          .selectAll("text")

          .style("fill", "lightgrey")
          .style("font-size", "8px"); // Set font size; // Set font color to red // 设置轴线颜色; // Set font size
      }
    },
  },
};
</script>

<style>
.ma-main {
  width: 1270px;
  height: 680px;
  /* background-color: blanchedalmond; */
  display: flex;
}

.ma-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 3px; /* Further reduced padding */
  height: 40px; /* Reduced height for more compactness */
  width: 1170px;
  padding-top: 25px;
}
.ma-right {
  width: 210px;
  height: 640px;
  background-color: red;
  margin-left: 1120px;
}

.ma-head span {
  margin-right: 6px; /* Further reduced margin */
  font-weight: bold;
  font-size: 14px; /* Slightly smaller font */
}

.input-field {
  padding: 3px; /* Further reduced padding */
  width: 80px; /* Reduced width */
  margin-left: 5px; /* Reduced margin */
  font-size: 12px; /* Smaller font for a more compact input box */
}

label {
  margin-left: 8px; /* Reduced space between radio buttons */
  margin-top: 10px;
  font-size: 15px; /* Smaller font size */
}

.number-field {
  margin-top: 3px; /* Reduced top margin */
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.number-field span {
  margin-right: 6px; /* Reduced margin */
  font-weight: bold;
  font-size: 14px; /* Consistent smaller font size */
}
.radio {
  margin-top: 25px;
}
input[type="checkbox"] {
  pointer-events: auto; /* 确保可以交互 */
}
/* 添加样式确保图表可见 */
.matrix-container {
  background-color: white !important; /* 覆盖原有的水绿色背景 */
  padding: 5px;
}

.matrix-container svg {
  display: block;
}
</style>
