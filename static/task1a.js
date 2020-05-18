function task1a(data) {
    randomSD=JSON.parse(data["randomSampling"]);
    stratSD=JSON.parse(data["stratifiedSampling"]);

    console.log(randomSD)
    console.log(stratSD)
    var countRandom=0;
    //console.log(data["A1"])
    for (x in randomSD["A1"]) {
        countRandom+=1;
    }
    var countStrat=0;
    for (x in stratSD["A1"])
    {
        countStrat+=1;
    }
    // d3.select("#task1a")
    //     .node().classList.add("active");
    updateSelectedTask("task1a");

    var htmlString="Task 1(a)<br>Original No. of rows in data: 690 \
                                <br>No. of rows in data after random sampling: \
                                "+countRandom+"<br>No. of rows in data after stratified sampling: "+countStrat
    d3.select("#variable").html(htmlString);

}
