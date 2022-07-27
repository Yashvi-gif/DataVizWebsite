function init(){

  // setting the hieght and width of the svg canvas
  var w = 500;
  var h = 500;
  var padding = -100;


  // append the svg object to the body (id = chart)
  var svg = d3.select("#chart")
    .append("svg")
      .attr("width", w + 1600)
      .attr("height", h + 70)
    .append("g")
        .attr("transform", "translate(" + (60) +  "," + (10) +  ")");

  // Parsing the Data fromt he csv file
  d3.csv("stackk.csv", function(data) {

    // List of different energies = header of the csv files
    var energy = data.columns.slice(1) //slicing forms a new array with selected elements

    // List of states = names of the different states (mapping them to the x axis)
    var states = d3.map(data, function(d){return(d.state)}).keys()

    // Adding x axis
    var x = d3.scaleBand()
        .domain(states)
        .range([0, w])
        .padding([0.5])
    svg.append("g")
      .attr("transform", "translate(0," + h + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0));
// addinng the states label below x axis
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", w-240)
        .attr("y", h+40 )
        .text("States");
//addinf the percent of energy label on the left of y axis
        svg.append("text")
            .attr("text-anchor", "end")
.attr("transform", "rotate(-90)")
            .attr("x",-320)
            .attr("y", -40 )
            .text("Percent of energy")
            .attr("text-anchor", "start")

    // Adding y axis
    var y = d3.scaleLinear()
      .domain([0, 100])
      .range([ h, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));



  //defining the color scheme
  var color = d3.scaleOrdinal()
                .range(['#264653','#2a988f','#e76f51','#b5d1e2'])

  //stacking the data
  var stackedData = d3.stack()

    .keys(energy)

    (data)



svg.selectAll("myrect")
.data(stackedData)
.enter()
.append("rect")
 .attr("x", 650)
 .attr("y", function(d,i){ return i*(25)})
 .attr("width", 20)
 .attr("height", 20)

 .style("fill", function(d){ return color(d)})


// creating the legend labels
svg.selectAll("mylabels")
.data(energy)
.enter()
.append("text")
 .attr("x", 650 + 20*1.2)
 .attr("y", function(d,i){ return 10+ i*(25) })
 .style("fill", function(d){ return color(d)})
 .text(function(d){ return d})
 .attr("text-anchor", "left")
 .style("alignment-baseline", "middle")




// adding the tooltip which would display the info for our graph when hovered
  var tooltip = d3.select("#chart")
.append("body")
.style("opacity", 0)
.style("position", "absolute")
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "10px")

//creating the mouseover function that defines what happens when we hover
      var mouseover = function(d) {
      // selecting the subgroup
      var subgroupName = d3.select(this.parentNode).datum().key;
      // extracting the specific value(percent) for that subgroup(energy)
      var subgroupValue = d.data[subgroupName];

      //setting the tooltip
      tooltip
      .html("Type of energy: " + subgroupName + "<br>" + "Percentage of energy used: " + subgroupValue)
          .style("opacity", 1)
         d3.select(this)

     .style("opacity", 1)

      // Reduce opacity of all other areas/rect to 0.2
      d3.selectAll(".myRect").style("opacity", 0.2)
      // Highlight all rects of this subgroup (selected via their specific name) with opacity 0.8.
      d3.selectAll("."+subgroupName)
        .style("opacity", 1)
      }
// defining the mousemove function
var mousemove = function(d) {
tooltip
.style("left", (d3.mouse(this)[0] + 90) + "px")
.style("top", (d3.mouse(this)[1] + 500) + "px")

}

    // deinfing the fucntion for whent he mouse is not hovered anymore over that area
    var mouseleave = function(d) {
tooltip
.style("opacity", 0)
      // Back to normal opacity: 0.8
      d3.selectAll(".myRect")
        .style("opacity",0.8)
      }

    // displaying the bars
    svg.append("g")
      .selectAll("g")
      // Enter in the stack data = loop the columns
      .data(stackedData)
      .enter().append("g")

        .attr("fill", function(d) { return color(d.key); })
        .attr("class", function(d){ return "myRect " + d.key })

        .selectAll("rect")
        // enter a second time = loop per energy type to add all rectangles
        .data(function(d){ return d; })
        .enter().append("rect")

          .attr("x", function(d) { return x(d.data.state); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .attr("width",x.bandwidth())
          .attr("stroke", "grey")
          .on("mouseover", mouseover)
           .on("mousemove", mousemove)
          .on("mouseleave", mouseleave)
  })

}
window.onload=init;
