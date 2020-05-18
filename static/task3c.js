function plot(dataPCA) {
    //console.log(dataPCA[0])
    var innerWidth = +d3.select("#svgElement").node().getBoundingClientRect().width
    var innerHeight = window.innerHeight * 0.8
    var marginVal=100;
    var margin = {
            top: marginVal,
            right: marginVal,
            bottom: marginVal,
            left: marginVal
        },
        width = innerWidth - margin.left - margin.right // Use the window's width
        ,
        height = innerHeight - margin.top - margin.bottom + 50; // Use the window's height

    var size = +parseInt(width / 3.17),
        padding = 20;

    //console.log(size)

    var x = d3.scaleLinear()
        .range([padding / 2, size - padding / 2]);

    var y = d3.scaleLinear()
        .range([size - padding / 2, padding / 2]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .ticks(6);

    var yAxis = d3.axisLeft()
        .scale(y)
        .ticks(6);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var domainByTrait = {},
        traits = d3.keys(dataPCA[0]).filter(function(d) { return d !== "target"; }),
        n = traits.length;


    traits.forEach(function(trait) {
        domainByTrait[trait] = d3.extent(dataPCA, function(d) {
            return d[trait];
        });
    });
    console.log(domainByTrait)
    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    var brush = d3.brush()
        .on("start", brushstart)
        .on("brush", brushmove)
        .on("end", brushend)
        .extent([
            [0, 0],
            [size, size]
        ]);

    var svg = d3.select("#svgElement").append("svg")
        .attr("width", size * n + padding+10)
        .attr("height", size * n + padding+20)
        .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) {
            return "translate(" + (n - i - 1) * size + ",0)";
        })
        .each(function(d) {
            x.domain(domainByTrait[d]);
            d3.select(this).call(xAxis);
        });

    svg.selectAll(".y.axis")
        .data(traits)
        .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) {
            return "translate(0," + i * size + ")";
        })
        .each(function(d) {
            y.domain(domainByTrait[d]);
            d3.select(this).call(yAxis);
        });

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
        .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) {
            return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")";
        })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) {
            return d.i === d.j;
        }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) {
            return d.x;
        });

    cell.call(brush);

    function plot(p) {
        var cell = d3.select(this);

        x.domain(domainByTrait[p.x]);
        y.domain(domainByTrait[p.y]);

        cell.append("rect")
            .attr("class", "frame")
            .attr("x", padding / 2)
            .attr("y", padding / 2)
            .attr("width", size - padding)
            .attr("height", size - padding);

        cell.selectAll("circle")
            .data(dataPCA)
            .enter().append("circle")
            .attr("cx", function(d) {
                return x(d[p.x]);
            })
            .attr("cy", function(d) {
                return y(d[p.y]);
            })
            .attr("r", 4)
            .style("fill", function(d) {
                return color(d.target);
            });
    }

    var brushCell;

    // Clear the previously-active brush, if any.
    function brushstart(p) {
        if (brushCell !== this) {
            d3.select(brushCell).call(brush.move, null);
            brushCell = this;
            x.domain(domainByTrait[p.x]);
            y.domain(domainByTrait[p.y]);
        }
    }

    // Highlight the selected circles.
    function brushmove(p) {
        var e = d3.brushSelection(this);
        svg.selectAll("circle").classed("hidden", function(d) {
            return !e ?
                false :
                (
                    e[0][0] > x(+d[p.x]) || x(+d[p.x]) > e[1][0] ||
                    e[0][1] > y(+d[p.y]) || y(+d[p.y]) > e[1][1]
                );
        });
    }

    // If the brush is empty, select all circles.
    function brushend() {
        var e = d3.brushSelection(this);
        if (e === null) svg.selectAll(".hidden").classed("hidden", false);
    }


    function cross(a, b) {
        var c = [],
            n = a.length,
            m = b.length,
            i, j;
        for (i = -1; ++i < n;)
            for (j = -1; ++j < m;) c.push({
                x: a[i],
                i: i,
                y: b[j],
                j: j
            });
        return c;
    }
}

function task3c(data) {
    updateSelectedTask("task3c");
    //console.log(data["0"])
    //console.log(data)
    var pcaOrg = JSON.parse(data["0"]["0"]);
    // console.log(pcaOrg)
    plot(pcaOrg["values"])
    d3.select("#svgElement")
        .append("span")
        .html("<br>PCA Original Scatterplot Matrix<br>")
        .append("hr")

    var pcaRand = JSON.parse(data["0"]["1"]);
    // console.log(pcaOrg)
    plot(pcaRand["values"])
    d3.select("#svgElement")
        .append("span")
        .html("<br>PCA Random Sampled<br>")
        .append("hr")

    var pcaStrat = JSON.parse(data["0"]["2"]);
    // console.log(pcaOrg)
    plot(pcaStrat["values"])
    d3.select("#svgElement")
        .append("span")
        .html("<br>PCA Stratified Sampled<br>")
        .append("hr")
}
