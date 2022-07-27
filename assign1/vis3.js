function init(){

  width = 1200,
 height = 700 ;

 // append the svg object to the body of the page
 var svg = d3.select("#chart")
         .append("svg")
         .attr("width", width + 100 )
         .attr("height", height + 100)
         .append("g")
         .attr("transform", "translate(" + 60 + "," + 40 + ")");

 //Read the data
 d3.csv("scatter_data.csv", function(data) {

 // Add X axis
 var x = d3.scaleLinear()
 .domain([0, 0])
 .range([ 0, width ]);
 svg.append("g")
  .attr("class", "myXaxis")
 .call(d3.axisBottom(x))
 .attr("transform", "translate(0," + height + ")")
 .call(d3.axisBottom(x).ticks(10));

 // Add Y axis
 var y = d3.scaleLinear()
 .domain([0, 25])
 .range([ height, 0]);
 svg.append("g")
 .call(d3.axisLeft(y).ticks(6));

 // Color scale: give me a specie name, I return a color
 var color = d3.scaleOrdinal()
 .domain(["Asia", "Africa", "NorthAmerica", "SouthAmerica", "Europe", "Australia"])
 .range(['#242F40','#AE9C45','#F0E442','#D55E00','#CC79A7','#71D0F5FF'])

 svg.append("text")
   .attr("text-anchor", "end")
   .attr("x", width - 400)
   .attr("y", height + 50)
   .text("Energy Consumption (ExaJoules)");

 // Y axis label:
 svg.append("text")
   .attr("text-anchor", "end")
   .attr("transform", "rotate(-90)")
   .attr("y", -40)
   .attr("x", -180)
   .text("CO2  emission level")


 var tooltip = d3.select('#chart')
 .append("div")
 .style("opacity", 0.8)
 .attr("class", "tooltip")
 .style("background-color", "white")
 .style("border", "solid")
 .style("border-width", "2px")
 .style("border-radius", "5px")
 .style("padding", "5px")

 var mouseover = function(d) {
     selected_country = d.Continent;
     d3.selectAll(".dot")
     .transition()
     .duration(200)
     .style("fill", "lightgrey")
     .attr("r", 4.5)
     tooltip
         .html("Country: " + d.Entity + "<br>" + "Consumption: " + d.energy + "ExaJoules" + "<br>" + "Co2 Emmision: " + d.carbon + " t" )
         .style("opacity", 1)
 }

 var mousemove = function(d) {
     selected_country = d.Continent;
     d3.select(this)
     .transition()
     .duration(400)
     .style("fill", color(selected_country))
     .attr("r", 6.5)
     // d3.selectAll("." + selected_country)
     // .transition()
     // .duration(200)
     // .style("fill", color(selected_country))
     // .attr("r", 7)

     tooltip
         .style("left", (d3.mouse(this)[0])+ 300 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
         .style("top", (d3.mouse(this)[1]+500) + "px")
 }

 var mouseleave = function(d) {
     d3.selectAll('.dot')
         .transition()
         .duration(500)
         .style("fill", function(d) {
             return color(d.Continent);
         })
         .attr("r", 4);
     tooltip
         .style("opacity", 0)
 }


 // Add dots
 svg.append('g')
 .selectAll("dot")
 .data(data)
 .enter()
 .append("circle")
 .attr("class", function (d) { return "dot " + d.Continent} )
 .attr("cx", function (d) { return x(d.energy); } )
 .attr("cy", function (d) { return y(d.carbon); } )
 .attr("r", 4)
 .style("fill", function (d) { return color(d.Continent) } )
 .on("mouseover", mouseover)
 .on("mousemove", mousemove)
 .on("mouseleave", mouseleave)


 var highlight = function(d){
 // reduce opacity of all groups
 d3.selectAll(".dot").style("opacity", .05)
 // expect the one that is hovered
 d3.selectAll("."+d).style("opacity", 1)
   .attr("r", 6.5)
 }

 // And when it is not hovered anymore
 var noHighlight = function(d){
 d3.selectAll(".dot").style("opacity", 1)
  .attr("r", 4)
 }

 var size = 20
 var allgroups = ["Asia", "Africa", "NorthAmerica", "SouthAmerica", "Europe", "Australia"]

 svg.selectAll("myrect")
       .data(allgroups)
       .enter()
       .append("rect")
         .attr("x", 900)
         .attr("y", function(d,i){ return i*(25)})
         .attr("width", 20)
         .attr("height", 20)
         .style("fill", function(d){ return color(d)})
         .on("mouseover", highlight)
          .on("mouseleave", noHighlight)

 // Add labels beside legend dots
 svg.selectAll("mylabels")
   .data(allgroups)
   .enter()
   .append("text")
     .attr("x", 920 + size*.8)
     .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
     .style("fill", function(d){ return color(d)})
     .text(function(d){ return d})
     .attr("text-anchor", "left")
     .style("alignment-baseline", "middle")
     .on("mouseover", highlight)
     .on("mouseleave", noHighlight)

 function updatePlot() {

 // Get the value of the button
 xlim = this.value

 // Update X axis
 x.domain([0,xlim])
 svg.select(".myXaxis")
 .transition()
 .duration(100)
 .call(d3.axisBottom(x))

 // Update chart
 svg.selectAll("circle")
    .data(data)
    .transition()
    .duration(100)
    .attr("cx", function (d) { return x(d.energy); } )
    .attr("cy", function (d) { return y(d.carbon); } )
 }

 // Add an event listener to the button created in the html part
 d3.select("#buttonXlim").on("input", updatePlot )


 x.domain([0, 35])
 svg.select(".myXaxis")
 .transition()
 .duration(2000)
 .attr("opacity", "1")
 .call(d3.axisBottom(x));

 svg.selectAll("circle")
 .transition()
 .delay(function(d,i){return(i*4)})
 .duration(2000)
 .attr("cx", function (d) { return x(d.energy); } )
 .attr("cy", function (d) { return y(d.carbon); } )
 })


}
window.onload=init;
