/*
* Plotting results
* Caitlin Snyder
* Feburary 2019
* 
* Adopting code from Jason Davies's and Michele Weigle's Block
*/
function plot_it()  {
	var margin = {top: 100, right: 50, bottom: 100, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

 
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
	      .attr("d", path)
	     .attr({'style': function(d){return "stroke: " + color(cValue(d))}});
	      

	  // Add a group element for each dimension.
	  var g = svg1.selectAll(".dimension")
	      .data(dimensions)
	    .enter().append("g")
	      .attr("class", "dimension")
	      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
	      .call(d3.drag()
	        .subject(function(d) { return {x: x(d)}; })
	        .on("start", function(d) {
	          dragging[d] = x(d);
	          background.attr("visibility", "hidden");
	        })
	        .on("drag", function(d) {
	          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
	          foreground.attr("d", path);
	          dimensions.sort(function(a, b) { return position(a) - position(b); });
	          x.domain(dimensions);
	          g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
	        })
	        .on("end", function(d) {
	          delete dragging[d];
	          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
	          transition(foreground).attr("d", path);
	          background
	              .attr("d", path)
	            .transition()
	              .delay(500)
	              .duration(0)
	              .attr("visibility", null);
	        }));

	   // Add an axis and title.
		  g.append("g")
		      .attr("class", "axis")
		      .each(function(d) { d3.select(this).call(d3.axisLeft(y[d])); })
		    .append("text")
		      .style("text-anchor", "middle")
		      .attr("y", -9)
		      .text(function(d) { return d; });

			// g.append("g")
	  //     .attr("class", "brush")
	  //     .each(function(d) {
	  //       d3.select(this).call(y[d].brush = d3.brushY().on("start", brushstart).on("brush", brush));
	  //     })
	  //   .selectAll("rect")
	  //     .attr("x", -8)
	  //     .attr("width", 16);

		


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
		//const cValue = d => d["cluster"];
    	color = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(0,3));

		xScale.domain([d3.min(pca_data, xValue)-4, d3.max(pca_data, xValue)+1]);
 		yScale.domain([d3.min(pca_data, yValue)-4, d3.max(pca_data, yValue)+1]);
 		// x-axis
	 

	   svg2.selectAll(".dot")
      .data(pca_data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) ;
      

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
		  var actives = dimensions.filter(function(p) { return !(y[p].extent == null); }),
		  extents = actives.map(function(p) { return y[p].brush.extent(); });
		  foreground.style("display", function(d) {
		  return actives.every(function(p, i) {
		        return extents[i].some(function(e){
		            return e[0] <= d[p] && d[p] <= e[1];
		        });
		  }) ? null : "none";
		 });
	}

	// Handles a brush event, toggling the display of foreground lines.
	// function brush() {
	//   var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
	//       extents = actives.map(function(p) { return y[p].brush.extent(); });
	//   foreground.style("display", function(d) {
	//     return actives.every(function(p, i) {
	//       return extents[i][0] <= d[p] && d[p] <= extents[i][1];
	//     }) ? null : "none";
	//   });
	// }
	// function brush() {

	//     var actives = [];
	//     svg1.selectAll(".axis .brush")
	//       .filter(function(d) {
	//         return d3.brushSelection(this);
	//       })
	//       .each(function(d) {
	//         actives.push({
	//           dimension: d,
	//           extent: d3.brushSelection(this)
	//         });
	//       });

	//     var selected = features_data.filter(function(d) {
	//       if (actives.every(function(active) {
	//           var dim = active.dimension;
	//           // test if point is within extents for each active brush
	//           return dim.type.within(d[dim.key], active.extent, dim);
	//         })) {
	//         return true;
	//       }
	//     });

 //    // show ticks for active brush dimensions
 //    // and filter ticks to only those within brush extents
    
 //    svg1.selectAll(".axis")
 //        .filter(function(d) {
 //          return actives.indexOf(d) > -1 ? true : false;
 //        })
 //        .classed("active", true)
 //        .each(function(dimension, i) {
 //          var extent = extents[i];
 //          d3.select(this)
 //            .selectAll(".tick text")
 //            .style("display", function(d) {
 //              var value = dimension.type.coerce(d);
 //              return dimension.type.within(value, extent, dimension) ? null : "none";
 //            });
 //        });

 //    // reset dimensions without active brushes
 //    svg1.selectAll(".axis")
 //        .filter(function(d) {
 //          return actives.indexOf(d) > -1 ? false : true;
 //        })
 //        .classed("active", false)
 //        .selectAll(".tick text")
 //          .style("display", null);
    

 //    //ctx.clearRect(0,0,width,height);
 //    //ctx.globalAlpha = d3.min([0.85/Math.pow(selected.length,0.3),1]);
 

 //    //output.text(d3.tsvFormat(selected.slice(0,24)));
 //  }




}
