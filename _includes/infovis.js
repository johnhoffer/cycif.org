
infovis = {};

infovis.renderMatrix = function(wid_waypoint, visdata){
    d3.csv(visdata)
        .then(function(data) {

            //tooltip
            var tooltip = d3.select("#viewer-waypoint").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            //vis object
            var vis = {};

            //all framing stuff
            vis.margin = { top: 40, right: 40, bottom: 0, left: 60 };
            vis.size = wid_waypoint.clientWidth;
            vis.width = vis.size - vis.margin.left - vis.margin.right;
            // vis.cellPadding = vis.width/data.length/3;
            // vis.cellHeight = vis.cellPadding * 2;
            // vis.cellWidth = vis.cellHeight;
            vis.cellPadding = 4;
            vis.cellWidth = (vis.width / Object.keys(data[0]).length) - vis.cellPadding;
            vis.cellHeight = vis.cellWidth;
            //vis.height = vis.size - vis.margin.top - vis.margin.bottom;
            vis.height = data.length*(vis.cellWidth+vis.cellPadding)+vis.margin.top + vis.margin.bottom;

            //preprocesing
            vis.max = Number.MIN_VALUE;
            vis.min = Number.MAX_VALUE;
            data.forEach(function(d){
                vis.min = Math.min(vis.min, d3.min(Object.values(d)) );
                vis.max = Math.max(vis.max, d3.max(Object.values(d)) );
            });

            //colorscale (YlGnBu is colorblind safe, print friendly, photocopy safe)
            var ticks = 6;
            var myColor = d3.scaleQuantize().domain([vis.min,vis.max]).range(colorbrewer.YlGnBu[ticks])


            // SVG drawing area
            if (d3.select("#matrix").empty() ) {

                //the svg everything goes into
                vis.svg = d3.select("#viewer-waypoint").append("svg")
                    .attr('id', 'matrix')
                    .attr("width", vis.width + vis.margin.left + vis.margin.right)
                    .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

                //a row
                var row = vis.svg.selectAll(".matrix-row")
                    .data(data, function (dataRow) {
                        return dataRow;
                    })
                    .enter()
                    .append("g")
                    .attr("class", "matrix-row")
                    .attr("transform", function (d, index) {
                        return "translate(0," + (
                            vis.cellHeight + vis.cellPadding) * index + ")";
                    });

                //the labels on the y axis (left)
                row.append("text")
                    .attr("class", "matrix-label matrix-row-label")
                    .attr("x", -10)
                    .attr("y", vis.cellHeight / 2)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "end")
                    .text(function (d,i) {
                        return 'cluster ' + [i];
                    })
                    .style('opacity', 1)
                    .on("click", function(d,i) { alert('clicked on row' + i); });

                // the cells (colored rectangles)
                var cell = row.selectAll(".matrix-cell-business")
                    .data(function (row) {
                        return Object.values(row);
                    })
                    .enter().append("rect")
                    .attr("class", "matrix-cell matrix-cell-business")
                    .attr("height", vis.cellHeight)
                    .attr("width", vis.cellWidth)
                    .attr("x", function (d, index) {
                        return (vis.cellWidth + vis.cellPadding) * index;
                    })
                    .attr("fill", function (d) {
                        return myColor(d);
                    })
                    .on("mouseover", function(d) {
                        d3.select(this).attr('stroke', 'white')
                            .attr('stroke-width', '2');
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", .8);
                        tooltip.html('' + parseFloat(d).toFixed(2))
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY-vis.margin.top) + "px");
                    })
                    .on("mouseout", function(d) {
                        d3.select(this).attr('stroke', 'black')
                            .attr('stroke-width', '0');
                        tooltip.transition()
                            .duration(500)
                            .style("opacity", 0);
                    });

                // the x-axis labels (top)
                var columnLabel = vis.svg.selectAll(".matrix-column-label")
                    .data(Object.keys(data[0]))
                    .enter()
                    .append("text")
                    .attr("class", "matrix-label matrix-column-label")
                    .attr("text-anchor", "start")
                    .attr("transform", function(d, index){
                        return "translate(" + (index * (vis.cellWidth + vis.cellPadding) + (vis.cellWidth+vis.cellPadding)/2) + ",-8) rotate(270)"
                    })
                    .text(function(d,i){
                        return d;
                    })
                    .on("click", function(d,i) { alert('clicked on column' + i); });;

                //dynamic legend
                vis.svg.append("g")
                    .attr("class", "colorLegend")
                    .attr("transform", "translate(" + (vis.width+10) + ",0)");
                var colorLegend = d3.legendColor()
                    .ascending(true)
                    .labelAlign('start')
                    .shapeWidth(5)
                    .shapeHeight(((data.length*(vis.cellWidth+vis.cellPadding))-vis.cellPadding)/ticks - 1)
                    .cells(d3.range(vis.min, vis.max, (vis.max - vis.min) /(ticks)) )
                    .scale(myColor);
                vis.svg.select(".colorLegend")
                    .call(colorLegend);


            }//if not yet drawn

        })
        .catch(function(error){
            console.log('error loading vis data:' + error);
        })
}


