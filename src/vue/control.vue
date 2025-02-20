<template>
  <div
    class="card text-center border-light view"
    style="height: 100%; width: 100%"
  >
    <!--tan2.8 height: 800px; width: 300px-->
    <div class="card-header bg-light" style="height: 10px">
      <h6>Details View</h6>
      <input
        type="image"
        src="../static/data/icons/refresh.png"
        class="icon"
        style="top: 13px; right: 20px"
        @click="init"
      />
    </div>

    <!--     src与submit开始 -->
    <div class="input-group" style="margin-left: 3px">
      <!--     tan2.9:修改src字体 -->
      <label
        for="username"
        style="font-size: 15px; margin-top: 5px; color: lightgray"
        >Src:
      </label>

      <input
        type="text"
        style="
          height: 20px;
          width: 70px;
          margin-top: 8px;
          margin-left: 8px;
          text-align: center;
          color: lightgray;
        "
        value=""
        @change="handleSelectChange"
        required
      />
      <label
        for="username"
        style="font-size: 15px; margin-top: 5px; color: lightgray"
        >Tar:
      </label>

      <input
        type="text"
        style="
          height: 20px;
          width: 70px;
          margin-top: 8px;
          margin-left: 8px;
          color: lightgray;
        "
        placeholder=""
        required
      />
    </div>
    <!--     src与submit结束 -->
    <div class="row">
      <div class="col">
        <div class="view" id="pair_details" style="height: 100%; width: 100%">
          <!-- add sub-div -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { plotViolin } from "../static/js/plot_violin";
import { plotBar } from "../static/js/plot_bar";

import {
  csv_loader,
  series_file_loader,
  wgts_file_loader,
  json_loader,
} from "../static/js/lib/file_processor";

export default {
  name: "control",

  data() {
    return {
      bar_data_file: "../static/data/HZ/vis_data/bar_chart/bar_1_2.json", // CHANGE
      bar_data: [],
      sliderValue: 50, // 滑块当前值
      stepSize: 50, // 步长
      bar_data1: [
        { type: "pearson_pos", occurrence: 6 },
        { type: "spearman_neg", occurrence: 3 },
        { type: "spearman_pos", occurrence: 12 },
      ],
      bar_data2: [
        { type: "pearson_pos", occurrence: 3 },
        { type: "spearman_neg", occurrence: 8 },
        { type: "spearman_pos", occurrence: 10 },
      ],
      bar_data3: [
        { type: "pearson_pos", occurrence: 4 },
        { type: "spearman_neg", occurrence: 5 },
        { type: "spearman_pos", occurrence: 12 },
      ],
      bar_data4: [
        { type: "pearson_pos", occurrence: 6 },
        { type: "spearman_neg", occurrence: 3 },
        { type: "spearman_pos", occurrence: 12 },
      ],
      bar_data5: [
        { type: "pearson_pos", occurrence: 6 },
        { type: "spearman_neg", occurrence: 6 },
        { type: "spearman_pos", occurrence: 9 },
      ],
    };
  },

  computed: {
    sliderStyle() {
      return {
        background: `linear-gradient(to right, #4682B4 ${this.sliderValue}%, #ddd ${this.sliderValue}%)`,
      };
    },
    stepSizeStyle() {
      return {
        background: `linear-gradient(to right, #4682B4 ${this.stepSize}%, #ddd ${this.stepSize}%)`,
      };
    },
  },

  created() {
    // json_loader(this.bar_data_file, (data) => {
    //   this.bar_data = data;
    //   this.plotPairDetails();
    // });
  },

  methods: {
    handleSelectChange() {
      console.log("12");
      json_loader(this.bar_data_file, (data) => {
        this.bar_data = data;
        this.plotPairDetails();
      });
    },
    init() {
      this.plotPairDetails();
    },

    plotPairDetails() {
      let that = this;
      let numSubDivs = 5; // CHANGE
      let div_container = d3.select("#pair_details");

      // sub-div for each pair of vars
      div_container
        .selectAll(".pair-div")
        .data(d3.range(numSubDivs))
        .enter()
        .append("div")
        .attr("class", "view pair-div")
        .attr("id", (d, i) => {
          return "pair_div" + i;
        });

      // draw pair details
      for (let i = 0; i < numSubDivs; i++) {
        // add pair label
        const parentDiv = document.getElementById("pair_div" + i);
        const span = document.createElement("span");
        span.classList.add("pair-label");
        span.textContent = "0_" + (i + 1);
        span.style.fontSize = "12px";
        span.style.color = "lightgray";
        span.style.position = "absolute";
        span.style.left = "0px";
        span.style.top = "30%";
        span.style.transform = "translateY(-50%) rotate(-90deg)";
        span.style.display = "inline-block";
        span.style.width = "30px";
        parentDiv.style.position = "relative";
        parentDiv.appendChild(span);
        // plot strength distribution

        switch (i) {
          case 0:
            plotViolin("pair_div" + i, "static/data/violin/violin_0_1.csv");
            break;
          case 1:
            plotViolin("pair_div" + i, "static/data/violin/violin_0_2.csv");
            break;
          case 2:
            plotViolin("pair_div" + i, "static/data/violin/violin_0_3.csv");
            break;
          case 3:
            plotViolin("pair_div" + i, "static/data/violin/violin_0_4.csv");
            break;
          case 4:
            plotViolin("pair_div" + i, "static/data/violin/violin_0_5.csv");
            break;
          default:
        }

        // // plot type distribution
        // plotViolin("pair_div" + i, violin_data);

        // plot strength distribution
        let bar_data;
        switch (i) {
          case 0:
            bar_data = that.bar_data1;
            break;
          case 1:
            bar_data = that.bar_data2;
            break;
          case 2:
            bar_data = that.bar_data3;
            break;
          case 3:
            bar_data = that.bar_data4;
            break;
          case 4:
            bar_data = that.bar_data5;
            break;
          default:
            bar_data = that.bar_data;
        }

        plotBar("pair_div" + i, bar_data);
      }
    },

    plotTsne() {
      let that = this;
      let wgt_matrix = Object.values(that.weight_data);

      // -> transpose
      const transposed_matrix = [];
      for (let i = 0; i < wgt_matrix[0].length; i++) {
        transposed_matrix[i] = [];
      }

      for (let i = 0; i < wgt_matrix.length; i++) {
        for (let j = 0; j < wgt_matrix[0].length; j++) {
          transposed_matrix[j][i] = wgt_matrix[i][j];
        }
      }

      let features = transposed_matrix;
      let container = "tsne";
      plotTsne(features, container);
    },
  },
};
</script>

<style scoped>
/* 通用滑动条样式 */
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
  margin: 8px 0;
}

/* 滑块样式 */
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: #4682b4; /* 钢铁蓝 */
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: #4682b4; /* 钢铁蓝 */
  cursor: pointer;
}

input[type="range"]::-ms-thumb {
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: #4682b4; /* 钢铁蓝 */
  cursor: pointer;
}
</style>
