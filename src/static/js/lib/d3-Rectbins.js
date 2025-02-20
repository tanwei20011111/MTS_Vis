import * as d3 from 'd3';

function d3Rectbin() {
    let dx = 0.1,
        dy = 0.1, 
        x = rectbinX,
        y = rectbinY;

    function rectbin(points) {
      let binsById = {};
      let xExtent = d3.extent(points, function(d, i){ return x.call(rectbin, d, i) ;});
      let yExtent = d3.extent(points, function(d, i){ return y.call(rectbin, d, i) ;});

      d3.range(yExtent[0], yExtent[1] + dx, dy).forEach(function(Y){
        d3.range(xExtent[0], xExtent[1] + dx, dx).forEach(function(X){
          let py = Y / dy; 
          let pj = trunc(py);
          let px = X / dx;
          let pi = trunc(px);
          let id = pi + '-' + pj;
          let bin = binsById[id] = [];
          bin.i = pi;
          bin.j = pj;
          bin.x = pi * dx;
          bin.y = pj * dy;
        });
      });
      points.forEach(function(point, i) {
        let py = y.call(rectbin, point, i) / dy;
        let pj = trunc(py);
        let px = x.call(rectbin, point, i) / dx;
        let pi = trunc(px);

        let id = pi + '-' + pj;
        let bin = binsById[id];
        bin.push(point);
      });
      return d3.values(binsById);
    }

    rectbin.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return rectbin;
    };

    rectbin.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return rectbin;
    };

    rectbin.dx = function(_) {
      if (!arguments.length) return dx;
      dx = _;
      return rectbin;
    };

    rectbin.dy = function(_) {
      if (!arguments.length) return dy;
      dy = _;
      return rectbin;
    };


    return rectbin;
};

let rectbinX = function(d) { return d[0]; },
    rectbinY = function(d) { return d[1]; };


function trunc(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}


export{
  d3Rectbin,
}