infovis.renderBarChart = function(wid_waypoint, visdata){

    //formatter .. to scientific notation
    var formatter = d3.format(".2n");

    var vis = {};

    //layout
    vis.margin = {top: 20, right: 20, bottom: 30, left: 40};
    vis.width = wid_waypoint.clientWidth - vis.margin.left - vis.margin.right;
    vis.height = vis.width;
    vis.padding = 15;

    //tooltip
    vis.tooltip = d3.select("#viewer-waypoint").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    //create svg
    vis.svg = d3.select("#viewer-waypoint").append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

    //axis
    vis.x = d3.scaleBand().rangeRound([0, vis.width]).padding(0.1);
    vis.y = d3.scaleLinear().rangeRound([vis.height, 0]);

    var g = vis.svg.append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    //read from csv data file
    d3.csv(visdata)
    //some mapping..
        .then((data) => {
            return data.map((d) => {
                d.frequency = +d.frequency;
                return d;
            });
        })
        .then((data) => {
            //data domains..ranges
            vis.x.domain(data.map(function(d) { return d.type; }));
            vis.y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

            //transform  x axis to bottom of chart
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(" + vis.padding + "," + vis.height + ")")
                .call(d3.axisBottom(vis.x));

            //set up y axis to left of chart
            g.append("g")
                .attr("class", "axis axis--y")
                .call(d3.axisLeft(vis.y).ticks(10).tickFormat(formatter))
                .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Number of Cells")
                .attr('fill', 'white');

            //plot the bars
            g.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return vis.padding + vis.x(d.type); })
                .attr("y", function(d) { return vis.y(0); })
                .attr("width", vis.x.bandwidth())
                .attr("height", function(d) { return vis.height - vis.y(0); });

            //little animation
            vis.svg.selectAll("rect")
                .transition()
                .duration(800)
                .attr("y", function(d) { return vis.y(d.frequency); })
                .attr("height", function(d) { return vis.height - vis.y(d.frequency); })
                .delay(function(d,i){return(i*100)})

            //interaction
            vis.svg.selectAll("rect")
                .on("mouseover", function(d) {
                    d3.select(this).attr('stroke', 'white')
                        .attr('stroke-width', '2');
                    vis.tooltip.transition()
                        .duration(200)
                        .style("opacity", .8);
                    vis.tooltip.html('' + formatter(parseFloat(d.frequency)) )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - vis.margin.top) + "px");
                })
                .on("mouseout", function(d) {
                    d3.select(this).attr('stroke', 'black')
                        .attr('stroke-width', '0');
                    vis.tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
                .on("click", function(d,i) { alert('clicked on bar' + i + ' with value: ' + formatter(d.frequency)); });
        })
        .catch((error) => {
            throw error;
        });
}

infovis.renderBoxPlot = function(wid_waypoint, visdata){
    //to be implemented
}

infovis.renderScatterplot = function(wid_waypoint, visdata){
    //to be implemented
}

