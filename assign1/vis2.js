function init(){

  var h = 700;
  var w = 1000;
  //creating svg
  var svg = d3.select("#chart")
    .append("svg")
      .attr("width", w + 1200)
      .attr("height", h + 100)
    .append("g")
      .attr("transform",
            "translate(" + 80 + "," + 60 + ")");

  // Parsing the data
  d3.csv("areachartt.csv", function(data) {

    // List of columns = header of the csv file
    var column = data.columns.slice(1) //slicing forms a new array with selected elements

    // x axis
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.year; }))  //returns min and max value from the array
      .range([0,w]);
       svg.append("g")
          .attr("transform", "translate(0," + h + ")")
          .call(d3.axisBottom(x).ticks(28));
    // y axis
    var y = d3.scaleLinear()
      .domain([0, 7000])
      .range([ h, 20]);
       svg.append("g")
          .call(d3.axisLeft(y).ticks(15));


      svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", w - 500)
        .attr("y", h+40 )
        .text("Year");

    // Add Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
  .attr("transform", "rotate(-90)")
        .attr("x",-400)
        .attr("y", -50)
        .text("Energy(petajoules)")
        .attr("text-anchor", "start")

      // defining the color scheme for the graph areas
    var color = d3.scaleOrdinal()
      .domain(column)
      .range(['#ffb5c2','#ffb386','#97d8c4','#689ac4'])

    //stack the data; define new position of each subgroup
    var stackedData = d3.stack()
      .keys(column) //sending the column array
      (data)


    // Show the areas
    svg.selectAll("myareas")
      .data(stackedData)
      .enter()
      .append("path")
       .attr("class", function(d) { return "myArea " + d.key })
        .style("fill", function(d) { console.log(d.key) ; return color(d.key); })
        .attr("d", d3.area()
          .x(function(d, i) { return x(d.data.year); })
          .y0(function(d) { return y(d[0]); })
          .y1(function(d) { return y(d[1]); })
      )

   var highlight = function(d){
        console.log(d)
        // reduce opacity of all groups
        d3.selectAll(".myArea").style("opacity", 0)
        // expect the one that is hovered
        d3.select("."+d).style("opacity", 1)
      }

      // And when it is not hovered anymore
      var noHighlight = function(d){
        d3.selectAll(".myArea").style("opacity", 1)
      }

     svg.selectAll("myrect")
       .data(column)
       .enter()
       .append("rect")
         .attr("x", 1200)
         .attr("y", function(d,i){ return i*(25)})
         .attr("width", 20)
         .attr("height", 20)
         .style("fill", function(d){ return color(d)})
         .on("mouseover", highlight)
          .on("mouseleave", noHighlight)


    // creating the legend labels
     svg.selectAll("mylabels")
       .data(column)
       .enter()
       .append("text")
         .attr("x", 1200 + 20*1.2)
         .attr("y", function(d,i){ return 10+ i*(25) })
         .style("fill", function(d){ return color(d)})
         .text(function(d){ return d})
         .attr("text-anchor", "left")
         .style("alignment-baseline", "middle")
  .on("mouseover", highlight)
          .on("mouseleave", noHighlight)

  })

}
window.onload=init;
