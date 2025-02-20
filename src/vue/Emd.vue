<template>
  <div
    class="card text-center border-light view"
    style="height: 100%; width: 100%"
  >
    <div class="card-header bg-light">
      <h6>Embedding View</h6>
      <input
        type="image"
        src="../static/data/icons/refresh.png"
        class="icon"
        style="top: 13px; right: 20px"
        @click="init"
      />
    </div>

    <div class="emd-main">
      <!-- Input Box for Sliding Window -->
      <div class="slide" style="width: 100%; height: 25%; padding: 2px">
        <!-- 文字与输入框放在一行 -->
        <div
          class="input-container"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <!-- 文字 -->
          <p
            style="
              margin-bottom: 2px;
              font-size: 15px;
              color: lightgrey;
              position: relative;
              z-index: 1;
              margin-left: 10px;
            "
          >
            window size:
          </p>

          <!-- 输入框 -->
          <div
            class="input-wrapper"
            style="position: relative; flex: 1; margin-left: 5px"
          >
            <input
              type="number"
              v-model="sliderValue"
              min="0"
              max="100"
              class="input-field"
              style="
                border-radius: 3px;
                color: lightgrey;
                border-color: lightgrey;
                margin-right: 1px;
              "
            />
          </div>
        </div>

        <!-- 第二行 -->
        <div
          class="input-container"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <!-- 文字 -->
          <p
            style="
              margin-bottom: 2px;
              margin-left: 10px;
              font-size: 15px;
              color: lightgrey;
              margin-top: 2px;
              position: relative;
              z-index: 1;
            "
          >
            step size:
          </p>

          <!-- 输入框 -->
          <div
            class="input-wrapper"
            style="position: relative; flex: 1; margin-left: 5px"
          >
            <input
              type="number"
              v-model="stepSize"
              min="0"
              max="100"
              class="input-field"
              @input="updateStepSize"
              style="
                border-radius: 3px;
                border-color: lightgrey;
                color: lightgrey;
                border-width: 1px;
                margin-right: -22px;
              "
            />
          </div>
        </div>
      </div>
      <!-- tsne开始 -->
      <div class="tsne">
        <svg id="scatterPlot"></svg>
      </div>
      <!-- tsne结束 -->
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "series",

  data() {
    return {
      sliderValue: null, // 滑块当前值，控制放大
      stepSize: null, // 步长，控制缩小
    };
  },

  watch: {
    // Watch changes in sliderValue and stepSize
    sliderValue(newVal, oldVal) {
      // You can choose to handle `sliderValue` updates here or ignore
    },
    stepSize(newVal, oldVal) {
      this.createScatterPlot(); // Only trigger createScatterPlot when stepSize changes
    },
  },

  methods: {
    // Replace the random data generation with your provided t-SNE data
    getTsneData() {
      return [
        { TSNE_1: -20.63045, TSNE_2: -80.53873 },
        { TSNE_1: 1.5141065, TSNE_2: 100.94331 },
        { TSNE_1: 70.63087, TSNE_2: 77.42458 },
        { TSNE_1: -61.643963, TSNE_2: -8.5880165 },
        { TSNE_1: -59.045895, TSNE_2: -15.8402605 },
        { TSNE_1: -52.160843, TSNE_2: -12.36848 },
        { TSNE_1: 69.60236, TSNE_2: -2.7017417 },
        { TSNE_1: 72.21099, TSNE_2: -9.840953 },
        { TSNE_1: -53.857662, TSNE_2: -2.945726 },
        { TSNE_1: -1.0331539, TSNE_2: 100.408264 },
        { TSNE_1: -55.532333, TSNE_2: -7.057865 },
        { TSNE_1: -5.030308, TSNE_2: 99.58263 },
        { TSNE_1: -60.540142, TSNE_2: -19.508686 },
        { TSNE_1: 73.311584, TSNE_2: -5.3851037 },
        { TSNE_1: 66.82769, TSNE_2: 75.897865 },
        { TSNE_1: 75.78818, TSNE_2: -4.4876404 },
        { TSNE_1: 64.4608, TSNE_2: 74.94142 },
        { TSNE_1: -56.604992, TSNE_2: -9.739585 },
        { TSNE_1: -21.49804, TSNE_2: -83.96847 },
      ];
    },
    init() {
      console.log("刷新操作");
      // Re-create the chart after refresh or reset
      this.createScatterPlot();
    },

    updateStepSize() {
      // This function is called when step size input changes
      this.createScatterPlot();
    },

    createScatterPlot() {
      // Clear previous chart
      d3.select("#scatterPlot").selectAll("*").remove();

      // Use the provided t-SNE data
      let tsneData = this.getTsneData();

      // Assign group names for visualization purposes (this could be from some logic, like clustering)
      let data = tsneData.map((d, index) => {
        const group = `c${index % 3}`; // Assign groups cyclically (just an example)
        return { ...d, group };
      });

      // Define margins for the plot
      const margin = { top: 20, right: 50, bottom: 20, left: 50 };
      const width = 190 - margin.left - margin.right; // subtract margins
      const height = 140 - margin.top - margin.bottom; // subtract margins

      // Set up SVG canvas with margins
      const svg = d3
        .select("#scatterPlot")
        .attr("width", 300)
        .attr("height", 140)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      // Create scales for the axes with dynamic adjustment
      const xMax = d3.max(data, (d) => d.TSNE_1);
      const xMin = d3.min(data, (d) => d.TSNE_1);

      const yMax = d3.max(data, (d) => d.TSNE_2);
      const yMin = d3.min(data, (d) => d.TSNE_2);

      // Apply the slider value for zooming and step size for adjusting the range
      const xScale = d3
        .scaleLinear()
        .domain([
          xMin - this.sliderValue * 0.01,
          xMax + this.sliderValue * 0.01,
        ])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([yMin - this.stepSize * 0.01, yMax + this.stepSize * 0.01])
        .range([height, 0]);

      // Add circles for each data point with color based on group
      svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.TSNE_1)) // x position
        .attr("cy", (d) => yScale(d.TSNE_2)) // y position
        .attr("r", 2) // radius
        .attr("fill", "#5a91bf"); // fill color based on group
    },
  },
};
</script>

<style>
.emd-main {
  width: 200px;
  height: 255px;
}

.tsne {
  width: 200px;
  height: 500px;
  /* background-color: bisque; */
}

.input-wrapper {
  position: relative;
  z-index: 0;
}

.input-field {
  padding: 5px;
  font-size: 14px;
  width: 50px;
  height: 20px;
  text-align: center;
  position: relative;
  z-index: 0;
  border: 1px solid lightgrey; /* Ensures consistent border on all sides */
}

input[type="number"]:focus {
  outline: none;
  border-color: lightgrey; /* Ensures focus border color consistency */
}

input[type="number"]::-webkit-appearance {
  -webkit-appearance: none;
  /* Remove default browser styling */
}

p {
  position: relative;
  z-index: 1;
}
label {
  font-size: 15px; /* Adjust the font size here */
}
</style>
