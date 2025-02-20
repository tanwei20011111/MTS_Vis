import * as echarts from 'echarts'
import {minMax2DArr} from './lib/utility';

let color_palete = ['#3b6291', '#943c39', '#779043', '#624c7c', '#388498'];

function plotLines(container, lines_data){
    let that = this;
    let myChart = echarts.init(document.getElementById(container), {renderer: 'svg'});  // HERE ===
    let line_style = {type:"line", smooth: true, color:'#5a91bf', lineStyle:{width:1}};
    let series_data = [];
    let values = [];   // scala
    let option, grid, legend, axisTick = {show: true}, axisLine = {show: true};
    let time_steps = lines_data[0].data.length;

    values = lines_data.map((item,i) => item.data);
    let min_y = minMax2DArr(values).min;
    let offset_y = 10;
    min_y = Math.floor(min_y-offset_y);

    // Styling
    if(lines_data[0].name.includes("p")){   // pattern style
        line_style.lineStyle.width = 1.5;
        let stationary_ids = ['0', '3', '4'];    // CHANGE: web set
        // let stationary_ids = ['0', '1', '2', '3', '4'];   

        series_data = lines_data.map((item,i) => {
            return Object.assign({item:item.name, 
                        data:item.data, symbolSize:0}, line_style);
        });
        grid = { left: 0, top: 35, right: 3, bottom: 5 };
        axisTick = {show: true};
        axisLine = {show: true};
    } 
    else{     // series style
        series_data = lines_data.map((item,i) => (Object.assign({name:'series', item:item.name, 
                        data:item.data, stack:'总量'+i, symbolSize:1}, line_style)));   // CHANGE: symbolSize

        legend = { data: ['series'] };
        grid = { left: '3.2%', right: '4%', bottom: '3%', top: 20, containLabel: true };   // CHANGE
        axisLine = {show: true};
    }

    console.log('series_data: ', series_data);
    console.log('x axis data: ', [...Array(time_steps).keys()].map(i => 'D'+(i+1)));

    option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },

        // legend: legend,
        grid: grid,

        toolbox: {
            feature: {
                saveAsImage: {show: false}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [...Array(time_steps).keys()].map(i => 'D'+(i+1)),
            axisLine: axisLine, 
            axisTick: axisTick,
            axisLabel: {
                fontSize: 10
            },
        },
        yAxis: {
            type: 'value',
            min: min_y,     // CHANGE
            splitLine: {show: false},
            axisTick: {show:true},
            axisLine: axisLine,
            axisLabel: {
                rotate: 50,
                fontSize: 10
            },
        },

        series: series_data,

        graphic: [{
            type: 'rect',
            z: -1, // Place behind the chart elements
            left: { xAxisIndex: 0, value: 'D3' }, // Start at Day 3
            right: { xAxisIndex: 0, value: 'D9' }, // End at Day 5
            top: '0%',    // Cover full height
            bottom: '100%',
            style: {
              fill: '#ccc',
              opacity: 0.3
            }
        }]

    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }

    // that.legendClick(myChart);
}


function legendClick(chart) {
    chart.on('legendselectchanged', function(params){
        let option = chart.getOption();
        let select_key = Object.keys(params.selected);
        let select_value = Object.values(params.selected);
        console.log("Legend selected...", select_key, select_value);
        let n = 0;
        select_value.map((res,i) => {
           if(!res){
               n++;
               console.log("Index clicked: ", i);
            }
        });
       
        if( n==select_value.length){
            option.legend[0].selected[params.name] = true;
        }
        chart.setOption(option);
    });
} 




export {
    plotLines,
}





