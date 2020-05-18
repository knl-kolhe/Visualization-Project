function extra(data) {
    updateSelectedTask("extra");

    d3.select("#svgElement")
        .append("div")
        .attr("id", "plot3d-1")



    var chartHolder1 = d3.select("#plot3d-1");

    var pcaOrg = JSON.parse(data["0"]["0"]);

    // Declare the chart component
    var myChart1 = d3.x3d.chart.scatterPlot();

    // Attach chart and data to the chartholder
    chartHolder1.datum(pcaOrg).call(myChart1);
    chartHolder1.append("span")
    .text("3D plot of Original data 3 PCA vectors")

    //----------------------PCA of Random Sampling------------------------------
    d3.select("#svgElement")
        .append("div")
        .attr("id", "plot3d-2");
    var chartHolder2 = d3.select("#plot3d-2")
    var pcaRand = JSON.parse(data["0"]["1"]);
    var myChart2 = d3.x3d.chart.scatterPlot();

    chartHolder2.datum(pcaRand).call(myChart2);
    chartHolder2.append("span")
    .text("3D plot of Random Sampled data 3 PCA vectors")

    //-------------------------------------------PCA of Stratified Sampling------------
    d3.select("#svgElement")
        .append("div")
        .attr("id", "plot3d-3");
    var chartHolder3 = d3.select("#plot3d-3")
    var pcaStrat = JSON.parse(data["0"]["2"]);
    var myChart3 = d3.x3d.chart.scatterPlot();

    chartHolder3.datum(pcaRand).call(myChart3);
    chartHolder3.append("span")
    .text("3D plot of Stratified Sampled data 3 PCA vectors")


}
