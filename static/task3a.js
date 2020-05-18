function lineChart(pcaX, pcaY,x_axis) {

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
    var n = pcaX.length;
    var xCol = pcaX.map(function(value,index) { return value[0]; });
    //console.log(xCol)
    var yCol = pcaX.map(function(value,index) { return value[1]; });
    var xMin=d3.min(xCol)
    // xMin=xMin-0.2*xMin
    // xMin=+xMin
    var xMax=d3.max(xCol)
    // xMax=xMax+0.2*xMax
    // xMax=+xMax

    var yMin = d3.min(yCol)
    // yMin=yMin-0.2*yMin
    // yMin=+yMin
    var yMax = d3.max(yCol)
    // yMax=yMax+0.2*yMax
    // yMax=+yMax

    // 5. X scale will use the index of our data
    var xScale = d3.scaleLinear()
        .domain([xMin-0.5, xMax+0.5]) // input
        .range([0, width]); // output

    // 6. Y scale will use the randomly generate number
    var yScale = d3.scaleLinear()
        .domain([yMin-0.5, yMax+0.5]) // input
        .range([height, 0]); // output


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
        .text("PCA dim 2");


    svg.selectAll(".dot")
        .data(pcaX)
        .enter().append("circle") // Uses the enter().append() method
        .attr("class", "dot") // Assign a class for styling
        .attr("cx", function(d, i) {
            //console.log(d)
            return xScale(pcaX[i][0])
        })
        .attr("cy", function(d,i) {
            return yScale(pcaX[i][1])
        })
        .attr("r", 4)
        .style("fill",function(d,i){
            if(pcaY[i]==0){
                return "#bb3380"
            }
            else{
                return "#d9ae38"
            }

        })
        .attr("fill-opacity", 0.8);

}


function task3a(data) {
    updateSelectedTask("task3a");

    console.log(data)

    var pcaOrgX = data["0"]["0"]
    var pcaOrgY = data["0"]["1"]

    var pcaRandX = data["0"]["2"]
    var pcaRandY = data["0"]["3"]

    var pcaStratX = data["0"]["4"]
    var pcaStratY = data["0"]["5"]

    //console.log(pcaOrgX)

    //console.log(pcaOrgY)
    //console.log(yCol)

    lineChart(pcaOrgX, pcaOrgY, "PCA Original 2D scatterplot")

    lineChart(pcaRandX, pcaRandY, "PCA Random Sampled 2D scatterplot")

    lineChart(pcaStratX, pcaStratY, "PCA Stratified Sampling 2D scatterplot")

}
