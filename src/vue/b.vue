<template>
  <div
    class="card text-center border-light view"
    style="height: 720px; width: 1300px"
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
        <span style="margin-left: 10px; color: gray">Clustering: kmeans</span>
        <span style="margin-left: 20px; color: gray">Number:</span>
        <input type="text" placeholder="" class="input-field" />
      </div>

      <div style="margin-left: 20px; margin-top: 10px; color: gray">
        <span>Representative:</span>
        <label>
          <input
            type="checkbox"
            class="checkbox"
            v-model="selectedRepresentatives"
            value="MST"
          />
          MST
        </label>
        <label>
          <input
            type="checkbox"
            class="checkbox"
            v-model="selectedRepresentatives"
            value="top-k"
          />
          top-k
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
            height: 410px;
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

        <!-- Dynamically generated divs -->
        <div
          class="mbottom"
          style="
            width: 1280px;
            height: 180px;
            margin: 10px;
            border: 0px solid #aaa;
            position: absolute;
            top: 540px;
            left: 3px;

            display: flex;
          "
        >
          <!-- Loop to generate 6 divs -->
          <div
            v-for="i in 6"
            :key="'sub-matrix-' + i"
            :id="'sub-matrix-' + i"
            class="matrix-container"
            style="
              width: 190px;
              height: 100%;
              margin: 5px;
              border: 1px solid #fff;

              background-color: aquamarine;
            "
          >
            <!-- Content for each matrix container can go here -->
          </div>
          <div
            class="legend"
            style="width: 80px; height: 190px; margin-right: 5px"
          ></div>
        </div>
      </div>
      <!--ma-right-->
      <!-- <div class="ma-right"></div> -->
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
          linePos: 14,
          lineNeg: 0,
          NolinePos: 1,
          NolinNeg: 0,
        },
        {
          edge: "2_5",
          linePos: 2,
          lineNeg: 0,
          NolinePos: 13,
          NolinNeg: 0,
        },
        {
          edge: "1_3",
          linePos: 12,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 0,
        },
        {
          edge: "0_2",
          linePos: 4,
          lineNeg: 0,
          NolinePos: 11,
          NolinNeg: 0,
        },
        {
          edge: "1_5",
          linePos: 11,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 0,
        },
        {
          edge: "2_4",
          linePos: 4,
          lineNeg: 0,
          NolinePos: 11,
          NolinNeg: 0,
        },
        {
          edge: "4_5",
          linePos: 11,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 0,
        },
        {
          edge: "1_2",
          linePos: 2,
          lineNeg: 0,
          NolinePos: 12,
          NolinNeg: 1,
        },
        {
          edge: "3_4",
          linePos: 10,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 0,
        },
        {
          edge: "0_1",
          linePos: 9,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 0,
        },
        {
          edge: "0_4",
          linePos: 9,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 0,
        },
        {
          edge: "3_5",
          linePos: 9,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 0,
        },
        {
          edge: "0_3",
          linePos: 8,
          lineNeg: 0,
          NolinePos: 7,
          NolinNeg: 0,
        },
        {
          edge: "0_5",
          linePos: 7,
          lineNeg: 0,
          NolinePos: 8,
          NolinNeg: 0,
        },
        {
          edge: "2_3",
          linePos: 3,
          lineNeg: 0,
          NolinePos: 10,
          NolinNeg: 2,
        },
      ],

      stackData2: [
        {
          edge: "1_2",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 0,
          NolinNeg: 7,
        },
        {
          edge: "0_2",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 1,
        },
        {
          edge: "2_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 1,
        },
        {
          edge: "2_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 1,
          NolinNeg: 6,
        },
        {
          edge: "0_1",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 1,
          NolinNeg: 6,
        },
        {
          edge: "3_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 1,
          NolinNeg: 6,
        },
        {
          edge: "0_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 2,
        },
        {
          edge: "0_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 2,
        },
        {
          edge: "1_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 2,
          NolinNeg: 5,
        },
        {
          edge: "0_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 4,
        },
        {
          edge: "1_4",
          linePos: 3,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 0,
        },
        {
          edge: "2_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "3_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 4,
        },
        {
          edge: "1_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 4,
        },
        {
          edge: "4_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
      ],

      stackData3: [
        {
          edge: "0_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 7,
          NolinNeg: 0,
        },
        {
          edge: "1_4",
          linePos: 1,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 0,
        },
        {
          edge: "4_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 1,
        },
        {
          edge: "0_1",
          linePos: 2,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 0,
        },
        {
          edge: "3_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 2,
        },
        {
          edge: "0_5",
          linePos: 3,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 0,
        },
        {
          edge: "0_2",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "2_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "2_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "0_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 4,
        },
        {
          edge: "2_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "3_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "1_5",
          linePos: 1,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 1,
        },
        {
          edge: "1_2",
          linePos: 1,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 2,
        },
        {
          edge: "1_3",
          linePos: 1,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 3,
        },
      ],
      stackData4: [
        {
          edge: "1_4",
          linePos: 14,
          lineNeg: 0,
          NolinePos: 1,
          NolinNeg: 0,
        },
        {
          edge: "2_5",
          linePos: 2,
          lineNeg: 0,
          NolinePos: 13,
          NolinNeg: 0,
        },
        {
          edge: "1_3",
          linePos: 12,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 0,
        },
        {
          edge: "0_2",
          linePos: 4,
          lineNeg: 0,
          NolinePos: 11,
          NolinNeg: 0,
        },
        {
          edge: "1_5",
          linePos: 11,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 0,
        },
        {
          edge: "2_4",
          linePos: 4,
          lineNeg: 0,
          NolinePos: 11,
          NolinNeg: 0,
        },
        {
          edge: "4_5",
          linePos: 11,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 0,
        },
        {
          edge: "1_2",
          linePos: 2,
          lineNeg: 0,
          NolinePos: 12,
          NolinNeg: 1,
        },
        {
          edge: "3_4",
          linePos: 10,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 0,
        },
        {
          edge: "0_1",
          linePos: 9,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 0,
        },
        {
          edge: "0_4",
          linePos: 9,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 0,
        },
        {
          edge: "3_5",
          linePos: 9,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 0,
        },
        {
          edge: "0_3",
          linePos: 8,
          lineNeg: 0,
          NolinePos: 7,
          NolinNeg: 0,
        },
        {
          edge: "0_5",
          linePos: 7,
          lineNeg: 0,
          NolinePos: 8,
          NolinNeg: 0,
        },
        {
          edge: "2_3",
          linePos: 3,
          lineNeg: 0,
          NolinePos: 10,
          NolinNeg: 2,
        },
      ],

      stackData5: [
        {
          edge: "1_2",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 0,
          NolinNeg: 7,
        },
        {
          edge: "0_2",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 1,
        },
        {
          edge: "2_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 1,
        },
        {
          edge: "2_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 1,
          NolinNeg: 6,
        },
        {
          edge: "0_1",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 1,
          NolinNeg: 6,
        },
        {
          edge: "3_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 1,
          NolinNeg: 6,
        },
        {
          edge: "0_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 2,
        },
        {
          edge: "0_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 2,
        },
        {
          edge: "1_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 2,
          NolinNeg: 5,
        },
        {
          edge: "0_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 4,
        },
        {
          edge: "1_4",
          linePos: 3,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 0,
        },
        {
          edge: "2_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "3_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 4,
        },
        {
          edge: "1_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 4,
        },
        {
          edge: "4_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
      ],

      stackData6: [
        {
          edge: "0_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 7,
          NolinNeg: 0,
        },
        {
          edge: "1_4",
          linePos: 1,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 0,
        },
        {
          edge: "4_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 6,
          NolinNeg: 1,
        },
        {
          edge: "0_1",
          linePos: 2,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 0,
        },
        {
          edge: "3_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 2,
        },
        {
          edge: "0_5",
          linePos: 3,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 0,
        },
        {
          edge: "0_2",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "2_4",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "2_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "0_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 4,
        },
        {
          edge: "2_3",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "3_5",
          linePos: 0,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 3,
        },
        {
          edge: "1_5",
          linePos: 1,
          lineNeg: 0,
          NolinePos: 5,
          NolinNeg: 1,
        },
        {
          edge: "1_2",
          linePos: 1,
          lineNeg: 0,
          NolinePos: 4,
          NolinNeg: 2,
        },
        {
          edge: "1_3",
          linePos: 1,
          lineNeg: 0,
          NolinePos: 3,
          NolinNeg: 3,
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

      adj_matrix_file:
        "../static/data/HZ/vis_data/matrix_chart/adj_matrix_0.csv", // CHANGE, from 0
      adj_matrix_data: [],

      mst_matrix_file:
        "../static/data/HZ/vis_data/matrix_chart/mst_matrix_1.csv", // CHANGE, from 1
      mst_matrix_data: [],

      matrix_pos_file:
        "../static/data/HZ/vis_data/matrix_chart/matrix_coordinates_day1.json", // CHANGE
      matrix_pos_data: {},

      treemap_file: "../static/data/HZ/vis_data/matrix_chart/treemap_12.json", // CHANGE, from 0
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
      this.drawMatrix();
      this.bottominit();
    });
  },
  methods: {
    init() {
      this.drawMatrix();
      // this.drawTransNode();
    },

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
            "../static/data/HZ/vis_data/matrix_chart/adj_matrix_" +
            String(state_count) +
            ".csv";
          let mst_matrix_file =
            "../static/data/HZ/vis_data/matrix_chart/mst_matrix_" +
            String(state_count + 1) +
            ".csv";
          let tree_map_file =
            "../static/data/HZ/vis_data/matrix_chart/treemap_" +
            String(state_count) +
            ".json";

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
          let transition_file =
            "../static/data/HZ/vis_data/matrix_chart/transition_nodes.json";
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
      // Stack data definitions for each sub-matrix
      const stackDataList = [
        this.stackData, // Data for sub-matrix 1
        this.stackData2, // Data for sub-matrix 2
        this.stackData3, // Data for sub-matrix 3
        this.stackData4, // Data for sub-matrix 4
        this.stackData5, // Data for sub-matrix 5
        this.stackData6, // Data for sub-matrix 6
      ];

      // Keys to stack for all datasets
      const keys = ["linePos", "lineNeg", "NolinePos", "NolinNeg"];

      const margin = { top: 10, right: 5, bottom: 30, left: 30 };

      // Create a color scale based on the predefined colors array
      const colorScale = d3.scaleOrdinal().domain(keys).range(this.colors);

      // Loop through each sub-matrix and draw the stacked bar chart
      for (let i = 1; i <= 6; i++) {
        const container = d3.select(`#sub-matrix-${i}`);
        if (container.empty()) continue;

        // Clear the container content before re-rendering
        container.html("");

        // Set size for the SVG container
        const width = 150;
        const height = 160;

        // Append SVG to each container
        const svg = container
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        // Create stack function for the current data
        const stack = d3.stack().keys(keys);
        const stackedData = stack(stackDataList[i - 1]); // Use corresponding stackData

        // Set scales
        const xScale = d3
          .scaleLinear()
          .domain([0, d3.max(stackedData, (d) => d3.max(d, (d) => d[1]))])
          .range([0, width - margin.left - margin.right]);

        const yScale = d3
          .scaleBand()
          .domain(stackDataList[i - 1].map((d) => d.edge)) // Adjusted to use "edge" for each sub-matrix
          .range([height - margin.top - margin.bottom, 0])
          .padding(0.2);

        // Draw stacked bars for each sub-matrix
        svg
          .selectAll(".category")
          .data(stackedData)
          .enter()
          .append("g")
          .attr("fill", (d, i) => colorScale(keys[i])) // Use color scale for fill
          .selectAll("rect")
          .data((d) => d)
          .enter()
          .append("rect")
          .attr("x", (d) => xScale(d[0]))
          .attr("y", (d) => yScale(d.data.edge)) // Use edge for y-axis positioning
          .attr("width", (d) => xScale(d[1]) - xScale(d[0]))
          .attr("height", yScale.bandwidth());

        // Add x-axis
        svg
          .append("g")
          .style("opacity", 0.5)
          .attr("stroke-width", 0.7)
          .style("font", "8px Arial")
          .attr(
            "transform",
            `translate(0,${height - margin.top - margin.bottom})`
          )
          .call(d3.axisBottom(xScale).ticks(4));

        // Add y-axis with rotated labels
        svg
          .append("g")
          .style("opacity", 0.5)
          .attr("stroke-width", 0.7)
          .style("font", "8px Arial")
          .call(d3.axisLeft(yScale))
          .selectAll("text")
          // .attr("transform", "rotate(-45)") // Rotate labels by 45 degrees
          // // .attr("y", -15) // Adjust vertical position
          .attr("x", -yScale.bandwidth() / 2) // Adjust horizontal position
          .attr("dy", ".35em") // Fine-tune vertical alignment
          .style("text-anchor", "end"); // Right-align labels
      }

      // Add the legend inside the "mbottom" div
      const legendContainer = d3
        .select(".legend") // Select the mbottom container
        .append("div")
        .attr("class", "legend-container")

        .style("flex-wrap", "wrap") // Allow items to wrap onto new lines
        .style("gap", "5px") // Add some spacing between items
        .style("width", "160px"); // Ensure the legend fits in the container

      // Add color boxes to the legend
      const legend = legendContainer
        .selectAll(".legend")
        .data(keys)
        .enter()
        .append("div")
        .attr("class", "legend")
        .style("display", "flex")
        .style("align-items", "center")
        .style("font-size", "12px");

      // Create color boxes and labels for the legend
      legend
        .append("div")
        .style("width", "10px")
        .style("height", "10px")
        .style("background-color", (d) => colorScale(d))
        .style("margin-right", "5px");

      legend.append("span").text((d) => d);
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
