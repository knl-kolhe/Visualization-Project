function dashboard(data) {
    updateSelectedTask("dashboard");
    console.log(data)
    // data=JSON.parse(data);

    // console.log(data)
    populate_parallel(data);

    populate_dcJS(data);

}

function populate_dcJS(data)
{
    // window.data;
    var ndx = crossfilter(data);
    var all = ndx.groupAll();

    var a15Dimension = ndx.dimension(function(d) { return d["A15"]; });

    var a15Group = a15Dimension.group();
    // a15Group.top(2)[0]["key"]="Rejected";
    // a15Group.top(2)[1]["key"]="Accepted";

    window.targetPie = dc.pieChart("#pie_chart_0_1");

    targetPie
        .dimension(a15Dimension)
        .group(a15Group);

    var a8Dimension = ndx.dimension(function(d) { return d["A8"]; });

    var a8Group = a8Dimension.group();
    // a15Group.top(2)[0]["key"]="Rejected";
    // a15Group.top(2)[1]["key"]="Accepted";

    window.priorDefaultRowChart = dc.rowChart("#priorDefault");


    priorDefaultRowChart
        .dimension(a8Dimension)
        .group(a8Group);

    var a5Dimension = ndx.dimension(d => Math.round(d["A5"]));

    var a5Group = a5Dimension.group();


    window.educationChart = dc.barChart("#education");

    educationChart
        .dimension(a5Dimension)
        .group(a5Group)
        .elasticY(true)
        .centerBar(true)
        .gap(1)
        .round(Math.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([0, 15]))
        .renderHorizontalGridLines(true);
        // .filterPrinter(filters => {
        //     const filter = filters[0];
        //     let s = '';
        //     s += `${numberFormat(filter[0])}% -> ${numberFormat(filter[1])}%`;
        //     return s;
        // });
        educationChart.xAxis().tickFormat(
            v => `${v}`);
        educationChart.yAxis().ticks(5);

    window.mdsScatterPlot = dc.scatterPlot('#mds');

    var mdsDimension = ndx.dimension(function(data) {
               return [Math.floor(data.MDS_x), Math.floor(data.MDS_y), +data.A15];
            });
    var mdsGroup = mdsDimension.group();

    var xMin=500
    var xMax=-500
    var yMin = 500
    var yMax = -500
    data.forEach(function(d){
        if(d["MDS_x"]>xMax){
            xMax=d["MDS_x"]
        }
        if(d["MDS_x"]<xMin){
            xMin=d["MDS_x"]
        }
        if(d["MDS_y"]>yMax){
            yMax=d["MDS_y"]
        }
        if(d["MDS_y"]<yMin){
            yMin=d["MDS_y"]
        }
    });

    mdsScatterPlot
               .x(d3.scale.linear().domain([xMin-1,xMax+1]))
               .y(d3.scale.linear().domain([yMin-1,yMax+1]))
               // .elasticX("true")
               // .elasticY("true")
               .brushOn(true)
               .xAxisLabel("Dim 1")
               .yAxisLabel("Dim 2")
               .symbolSize(8)
               .clipPadding(10)
               .dimension(mdsDimension)
               .group(mdsGroup);

    dc.renderAll();
};

function populate_parallel(data)
{
    var innerWidth = +d3.select("#parallel_coords").node().getBoundingClientRect().width
    var innerHeight = window.innerHeight *0.3
    var margin = {
            top: 40,
            right: 20,
            bottom: 20,
            left: 20
        },
        width = innerWidth - margin.left - margin.right // Use the window's width
        ,
        height = innerHeight - margin.top - margin.bottom; // Use the window's height
    // var margin = {top: 30, right: 10, bottom: 10, left: 10},
    //     width = 960 - margin.left - margin.right,
    //     height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal().rangePoints([0, width], 1),
        y = {},
        dragging = {};

    var line = d3.svg.line(),
        axis = d3.svg.axis().orient("left"),
        background,
        foreground;
    // var title = d3.select("#parallel_coords")
    //             .append('span')
    //             .text('Parallel Coordinates')
    var svg = d3.select("#parallel_coords").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // d3.csv("./datasets/australian.csv", function(error, data) {
    dimensions = ['A8','A9','A10','A5','A7','A6','A3','A4','A14','A2','A12','A11','A13','A1']
    dimension_name = ['Prior Default', 'Employed', 'Credit Score', 'Education', 'LenEmployed', 'Current Job',
    'AvgHome', 'Home Status', 'Savings', 'Age', 'Citizen', 'Drivers License', 'Expenses',
    'Male/Female']
      // Extract the list of dimensions and create a scale for each.
      x.domain(dimensions.filter(function(d) {
        return d != "name" && (y[d] = d3.scale.linear()
            .domain(d3.extent(data, function(p) { return +p[d]; }))
            .range([height, 0]));
      }));
      // console.log(dimensions)
      // console.log(dimension_name)
      // Add grey background lines for context.
      background = svg.append("g")
          .attr("class", "background")
        .selectAll("path")
          .data(data)
        .enter().append("path")
          .attr("d", path);

      // Add blue foreground lines for focus.
      foreground = svg.append("g")
          .attr("class", "foreground")
        .selectAll("path")
          .data(data)
        .enter().append("path")
          .attr("d", path)
          .style("stroke",function(d,i){
              if(data[i]['A15']==0){
                  return "#ff0059"
              }
              else{
                  return "#4be399"
              }

          })
          .attr("stroke-opacity", 0.3);

      // Add a group element for each dimension.
      var g = svg.selectAll(".dimension")
          .data(dimensions)
        .enter().append("g")
          .attr("class", "dimension")
          .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
          .call(d3.behavior.drag()
            .origin(function(d) { return {x: x(d)}; })
            .on("dragstart", function(d) {
              dragging[d] = x(d);
              background.attr("visibility", "hidden");
            })
            .on("drag", function(d) {
              dragging[d] = Math.min(width, Math.max(0, d3.event.x));
              foreground.attr("d", path);
              // background.attr("visibility", "hidden");
              dimensions.sort(function(a, b) { return position(a) - position(b); });
              x.domain(dimensions);
              g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
            })
            .on("dragend", function(d) {
              delete dragging[d];
              transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
              transition(foreground).attr("d", path);
              background
                  .attr("d", path)
                .transition()
                  .delay(500)
                  .duration(0)
                  .attr("visibility", null);
            }));

      // Add an axis and title.
      g.append("g")
          .attr("class", "axis")
          .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
        .append("text")
          .style("text-anchor", "middle")
          .attr("y", -9)
          .style("color", "#ffffff")
          .text(function(d,i) { return dimension_name[i]; });

      // Add and store a brush for each axis.
      g.append("g")
          .attr("class", "brush")
          .each(function(d) {
            d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
          })
        .selectAll("rect")
          .attr("x", -8)
          .attr("width", 16);
    // });

    function position(d) {
      var v = dragging[d];
      return v == null ? x(d) : v;
    }

    function transition(g) {
      return g.transition().duration(500);
    }

    // Returns the path for a given data point.
    function path(d) {
      return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
    }

    function brushstart() {
      d3.event.sourceEvent.stopPropagation();
    }

    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
      var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
          extents = actives.map(function(p) { return y[p].brush.extent(); });
      foreground.style("display", function(d) {
        return actives.every(function(p, i) {
          return extents[i][0] <= d[p] && d[p] <= extents[i][1];
        }) ? null : "none";
      });
    }
};
