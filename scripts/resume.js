

// set the dimensions and margins of the graph

clearTableRows();
/**
var $table = $('table.scroll'),
    $bodyCells = $table.find('tbody tr:first').children(),
    colWidth;

// Adjust the width of thead cells when window resizes
$(window).resize(function() {
    // Get the tbody columns width array
    colWidth = $bodyCells.map(function() {
        return $(this).width();
    }).get();
    
    // Set the width of thead columns
    $table.find('thead tr').children().each(function(i, v) {
        $(v).width(colWidth[i]);
    });    
}).resize(); // Trigger resize handler
**/
var margin = {top: 50, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var dateFormat = d3.timeFormat("%b %Y");

// append the svg object to the body of the page



var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
	plot_dy = height - margin.top - margin.bottom;
		 
        d3.csv("data/resume.csv", d => {
			
            var my_color_k = d3.scaleOrdinal(d3.schemeCategory20);
			
					
				var d_extent_x = d3.extent(d, d => (d.start_year)),
					d_extent_y = d3.extent(d, d => +d.total_years);

			
					
					var x = d3.scaleLinear()
                  .domain([ d3.min(d, function(d) { return d.start_year; }),
                            d3.max(d, function(d) { return d.start_year; }) ])
                  .range([0, width]);
					
				
				  svg.append("g")
					 .attr("class", "x axis")
					 .attr("transform", "translate(0, 420)")
					//.attr("transform", "translate(0," + height + ")")
					.call(d3.axisBottom(x))//.tickFormat(d3.format("d"))
				.append("text")
				
				  .attr("class", "axis-label")
				  //.attr("transform", "translate(0," + ( margin.bottom / 2) + ")")
				  .attr("x", width/2)
				  .attr("y", 30)
				  .style("text-anchor", "end")
				  .style("overflow-y", "scroll")
				  .text("Year");
					
			

				  // Add Y axis
				  var y = d3.scaleLinear()
					.domain(d_extent_y)
					.range([ height, 0]);
				  svg.append("g")
						.attr("class", "y axis")
						//
						.call(d3.axisLeft(y))
					.append("text")
						 .attr("class", "axis-label")						 
						 .attr("transform", "rotate(-90)")
						 .attr("y", 6)
						 .attr("dy", ".71em")
						 .style("text-anchor", "end")
						 .text("Achivement");
						
				
				// Add the tooltip container to the vis container
              // it's invisible and its position/contents are defined during mouseover
              var tooltip = d3.select("#chart").append("svg")
                  .attr("class", "tooltip")
                  .style("opacity", 0);

              // tooltip mouseover event handler
              var tipMouseover = function(d) {
                  var color = my_color_k(d.work_or_study);
                  var html  = d.start_year + "<br/>" +
                              "<span style='color:" + color + ";'>" + d.work_or_study + "</span><br/>" +
                              "<b>" + d.total_years + "</b> sugar, <b/>" + d.grade + "</b> calories";

                  tooltip.html(html)
                      .style("left", (d3.event.pageX + 15) + "px")
                      .style("top", (d3.event.pageY - 28) + "px")
                    .transition()
                      .duration(200) // ms
                      .style("opacity", .9) // started as 0!

              };
              // tooltip mouseout event handler
              var tipMouseout = function(d) {
                  tooltip.transition()
                      .duration(300) // ms
                      .style("opacity", 0); // don't care about position!
              };
              
				

						var circles = svg.append("g")
                             .selectAll("circle")
                             .data(d)
                             .enter()
                             .append("circle")
                             .attr("r", 5)
							 .style("fill", function(d) { return my_color_k(d.work_or_study);})
                             .attr("cx", (d) => x(+d.start_year))
                             .attr("cy", (d) => y(+d.total_years))
                             .attr("class", "non_brushed")
                         .on("mouseover", tipMouseover)
                .on("mouseout", tipMouseout);
							 
				 //tabulate(d,['degree']);

            function highlightBrushedCircles() {

                if (d3.event.selection != null) {

                    // revert circles to initial style
                    circles.attr("class", "non_brushed");

                    var brush_coords = d3.brushSelection(this);

                    // style brushed circles
                    circles.filter(function (){

                               var cx = d3.select(this).attr("cx"),
                                   cy = d3.select(this).attr("cy");

                               return isBrushed(brush_coords, cx, cy);
                           })
                           .attr("class", "brushed");
                }
            }

            function displayTable() {
				
                // disregard brushes w/o selections  
                // ref: http://bl.ocks.org/mbostock/6232537
                if (!d3.event.selection) return;

                // programmed clearing of brush after mouse-up
                // ref: https://github.com/d3/d3-brush/issues/10
                d3.select(this).call(brush.move, null);

                var d_brushed =  d3.selectAll(".brushed").data();
		
                // populate table if one or more elements is brushed
                if (d_brushed.length > 0) {
                    clearTableRows();
					//d3.selectAll(".row_data").remove();
					 
                    d_brushed.forEach(d_row => populateTableRow(d_row))
                } else {
                    clearTableRows();
					
					
                }
            }

            var brush = d3.brush()
                          .on("brush", highlightBrushedCircles)
                          .on("end", displayTable); 

            svg.append("g")
               .call(brush);
			   
			   
			  // draw legend
  var legend = svg.selectAll(".legend")
      .data(my_color_k.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; }); 
		
// draw legend colored rectangles
   legend.append("rect")
      .attr("x", width - 50)
      .attr("width", 15)
      .attr("height", 15)
      .style("fill", my_color_k);
	  
	  // draw legend text
  legend.append("text")
      .attr("x", width -60)
      .attr("y", 5)
      .attr("dy", ".55em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})

	  
			   
        });
		
		

        function clearTableRows() {

            hideTableColNames();
            d3.selectAll(".row_data").remove();
        }

        function isBrushed(brush_coords, cx, cy) {

             var x0 = brush_coords[0][0],
                 x1 = brush_coords[1][0],
                 y0 = brush_coords[0][1],
                 y1 = brush_coords[1][1];

            return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }

        function hideTableColNames() {
            d3.select("table").style("visibility", "hidden");
        }

        function showTableColNames() {

				
            d3.select("table").style("visibility", "visible").attr('style', "height:500;width:960;overflow:auto;");;
        }

        function populateTableRow(d_row) {

            showTableColNames();

            var d_row_filter = [d_row.start_year,
								d_row.degree,			
                                d_row.total_years, 
                                d_row.university_or_company,
								d_row.gpa,
								d_row.country,
								d_row.time_period,
								d_row.work_or_study,
								d_row.work,
								d_row.project];
								
			

            d3.select("table")
              .append("tr")
              .attr("class", "row_data")
              .selectAll("td")
              .data(d_row_filter)
              .enter()
              .append("td")
              .attr("align", (d, i) => i == 0 ? "left" : "left").attr("id", "halfpage")
              .text(d => d);
        }
		
	/**	
function tabulate(data, columns) {
    var table = d3.select("body").append("table")
            .attr("style", "margin-left: 250px"),
        thead = table.append("thead"),
        tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns)
        .enter()
        .append("th")
            .text(function(column) { return column; });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return {column: column, value: row[column]};
            });
        })
        .enter()
        .append("td")
        .attr("style", "font-family: Courier")
            .html(function(d) { return d.value; });
    
    return table;
}**/
