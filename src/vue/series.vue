<template>
  <div
    class="card text-center border-light view"
    style="height: 100%; width: 100%"
  >
    <!-- Card Header -->
    <div class="card-header bg-light">
      <h6>Series View</h6>
      <input
        type="image"
        src="../static/data/icons/refresh.png"
        class="icon"
        style="top: 13px; right: 20px"
        @click="init"
      />
    </div>

    <!-- Main Content -->
    <div class="series-main">
      <div class="series-left">
        <!-- Table for Variable Names and Stats -->
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Variable</th>
              <th>Avg</th>
              <th>Min</th>
              <th>Max</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(column, index) in columns" :key="index">
              <td>
                <input
                  type="checkbox"
                  :id="`checkbox-${column}`"
                  v-model="selectedColumns"
                  :value="column"
                  @change="plotSeries"
                  style="margin-left: 10px"
                />
              </td>
              <td>
                <label :for="`checkbox-${column}`" style="margin-left: -2px">{{
                  column
                }}</label>
              </td>
              <!-- Display actual Stats -->
              <td>{{ getStats(column).avg.toFixed(2) }}</td>
              <td>{{ getStats(column).min }}</td>
              <td>{{ getStats(column).max }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Plot Area -->
      <div
        id="series_div"
        style="height: 255px; width: 1300px; left: 20px; top: 30px"
      ></div>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { series_file_loader } from "../static/js/lib/file_processor";

export default {
  name: "series",

  data() {
    return {
      series_file: "../static/data/series.csv",
      series_data: [],
      selectedColumns: [], // Store the selected columns for plotting
      columns: [], // Store the names of columns (variables)
      maxValues: {},
      minValues: {},
      sumValues: {},
      countValues: {},
    };
  },

  created() {
    series_file_loader(this.series_file, (data) => {
      this.series_data = data;

      this.columns = this.getColumns(data); // Extract column names

      this.getMaxMinAvg(data); // Calculate max, min, and avg values
      this.plotSeries(); // Plot initially with all columns
      console.log(this.maxValues);
    });
  },

  methods: {
    // Initialize the plot when the refresh button is clicked
    init() {
      this.selectedColumns = null; // Store the selected columns for plotting
    },

    // Extract column names excluding 'Date'
    getColumns(data) {
      return d3.keys(data[0]).filter((d) => d !== "Date");
    },

    // Calculate max, min, sum, and avg for each column
    getMaxMinAvg(data) {
      data.forEach((record) => {
        for (let station in record) {
          if (station !== "Date") {
            const value = record[station];

            // Initialize values if not already done
            if (!(station in this.maxValues)) {
              this.maxValues[station] = value;
              this.minValues[station] = value;
              this.sumValues[station] = value;
              this.countValues[station] = 1;
            } else {
              // Update values
              this.maxValues[station] = Math.max(
                this.maxValues[station],
                value
              );
              this.minValues[station] = Math.min(
                this.minValues[station],
                value
              );
              this.sumValues[station] += value;
              this.countValues[station] += 1;
            }
          }
        }
      });
    },
    // getMaxMinAvg(data, numRows) {
    //   // Limit the data to the first `numRows` rows
    //   const limitedData = data.slice(0, numRows);

    //   limitedData.forEach((record) => {
    //     for (let station in record) {
    //       if (station !== "Date") {
    //         const value = record[station];

    //         // Initialize values if not already done
    //         if (!(station in this.maxValues)) {
    //           this.maxValues[station] = value;
    //           this.minValues[station] = value;
    //           this.sumValues[station] = value;
    //           this.countValues[station] = 1;
    //         } else {
    //           // Update values
    //           this.maxValues[station] = Math.max(
    //             this.maxValues[station],
    //             value
    //           );
    //           this.minValues[station] = Math.min(
    //             this.minValues[station],
    //             value
    //           );
    //           this.sumValues[station] += value;
    //           this.countValues[station] += 1;
    //         }
    //       }
    //     }
    //   });

    //   // Calculate the average for each station
    //   for (let station in this.sumValues) {
    //     const avg = this.sumValues[station] / this.countValues[station];
    //     this.avgValues[station] = avg.toFixed(2); // Round to two decimal places
    //   }
    // },

    // Get the stats (avg, min, max) for a specific column
    getStats(column) {
      if (!this.sumValues[column]) {
        return {
          avg: 0,
          min: 0,
          max: 0,
        };
      }
      const avg = this.sumValues[column] / this.countValues[column];
      return {
        avg: avg,
        min: this.minValues[column],
        max: this.maxValues[column],
      };
    },

    // Method to generate the actual plot
    plotSeries() {
      let that = this;
      let container = "series_div";
      d3.select("#" + container)
        .selectAll("*")
        .remove(); // Clear previous chart

      d3.select("#" + container)
        .append("svg")
        .attr("id", "series_svg")
        .attr("width", 1050)
        .attr("height", 260);

      this.plotSeries2("series_svg");
    },

    // Method to create the series chart
    // Method to create the series chart
    // Method to create the series chart
    plotSeries2(svg_id) {
      let svg = d3.select("#" + svg_id),
        margin = { top: 20, right: 20, bottom: 60, left: 30 }, // 增加底部边距以容纳 brush
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

      let parseDate = d3.timeParse("%m/%d/%Y %H:%M");

      let x = d3.scaleTime().range([0, width]),
        y = d3.scaleLinear().range([height, 0]);

      // Use d3.timeFormat to format the x-axis ticks
      let xAxis = d3
          .axisBottom(x)
          .ticks(d3.timeDay.every(1))
          .tickFormat(d3.timeFormat("%m/%d")),
        yAxis = d3.axisLeft(y);

      let Line_chart = svg
        .append("g")
        .attr("fill", "gray")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      d3.csv(this.series_file, type, (error, csvData) => {
        if (error) throw error;
        let data = csvData;

        let columns = this.selectedColumns.length ? this.selectedColumns : [];

        x.domain(d3.extent(data, (d) => d.Date));
        y.domain([0, d3.max(data, (d) => d3.max(columns, (col) => d[col]))]);

        this.columns = data.columns.slice(1);

        this.getMaxMinAvg(data); // Update the max, min, and avg values
        //0101
        this.maxValues = {
          Station0: 4207,
          Station1: 2381,
          Station2: 639,
          Station3: 1014,
          Station4: 926,
          Station5: 1128,
        };
        this.minValues = {
          Station0: 0,
          Station1: 0,
          Station2: 0,
          Station3: 0,
          Station4: 0,
          Station5: 0,
        };

        // Draw x-axis with formatted ticks (MM/DD)
        Line_chart.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .style("opacity", 0.5)
          .attr("stroke-width", 0.7)
          .style("font", "8px Arial");

        // Draw y-axis
        Line_chart.append("g")
          .attr("class", "axis axis--y")
          .call(yAxis)
          .style("opacity", 0.5)
          .attr("stroke-width", 0.7)
          .style("font", "8px Arial");

        columns.forEach((col) => {
          Line_chart.append("path")
            .datum(data)
            .attr("class", "line line-" + col)
            .attr(
              "d",
              d3
                .line()
                .x((d) => x(d.Date))
                .y((d) => y(d[col]))
            );
        });

        // Add brush
        let brush = d3
          .brushX()
          .extent([
            [0, height],
            [width, height + 20],
          ]) // 设置 brush 的范围
          .on("brush end", brushed);

        let brushG = Line_chart.append("g").attr("class", "brush").call(brush);

        function brushed(event) {
          // if (!event.selection) return; // 如果没有选择区域，则返回

          let [x0, x1] = event.selection.map(x.invert); // 将像素坐标转换为日期

          // 更新 x 轴的范围
          x.domain([x0, x1]);

          // 重新绘制图表
          Line_chart.selectAll(".line").attr("d", (d) =>
            d3
              .line()
              .x((d) => x(d.Date))
              .y((d) => y(d[col]))
          );

          Line_chart.select(".axis--x").call(xAxis);
        }
      });

      // Convert date string to Date object and convert numerical values
      function type(d) {
        d.Date = parseDate(d.Date);
        let columns = d3.keys(d).filter((k) => k !== "Date");
        columns.forEach((col) => (d[col] = +d[col]));
        return d;
      }
    },
  },
};
</script>

<style>
/* Styles for the layout and table */
.series-left {
  width: 400px;
  height: 255px;
  overflow-y: auto;
  padding: 10px;
}

.series-main {
  display: flex;
  width: 100%;
  height: 255px;
  color: gray;
}

.series-left {
  width: 400px;
  height: 255px;
  overflow-y: auto;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  text-align: center;
}

.series-left table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.series-left th,
.series-left td {
  padding: 6px 8px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}
/* Align Avg, Min, Max columns in the center */
.series-left td.stats-column {
  text-align: center;
}

.series-left th {
  background-color: #f8f9fa;
  font-weight: 600;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.1);
}

.series-left tr:nth-child(even) {
  background-color: #fafafa;
}

.series-left tr:hover {
  background-color: #f1f1f1;
}

.series-left td input[type="checkbox"] {
  margin: 0;
  vertical-align: middle;
}

.series-left td label {
  display: block;
  cursor: pointer;
  user-select: none;
  padding: 2px 0;
}

/* Scrollbar style */
.series-left::-webkit-scrollbar {
  width: 8px;
}

.series-left::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.series-left::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.series-left::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
