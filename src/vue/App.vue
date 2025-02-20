<template>
  <div class="main">
    <div class="head">
      <div class="series">
        <series></series>
      </div>
      <div class="embview">
        <Emd></Emd>
      </div>
    </div>

    <div class="bottom">
      <div class="pattern"><matrix></matrix></div>
      <div class="detail"><control></control></div>
    </div>
  </div>
</template>

<script>
import fringe from "./fringe.vue";
import control from "./control.vue";
import series from "./series.vue";
import matrix from "./matrix.vue";
import Emd from "./Emd.vue";

export default {
  name: "App",

  data() {
    return {
      num: 11,
      seriesData: [],
    };
  },

  components: {
    fringe,
    control,
    series,
    matrix,
    Emd,
  },

  methods: {
    getSeries(data) {
      this.seriesData = data;
    },
  },
};
</script>

<style>
.main {
  height: 1025px;
  width: 1600px;
  /* background-color: aquamarine; */
}
.head {
  height: 300px;
  width: 1600px;
  /* background-color: azure; */
  display: flex;
}
.series {
  height: 300px;
  width: 1400px;
  /* background-color: blue; */
}
.embview {
  height: 300px;
  width: 200px;
  /* background-color: blueviolet; */
}
.bottom {
  width: 1600px;
  height: 725px;
  display: flex;
}

.pattern {
  width: 1300px;
  height: 725px;
  /* background-color: antiquewhite; */
}
.detail {
  width: 300px;
  height: 725px;
}
</style>
