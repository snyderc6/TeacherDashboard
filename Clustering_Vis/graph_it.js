/*
* Plotting results
* Caitlin Snyder
* Feburary 2019
* 
* Adopting code from Jason Davies's and Michele Weigle's Block
*/


function plot_it()  {
	 var margin = {top: 50, right: 90, bottom: 100, left: 90},
     width = 600 - margin.left - margin.right,
     // gridSize = Math.floor(widthActions/861),
    // heightActions = gridSize * (studentIds.length+2);
    height = 400 - margin.bottom - margin.top;


  	var svg3 = d3.select("body").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)

var spacer = d3.select("body").append("svg")
    	.attr("width", 100)
    	.attr("height", 400)
     

  	 
  	 var svg5 = d3.select("body")
.append("svg")
  .attr("width", width + 200 + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


	
	//var margin = {top: 50, right: 50, bottom: 100, left: 50},
    var margin = {top: 50, right: 50, bottom: 50, left: 50},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
 // 	var	margin = {top: 30, right: 20, bottom: 30, left: 50},
	// width = 800 - margin.left - margin.right,
	// height = 415 - margin.top - margin.bottom;
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
	

				    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		
		var spacer2 = d3.select("body").append("svg")
    	.attr("width", 250)
    	.attr("height", 400)

		var svg2 = d3.select("body").append("svg")
    	.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.attr("style", "outline: thin solid black;") 
  		.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")") 
   

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
	      // .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
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
	      .text(function(d) { return "Cluster " + d;})

	 // add the tooltip area to the webpage
	var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

	 var circles = svg2.append("g").selectAll(".dot")
      .data(pca_data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));})
      .attr("class", "non_brushed")
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
      // .on("click", clicked);

    svg2.append("g")
      .call(d3.brush()
          .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]])
          .on("brush end", brushed));
  

  function brushed() {
    var selection = d3.event.selection;
    if (selection) {
    	circles.attr("class", "non_brushed");
        var brush_coords = d3.brushSelection(this);

        circles.filter(function (){

            var cx = d3.select(this).attr("cx"),
                cy = d3.select(this).attr("cy");
                return isBrushed(brush_coords, cx, cy);
            })
            .attr("class", "brushed");


	    var d_brushed =  svg2.selectAll(".brushed").data();
	 //    var d_brushed_for =  svg2.selectAll(".foregound").data();
		// //console.log("length", d_brushed)
	                // populate table if one or more elements is brushed
	    if (d_brushed.length > 0) {
	    	console.log("brushed",d_brushed)
	        svg3.selectAll("*").remove();
	        var studentIds = mapStudents(d_brushed);
	        populateBar(studentIds);
	        //populateParallel(d_brushed);
	        svg5.selectAll("*").remove();
	        setUpActions(studentIds);
	       	// studentIds.forEach(student => populateActionView(student, studentIds.indexOf(student), studentIds));


	    } else {
	         svg3.selectAll("*").remove();
	    }
    }

  }

  function setUpActions(studentIds){
  	var margin = {top: 30, right: 30, bottom: 30, left: 30},
     width = 600 - margin.left - margin.right,
     // gridSize = Math.floor(widthActions/861),
    // heightActions = gridSize * (studentIds.length+2);
    height = 400 - margin.bottom - margin.top;
  	console.log("calling set up Actions")
  	console.log("dat1", studentIds)
  	
    var actions = d3.range(200);
   
     svg5.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	 var actionColor = d3.scaleOrdinal()
		    .domain(["MODEL", "CREATE", "PLAY", "STOP", "STEP", "CHANGE", "None"])
		     .range(["#6600CC","#FF00FF","#009933","#FF0000", "#0099FF", "#FF9900", "#FFFFFF"]);

		var x = d3.scaleBand()
		  .range([ 0, width ])
		  .domain(actions)
		  .padding(0.9);

	svg5.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  // .call(d3.axisBottom(x))

	 var y = d3.scaleBand()
		  .range([ height, 0 ])
		  .domain(studentIds)
		  .padding(0.9);
	svg5.append("g")
		  .call(d3.axisLeft(y));

	svg5.selectAll()
      .data(sepActions_data, function(d) {return d.student+':'+d.actionNum;})
      .enter()
      .append("rect")
      .filter(function(d){return studentIds.includes(d.student)})
      .attr("x", function(d) { return x(d.actionNum) })
      .attr("y", function(d) { return y(d.student) })
      .attr("width", x.bandwidth()*11 )
      .attr("height", y.bandwidth()*4)
      .style("fill", function(d) {return actionColor(d.actionType)} );

       		// draw legend
		  var legend = svg5.selectAll(".legend")
		      .data(actionColor.domain())
		    .enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		  // draw legend colored rectangles
		  legend.append("rect")
		      .attr("x", width + 10)
		      .attr("width", 18)
		      .attr("height", 18)
		      .style("fill", actionColor)
		       .on("click", function(d){
		       	clickedAction(this, studentIds,d)});

		  // draw legend text
		  legend.append("text")
		      .attr("x", width )
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .text(function(d) { if(d!= "None"){return d;}})
	
  }

  function clickedAction(element, studentIds,elemColor){
  	 svg5.selectAll("*").remove();

var margin = {top: 30, right: 30, bottom: 30, left: 30},
     width = 600 - margin.left - margin.right,
  
    height = 400 - margin.bottom - margin.top;
    var actions = d3.range(200);
   
     svg5.attr("width", width + margin.left + margin.right)
    	.attr("height", height + margin.top + margin.bottom)
    	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	 var actionColor = d3.scaleOrdinal()
		    .domain(["MODEL", "CREATE", "PLAY", "STOP", "STEP", "CHANGE", "None"])
		     .range(["#6600CC","#FF00FF","#009933","#FF0000", "#0099FF", "#FF9900", "#FFFFFF"]);



		var x = d3.scaleBand()
		  .range([ 0, width ])
		  .domain(actions)
		  .padding(0.9);

	svg5.append("g")
	  .attr("transform", "translate(0," + height + ")")
	  // .call(d3.axisBottom(x))

	 var y = d3.scaleBand()
		  .range([ height, 0 ])
		  .domain(studentIds)
		  .padding(0.9);
	svg5.append("g")
		  .call(d3.axisLeft(y));

	svg5.selectAll()
      .data(sepActions_data, function(d) {return d.student+':'+d.actionNum;})
      .enter()
      .append("rect")
      .filter(function(d){return studentIds.includes(d.student)})
      .attr("x", function(d) { return x(d.actionNum) })
      .attr("y", function(d) { return y(d.student) })
      .attr("width", x.bandwidth()*11 )
      .attr("height", y.bandwidth()*4)
      .style("fill", function(d) {
      	if(d.actionType == elemColor){
			return actionColor(d.actionType)
      	}else{
      		return "#FFFFFF" ;
      	}
      	
      } );


       		// draw legend
		  var legend = svg5.selectAll(".legend")
		      .data(actionColor.domain())
		    .enter().append("g")
		      .attr("class", "legend")
		      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		  // draw legend colored rectangles
		  legend.append("rect")
		      .attr("x", width + 10)
		      .attr("width", 18)
		      .attr("height", 18)
		      .style("fill", actionColor)
		       .on("click", function(d){
		       	clickedAction(this, studentIds, d)});

		  // draw legend text
		  legend.append("text")
		      .attr("x", width)
		      .attr("y", 9)
		      .attr("dy", ".35em")
		      .style("text-anchor", "end")
		      .text(function(d) { if(d!= "None"){return d;}})


	        
  }

  function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }

  function mapStudents(students){
  	var studentIds = [];
  	for (var i = students.length - 1; i >= 0; i--) {
  		stud = students[i];
  		console.log("stud", stud)
  		var id = stud["student"];
  		console.log("id", id)
  		studentIds.push(id);
  	}
  
  	return(studentIds);
  }

 function populateBar(studentIds) {

 	 var margin = {top: 30, right: 30, bottom: 30, left: 30},
     width = 700 - margin.left - margin.right,
     // gridSize = Math.floor(widthActions/861),
    // heightActions = gridSize * (studentIds.length+2);
    height = 400 - margin.bottom - margin.top;

 	var groupKey = "student";
 	var keys = studentIds;

	
    
    x0 = function(i){}

	x1 = function(i){}

	x0 = d3.scaleBand()
    .domain(scores_data.map(d => d[groupKey]))
    .rangeRound([margin.left, width - margin.right])
    .paddingInner(0.1)

    x1 = d3.scaleBand()
    .domain(keys)
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05)

    y = function(n){}
    y = d3.scaleLinear()
    .domain([0, d3.max(scores_data, d => d3.max(keys, key => d[key]))]).nice()
    .rangeRound([height - margin.bottom, margin.top])

    xAxis = function(g){}

	yAxis = function(g){}

	xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x0).tickSizeOuter(0))
    .call(g => g.select(".domain").remove())

    yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "s"))
    .call(g => g.select(".domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(scores_data.y))

 	var selection = svg3.append("g")
    .selectAll("g")
    .data(scores_data)
    .join("g")
      .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
    .selectAll("rect")
    .data(d => keys.map(key => ({key, value: d[key]})))
    .join("rect")
      .attr("x", d => x1(d.key))
      .attr("y", d => y(d.value))
      .attr("width", x1.bandwidth())
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => color(getCluster(d.key)))
     

    
     
     // selection.selectAll("text")
       .data(scores_data)
        .enter().append("text")
        .attr("x", d => x1(d.key) )
        .attr("y", d => y(d.value))
         .text(function(d){ return d.key;})
        .attr("transform", "rotate(90)")
        .style('fill',"white")
        .style('font-size', '1.25em');




  	svg3.append("g")
      .call(xAxis);

 	 svg3.append("g")
      .call(yAxis);

     
 	
 }

 function getCluster(studentId){
 	if((studentId == "bzs02") || (studentId == "bzs07")){
 		return 1;
 	}else if((studentId == "bzs03") || (studentId == "bzs13")|| (studentId == "bzs14")){
 		return 2;
 	}else{
 		return 0;
 	}
 }

 function populateParallel(student){
 	svg1.append("g")
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



 }
      

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




}
