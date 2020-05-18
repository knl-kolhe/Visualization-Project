function lineChart(dataSet, maxVal, x_axis){
    var innerWidth=+d3.select("#svgElement").node().getBoundingClientRect().width
    var innerHeight=window.innerHeight*0.8
    var margin = {
            top: 100,
            right: 100,
            bottom: 100,
            left: 100
        },
        width = innerWidth - margin.left - margin.right // Use the window's width
        ,
        height = innerHeight - margin.top - margin.bottom; // Use the window's height

    // The number of datapoints
    var n = 9;

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([1, n]) // input
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([0, maxVal]) // input
        .range([height, 0]); // output

    // 7. d3's line generator
    var line = d3.line()
        .x(function(d, i) {
            return xScale(i+1);
        }) // set the x values for the line generator
        .y(function(d) {
            return yScale(d.y);
        }) // set the y values for the line generator
        //.curve(d3.curveMonotoneX) // apply smoothing to the line

    //8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
    // var dataset = d3.range(n).map(function(d) {
    //     return {
    //         "y": d3.randomUniform(1)()
    //     }
    // })
    // console.log(dataset)
    // 1. Add the SVG to the page and employ #2
    var svg = d3.select("#svgElement").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // 3. Call the x axis in a group tag
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom


    // text label for the x axis
    svg.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + margin.top-10) + ")")
      .style("text-anchor", "middle")
      .text(x_axis);

    // 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform","translate(0,0)")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Sum of Squared Distances");

    // 9. Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(dataSet) // 10. Binds data to the line
        //.attr("class", "line") // Assign a class for styling
        .style("fill","none")
        .style("stroke","#2BBBAD")
        .style("stroke-width","2px")
        .attr("d", line); // 11. Calls the line generator

    // 12. Appends a circle for each datapoint
    svg.selectAll(".dot")
        .data(dataSet)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) {
            return xScale(i+1)
        })
        .attr("cy", function(d) {
            return yScale(d.y)
        })
        .attr("r", 5)
        .on("mouseover", function(a, b, c) {
            console.log(a)
            this.attr('class', 'focus')
        })
        .on("mouseout", function() {})
}


function task1b(data) {

    updateSelectedTask("task1b");
//     styleString="<style> /* set the CSS */ \
// \
// .line {\
//   fill: none;\
//   stroke: steelblue;\
//   stroke-width: 2px;\
// }\
// \
// </style>";
//     d3.select("head")
//     .html(styleString)

    //console.log(data)
    var kmeansStrat=data[1]["1"]
    var kmeansRandom=data[1]
    console.log("hello"+kmeansStrat)

    var dataSet=[]
    var maxVal=0;
    for(x in data){
        //console.log(data[x]["0"])
        if(data[x]["0"]>maxVal){
            maxVal=data[x]["0"];
        }
        dataSet.push({"y":data[x]["0"]});
    }
    //console.log("hello")
    lineChart(dataSet, maxVal, "Number of Clusters  (Original Data)")
    //console.log("hello")

    //----------------------------------------Random Data-------------------------------------------
    var dataSet=[]
    var maxVal=0;
    for(x in data){
        //console.log(data[x]["0"])
        if(data[x]["1"]>maxVal){
            maxVal=data[x]["1"];
        }
        dataSet.push({"y":data[x]["1"]});
    }

    lineChart(dataSet, maxVal, "Number of Clusters  (Randomly Sampled Data)");


    //-----------------------------------------Stratified sampled data------------------------------
    var dataSet=[]
    var maxVal=0;
    for(x in data){
        //console.log(data[x]["0"])
        if(data[x]["2"]>maxVal){
            maxVal=data[x]["2"];
        }
        dataSet.push({"y":data[x]["2"]});
    }

    lineChart(dataSet, maxVal, "Number of Clusters  (Stratified Sampled Data)")



}

