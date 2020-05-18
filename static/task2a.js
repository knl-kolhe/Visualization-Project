function lineChart(dataSet, data,x_axis) {
    var innerWidth = +d3.select("#svgElement").node().getBoundingClientRect().width
    var innerHeight = window.innerHeight * 0.8
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
    var n = 14;

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([0.5, n+0.5]) // input
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([0, 1]) // input
        .range([height, 0]); // output

    // 7. d3's line generator
    var line = d3.line()
        .x(function(d, i) {
            return xScale(i + 1);
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
            "translate(" + (width / 2) + " ," +
            (height + margin.top - 10) + ")")
        .style("text-anchor", "middle")
        .text(x_axis);

    // 4. Call the y axis in a group tag
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

    // text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Eigen Values");

    // 9. Append the path, bind the data, and call the line generator
    svg.append("path")
        .datum(dataSet) // 10. Binds data to the line
        //.attr("class", "line") // Assign a class for styling
        .style("fill", "none")
        .style("stroke", "#2BBBAD")
        .style("stroke-width", "2px")
        .attr("d", line); // 11. Calls the line generator

    // 12. Appends a circle for each datapoint
    svg.selectAll(".dot")
        .data(dataSet)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) {
            return xScale(i + 1)
        })
        .attr("cy", function(d) {
            return yScale(d.y)
        })
        .attr("r", 2)
        // .on("mouseover", function(a, b, c) {
        //     console.log(a)
        //     this.attr('class', 'focus')
        // })
        // .on("mouseout", function() {})
        var intrinsicDim=13;
        for(x in dataSet) {
            if(dataSet[x].y>0.75){
                //console.log(x)
                intrinsicDim=x;
                break;
            }
        }
        intrinsicDim=+intrinsicDim;
        var intrinsicDimPlusOne=intrinsicDim+1;
        intrinsicDimPlusOne=+intrinsicDimPlusOne;

        svg.append("line")
        .attr("x1",xScale(intrinsicDimPlusOne))
        .attr("y1",yScale(dataSet[intrinsicDim].y))
        .attr("x2",xScale(intrinsicDimPlusOne))
        .attr("y2",height)
        .style("stroke-width", 2)
        .style("stroke", "black")
        .style("fill", "none");

        svg.append("line")
        .attr("x1",0)
        .attr("y1",yScale(dataSet[intrinsicDim].y))
        .attr("x2",xScale(intrinsicDimPlusOne))
        .attr("y2",yScale(dataSet[intrinsicDim].y))
        .style("stroke-width", 2)
        .style("stroke", "black")
        .style("fill", "none");

        svg.append("text")
            .attr("y", yScale(dataSet[intrinsicDim].y)-20)
            .attr("x", xScale(intrinsicDimPlusOne)/2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("75% data variance "+intrinsicDimPlusOne+" attributes");

    // for(x in data)
    // {
    //     console.log(data[x].y)
    // }
    var xScale = d3.scaleBand()
        //.domain([1, n])
        .range([0, width])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([0,1])
        .range([height, 0]);

    // Scale the range of the data in the domains
    xScale.domain(data.map(function(d) {
        return d.x;
    }));
    // yScale.domain([0, d3.max(data, function(d) {
    //     return d.y;
    // })]);

    var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])

    svg.call(tip);
    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("fill","#2BBBAD")
        .attr("x", function(d,i) {
            return xScale(d.x);
        })
        .attr("width", xScale.bandwidth())
        .attr("y", function(d) {
            return yScale(d.y);
        })
        .attr("height", function(d) {
            return height - yScale(d.y);
        })
        .on("mouseover", function(d,i) {
                    d3.select(this)
                    .style("fill","#000000");

                    tip.html( "<span style='color:black; font-size:14px'>" + d.y.toFixed(3) + "</span>");
                    tip.show();
                })

                .on("mouseout", function(d,i) {
                    d3.select(this)
                    .style("fill","#2BBBAD");
                    tip.hide();
                });



        console.log(data.x)
}


function task2a(data) {
    updateSelectedTask("task2a");

    console.log(data["0"])
    var intrinsicDimOrg = JSON.parse(data["0"]["0"])
    //console.log(intrinsicDimOrg)

    var dataSetCumulative = []
    var maxVal = 0;
    for (x in intrinsicDimOrg["cumulativeEigVals"][0]) {

        dataSetCumulative.push({
            "y": intrinsicDimOrg["cumulativeEigVals"][0][x]

        });
    }

    dataSetEigVals = []
    for (x in intrinsicDimOrg["cumulativeEigVals"][0]) {

        dataSetEigVals.push({
            "y": intrinsicDimOrg["eigenValues"][0][x],
            "x": intrinsicDimOrg["dimension"][0][x]
        });
    }

    lineChart(dataSetCumulative, dataSetEigVals, "Attributes (Original Data)")



    var intrinsicDimRand = JSON.parse(data["0"]["1"])
    //console.log(intrinsicDimRand)
    var dataSetCumulative = []
    var maxVal = 0;
    for (x in intrinsicDimRand["cumulativeEigVals"][0]) {

        dataSetCumulative.push({
            "y": intrinsicDimRand["cumulativeEigVals"][0][x]

        });
    }

    dataSetEigVals = []
    for (x in intrinsicDimRand["cumulativeEigVals"][0]) {

        dataSetEigVals.push({
            "y": intrinsicDimRand["eigenValues"][0][x],
            "x": intrinsicDimRand["dimension"][0][x]
        });
    }

    lineChart(dataSetCumulative, dataSetEigVals, "Attributes (Random Sampled Data)")

    var intrinsicDimStrat = JSON.parse(data["0"]["2"])
    //console.log(intrinsicDimRand)
    var dataSetCumulative = []
    var maxVal = 0;
    for (x in intrinsicDimStrat["cumulativeEigVals"][0]) {

        dataSetCumulative.push({
            "y": intrinsicDimStrat["cumulativeEigVals"][0][x]

        });
    }

    dataSetEigVals = []
    for (x in intrinsicDimStrat["cumulativeEigVals"][0]) {

        dataSetEigVals.push({
            "y": intrinsicDimStrat["eigenValues"][0][x],
            "x": intrinsicDimStrat["dimension"][0][x]
        });
    }

    lineChart(dataSetCumulative, dataSetEigVals, "Attributes (Stratified Sampled Data)")


}
