/*
* Plotting results
* Caitlin Snyder
* Feburary 2019
* 
* Adopting code from Jason Davies's and Michele Weigle's Block
*/
function plot_it()  {
	
	//var margin = {top: 50, right: 50, bottom: 100, left: 50},
    var margin = {top: 50, right: 50, bottom: 100, left: 50},
    width = 960 - margin.left - margin.right,
    height = 415 - margin.top - margin.bottom;
 // 	var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	// width = 800 - margin.left - margin.right,
	// height = 415 - margin.top - margin.bottom;
 
	var x = d3.scalePoint().range([0, width], 1),
	y = {},
    dragging = {};

	var line = d3.line(),
    	axis = d3.axisLeft,
    	background,
    	foreground;
   	var cValue = function(d) { return d["cluster"];},
   	color = d3.scaleOrdinal(d3.schemeCategory10);

	var svg1 = d3.select("body").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  		.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Extract the list of dimensions and create a scale for each.
	  x.domain(dimensions = d3.keys(features_data[0]).filter(function(d) {
	    return d != "student" && d != "cluster" && (y[d] = d3.scaleLinear()
	        .domain(d3.extent(features_data, function(p) { return +p[d]; }))
	        .range([height, 0]));
	  }));

	// Add grey background lines for context.
	  background = svg1.append("g")
	      .attr("class", "background")
	    .selectAll("path")
	      .data(features_data)
	    .enter().append("path")
	      .attr("d", path);

	  // Add blue foreground lines for focus.
	  foreground = svg1.append("g")
	      .attr("class", "foreground")
	    .selectAll("path")
	      .data(features_data)
	    .enter().append("path")
	    .style("stroke", function(d){return color(cValue(d));})
	      .attr("d", path);

	     
	  
	  // Add a group element for each dimension.
	  var g = svg1.selectAll(".dimension")
	      .data(dimensions)
	    .enter().append("g")
	      .attr("class", "dimension")
	      .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

	   // Add an axis and title.

		  g.append("g")
		      .attr("class", "axis")
		      .each(function(d) { d3.select(this).call(d3.axisLeft(y[d])); })
		    .append("text")
		    .attr("fill", "black")
		      .style("text-anchor", "middle")
		      .attr("y", -9)
		      .text(function(d) { return d });

				    


		var svg2 = d3.select("body").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  		.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");  

    	// setup x 
		var xValue = function(d) { return d['x'];}, 
		    xScale = d3.scaleLinear().range([0, width]), 
		    xMap = function(d) { return xScale(xValue(d));},
		    xAxis = d3.axisBottom().scale(xScale);

		// setup y
		var yValue = function(d) { return d["y"];}, 
		    yScale = d3.scaleLinear().range([height, 0]), 
		    yMap = function(d) { return yScale(yValue(d));}, 
		    yAxis = d3.axisLeft().scale(yScale);

		var cValue = function(d) { return d["cluster"];},
		
    	color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(0,3));

		xScale.domain([d3.min(pca_data, xValue)-4, d3.max(pca_data, xValue)+1]);
 		yScale.domain([d3.min(pca_data, yValue)-4, d3.max(pca_data, yValue)+1]);

	 		// draw legend
	  var legend = svg2.selectAll(".legend")
	      .data(color.domain())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  // draw legend colored rectangles
	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  // draw legend text
	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return "Cluser " + d;})

	 // add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

	   svg2.selectAll(".dot")
      .data(pca_data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d["student"])
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
      .on("click", clicked);

        

      function brushed() {
	    let value = [];
	    if (d3.event.selection) {
	      const [[x0, y0], [x1, y1]] = d3.event.selection;
	      value = pca_data.filter(d => x0 <= x(d.x) && x(d.x) < x1 && y0 <= y(d.y) && y(d.y) < y1);
	    }
	    svg2.property("value", value).dispatch("input");
  	}



  	var svg3 = d3.select("body").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)

   var svg4 = d3.select("body").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
  		// .append("g")
    // 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  	function clicked(element){

		svg3.selectAll("*").remove();
  		console.log(element);
  		var id = element["student"];
  		console.log(id);
		var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);
        var g = svg3.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");
         xScale.domain(t_features_data.map(function(d) { return d.student; }));
         yScale.domain([0, d3.max(t_features_data, function(d) { return d[id]; })]);
         g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

         

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }).ticks(15));
         // .append("text")
         // .attr("y", 6)
         // .attr("dy", "0.71em")
         // .attr("text-anchor", "end")
         // .text("id");

          g.selectAll(".bar")
         .data(t_features_data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.student); })
         .attr("y", function(d) { return yScale(d[id]); })
         .attr("fill", function(d){return color(element["cluster"]);})
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d[id]); });



         svg4.selectAll("*").remove();
  		console.log(element);
  		var id = element["student"];
  		console.log(id);
		var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
        yScale = d3.scaleLinear().range ([height, 0]);
        var g = svg4.append("g")
               .attr("transform", "translate(" + 100 + "," + 100 + ")");
         xScale.domain(scores_data.map(function(d) {return d.student; }));
         yScale.domain([0, d3.max(scores_data, function(d) { return d[id]; })]);
         g.append("g")
         .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale));
         

        g.append("g")
         .call(d3.axisLeft(yScale).tickFormat(function(d){
             return d;
         }).ticks(8));
         // .append("text")
         // .attr("y", 6)
         // .attr("dy", "0.71em")
         // .attr("text-anchor", "end")
         // .text("id");

          g.selectAll(".bar")
         .data(scores_data)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d) { return xScale(d.student); })
         .attr("y", function(d) { return yScale(d[id]); })
         .attr("fill", function(d){return color(element["cluster"]);})
         .attr("width", xScale.bandwidth())
         .attr("height", function(d) { return height - yScale(d[id]); });
    	
  	}



   

	   // console.log(features_data["student"])
	   // console.log("testing")

	  //  svg3.selectAll("div")
	  //   .data(data)
	  // .enter().append("div")
	  //   .style("width", function(d) { return d * 10 + "px"; })
	  //   .text(function(d) { return d; });
      

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
	 function brush() {
	    render.invalidate();

	    var actives = [];
	    svg1.selectAll(".axis .brush")
	      .filter(function(d) {
	        return d3.brushSelection(this);
	      })
	      .each(function(d) {
	        actives.push({
	          dimension: d,
	          extent: d3.brushSelection(this)
	        });
	      });

	    var selected = features_data.filter(function(d) {
	      if (actives.every(function(active) {
	          var dim = active.dimension;
	          // test if point is within extents for each active brush
	          return dim.type.within(d[dim.key], active.extent, dim);
	        })) {
	        return true;
	      }
	    });
	}



}