// function task1b(data) {
//
//     updateSelectedTask("task1b");
// //     styleString="<style> /* set the CSS */ \
// // \
// // .line {\
// //   fill: none;\
// //   stroke: steelblue;\
// //   stroke-width: 2px;\
// // }\
// // \
// // </style>";
// //     d3.select("head")
// //     .html(styleString)
//
//     //console.log(data)
//
//     var dataSet=[]
//     var maxVal=0;
//     for(x in data){
//         //console.log(data[x]["0"])
//         if(data[x]["0"]>maxVal){
//             maxVal=data[x]["0"];
//         }
//         dataSet.push({"y":data[x]["0"]});
//     }
//     console.log(d3.select("#svgElement").node().getBoundingClientRect())
//     console.log(+d3.select('#svgElement').style('height').slice(0,-2))
//     var innerWidth=+d3.select("#svgElement").node().getBoundingClientRect().width
//     var innerHeight=window.innerHeight*0.8
//     var margin = {
//             top: 100,
//             right: 100,
//             bottom: 100,
//             left: 100
//         },
//         width = innerWidth - margin.left - margin.right // Use the window's width
//         ,
//         height = innerHeight - margin.top - margin.bottom; // Use the window's height
//
//     // The number of datapoints
//     var n = 9;
//
//     // 5. X scale will use the index of our data
//     var xScale = d3.scaleLinear()
//         .domain([1, n]) // input
//         .range([0, width]); // output
//
//     // 6. Y scale will use the randomly generate number
//     var yScale = d3.scaleLinear()
//         .domain([0, maxVal+5000]) // input
//         .range([height, 0]); // output
//
//     // 7. d3's line generator
//     var line = d3.line()
//         .x(function(d, i) {
//             return xScale(i+1);
//         }) // set the x values for the line generator
//         .y(function(d) {
//             return yScale(d.y);
//         }) // set the y values for the line generator
//         //.curve(d3.curveMonotoneX) // apply smoothing to the line
//
//     //8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
//     // var dataset = d3.range(n).map(function(d) {
//     //     return {
//     //         "y": d3.randomUniform(1)()
//     //     }
//     // })
//     // console.log(dataset)
//     // 1. Add the SVG to the page and employ #2
//     var svg = d3.select("#svgElement").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
//     // 3. Call the x axis in a group tag
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(xScale)); // Create an axis component with d3.axisBottom
//
//     // text label for the x axis
//     svg.append("text")
//       .attr("transform",
//             "translate(" + (width/2) + " ," +
//                            (height + margin.top-10) + ")")
//       .style("text-anchor", "middle")
//       .text("Number of Clusters");
//
//     // 4. Call the y axis in a group tag
//     svg.append("g")
//         .attr("class", "y axis")
//         .attr("transform","translate(0,0)")
//         .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft
//
//     // text label for the y axis
//     svg.append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 0 - margin.left)
//         .attr("x",0 - (height / 2))
//         .attr("dy", "1em")
//         .style("text-anchor", "middle")
//         .text("Average Distance from Cluster Center");
//
//     // 9. Append the path, bind the data, and call the line generator
//     svg.append("path")
//         .datum(dataSet) // 10. Binds data to the line
//         //.attr("class", "line") // Assign a class for styling
//         .style("fill","none")
//         .style("stroke","#2BBBAD")
//         .style("stroke-width","2px")
//         .attr("d", line); // 11. Calls the line generator
//
//     // 12. Appends a circle for each datapoint
//     svg.selectAll(".dot")
//         .data(dataSet)
//         .enter().append("circle") // Uses the enter().append() method
//         .attr("class", "dot") // Assign a class for styling
//         .attr("cx", function(d, i) {
//             return xScale(i+1)
//         })
//         .attr("cy", function(d) {
//             return yScale(d.y)
//         })
//         .attr("r", 5)
//         .on("mouseover", function(a, b, c) {
//             console.log(a)
//             this.attr('class', 'focus')
//         })
//         .on("mouseout", function() {})
//     //       .on("mousemove", mousemove);
//
//     //   var focus = svg.append("g")
//     //       .attr("class", "focus")
//     //       .style("display", "none");
//
//     //   focus.append("circle")
//     //       .attr("r", 4.5);
//
//     //   focus.append("text")
//     //       .attr("x", 9)
//     //       .attr("dy", ".35em");
//
//     //   svg.append("rect")
//     //       .attr("class", "overlay")
//     //       .attr("width", width)
//     //       .attr("height", height)
//     //       .on("mouseover", function() { focus.style("display", null); })
//     //       .on("mouseout", function() { focus.style("display", "none"); })
//     //       .on("mousemove", mousemove);
//
//     //   function mousemove() {
//     //     var x0 = x.invert(d3.mouse(this)[0]),
//     //         i = bisectDate(data, x0, 1),
//     //         d0 = data[i - 1],
//     //         d1 = data[i],
//     //         d = x0 - d0.date > d1.date - x0 ? d1 : d0;
//     //     focus.attr("transform", "translate(" + x(d.date) + "," + y(d.close) + ")");
//     //     focus.select("text").text(d);
//     //   }
// }
