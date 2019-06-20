function makeResponsive(){
  var svgArea = d3.select("body").select("svg");
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  // SVG wrapper dimensions are determined by the current width
  // and height of the browser window.
  var svgWidth = 960;
  var svgHeight =560;
var margin = {
  top: 20,
  right: 80,
  bottom: 80,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("class","hi")
  .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)

  



var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "healthcare"

function xScale(liveData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(liveData, d => d[chosenXAxis]) * 0.8,
      d3.max(liveData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}  
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
      
    return xAxis;
  }
function yScale(liveData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(liveData, d => d[chosenYAxis]) -0.5,
        d3.max(liveData, d => d[chosenYAxis]) +2
      ])
      .range([height,0]);
  
    return yLinearScale;
  
  }  
function renderAxes1(newYScale, yAxis) {
      var leftAxis = d3.axisLeft(newYScale);
    
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
      return yAxis;
    }
  
    function yrenderCircles(circlesGroup, newYScale,chosenYAxis) {

      circlesGroup.transition()
        .duration(1000)

        .attr("cy", d => newYScale(d[chosenYAxis]))
        .attr("yv",chosenYAxis)
        .attr("yvv",d=>d[chosenYAxis])
      return circlesGroup;
    }




  function renderCircles(circlesGroup, newXScale,chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("xv",chosenXAxis)
      .attr("xvv",d=>d[chosenXAxis])
    return circlesGroup;
  }
  function renderLabel(stateLabel,newXScale,chosenXAxis){
    stateLabel.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]))
  }
  function yrenderLabel(stateLabel,newYScale,chosenYAxis){
    stateLabel.transition()
    .duration(1000)
    .attr("y", d => newYScale(d[chosenYAxis])+1.25)
  }


  function updateToolTip(chosenXAxis, circlesGroup, chosenYAxis) {

    if (chosenXAxis === "poverty") {
      var label = "Poverty";
    }
    else if(chosenXAxis === "income") {
        var label = "Household Income";
      }
    else if(chosenXAxis ==="age"){
      var label = "Age";
    }
    if(chosenYAxis === "healthcare"){
      var ylabel = "Lacks Health Care";
    }
    if(chosenYAxis === "smokes"){
      var ylabel = "Smokes";
    }
    if(chosenYAxis === "obesity"){
      var ylabel = "Obese";
    }

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .style('display','block')
      .offset([-5,0])
      .html(function(d) {if(chosenXAxis=="poverty"){
        return (`${d.state}<br>${ylabel} : ${d[chosenYAxis]}%<br>${label}: ${d[chosenXAxis]}%`);}
       else if(chosenXAxis=="age"){return(`${d.state}<br>${ylabel} : ${d[chosenYAxis]}%<br>${label}: ${d[chosenXAxis]}`)}
       else if(chosenXAxis=="income"){return(`${d.state}<br>${ylabel} : ${d[chosenYAxis]}%<br>${label}: $${d[chosenXAxis].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`)}

      });
    
    
        
    circlesGroup.call(toolTip);
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data)
      d3.select(this)
            .transition()
            .duration(500)
            .attr("fill", "red")
            .attr("stroke","black")

      console.log(this) 
      console.log(this.getAttribute('value'))
     
      coord=[[this.cx.baseVal.value+10,this.cy.baseVal.value],[650,50],[700,50]]
      coord2=[[this.cx.baseVal.value+10,this.cy.baseVal.value],[650,350],[730,350]]
      var lineG=d3.line()


      chartGroup.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("class","path")
      .attr("d", lineG(coord))
      


      chartGroup.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("class","path")
      .attr("d", lineG(coord2));

      chartGroup.append("circle")
      .attr("cx", 700+(460-this.cy.baseVal.value)/10)
      .attr("cy", 50)
      .attr("r", (460-this.cy.baseVal.value)/10)
      .attr("class","bigCircle")
      .attr("fill", "darkblue")
      .attr("opacity", "0.7")

      if(this.getAttribute('svv')=="PA"){
      chartGroup.append('image')
    .attr('xlink:href', `https://www.nass.org/sites/default/files/state-flags/PN.png`)
    .attr("class", "flag")
    .attr('width', 100)
    .attr('height', 100)
    .attr("y", 200-50)
    .attr("x", 670)}
    else if(this.getAttribute('svv')=="KY"){
      chartGroup.append('image')
    .attr('xlink:href', `https://www.nass.org/sites/default/files/state-flags/KT.png`)
    .attr("class", "flag")
    .attr('width', 100)
    .attr('height', 100)
    .attr("y", 200-50)
    .attr("x", 670)}
    else{
      chartGroup.append('image')
    .attr('xlink:href', `https://www.nass.org/sites/default/files/state-flags/${this.getAttribute('svv')}.png`)
    .attr("class", "flag")
    .attr('width', 100)
    .attr('height', 100)
    .attr("y", 200-50)
    .attr("x", 670)}
    



      if(this.getAttribute('yv')=="healthcare"){
      chartGroup.append("text")
      .attr("y", 50)
      .attr("x", 700+(460-this.cy.baseVal.value)/10*2+10)
      .text("No "+this.getAttribute('yv'))
      .attr("class", "sometext")
      .attr('alignment-baseline', 'middle')
      .style('font-size', '14px')
      .attr('fill', 'black');
      chartGroup.append("text")
      .attr("y", 50+20)
      .attr("x", 700+(460-this.cy.baseVal.value)/10*2+50)
      .text(this.getAttribute('yvv')+"%")
      .attr("class", "sometext")
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '14px')
      .attr('fill', 'black')}


      else{
      chartGroup.append("text")
      .attr("y", 50)
      .attr("x", 700+(460-this.cy.baseVal.value)/10*2+10)
      .text(this.getAttribute('yv'))
      .attr("class", "sometext")
      .attr('alignment-baseline', 'middle')
      .style('font-size', '14px')
      .attr('fill', 'black');
      chartGroup.append("text")
      .attr("y", 50+20)
      .attr("x", 700+(460-this.cy.baseVal.value)/10*2+30)
      .text(this.getAttribute('yvv')+"%")
      .attr("class", "sometext")
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '14px')
      .attr('fill', 'black')
      }

      chartGroup.append("text")
      .attr("y", 150)
      .attr("x", 670)
      .text(this.getAttribute('value'))
      .attr("class", "flag")
      .attr('alignment-baseline', 'middle')
      .style('font-size', '25px')
      .attr("font-weight", "bold")
      .attr('fill', 'black');

      chartGroup.append("circle")
      .attr("cx", 730+(this.cx.baseVal.value)/10)
      .attr("cy", 350)
      .attr("r", (this.cx.baseVal.value)/10)
      .attr("class","bigCircle")
      .attr("fill", "darkblue")
      .attr("opacity", "0.7") ;
      if(this.getAttribute('xv')=="poverty"){
      chartGroup.append("text")
      .attr("y", 350+(this.cx.baseVal.value/10)+10)
      .attr("x", 730+this.cx.baseVal.value/10)
      .text(this.getAttribute('xv'))
      .attr("class", "sometext")
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '14px')
      .attr('fill', 'black')
      chartGroup.append("text")
      .attr("y", 350+(this.cx.baseVal.value/10)+10+20)
      .attr("x", 730+this.cx.baseVal.value/10)
      .text(this.getAttribute('xvv')+"%")
      .attr("class", "sometext")
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .style('font-size', '14px')
      .attr('fill', 'black')}
      else if(this.getAttribute('xv')=="income"){
        chartGroup.append("text")
        .attr("y", 350+(this.cx.baseVal.value/10)+10)
        .attr("x", 730+this.cx.baseVal.value/10)
        .text(this.getAttribute('xv'))
        .attr("class", "sometext")
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', '14px')
        .attr('fill', 'black')
        chartGroup.append("text")
        .attr("y", 350+(this.cx.baseVal.value/10)+10+20)
        .attr("x", 730+this.cx.baseVal.value/10)
        .text("$"+this.getAttribute('xvv').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        .attr("class", "sometext")
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', '14px')
        .attr('fill', 'black')}
        else {
          chartGroup.append("text")
          .attr("y", 350+(this.cx.baseVal.value/10)+10)
          .attr("x", 730+this.cx.baseVal.value/10)
          .text(this.getAttribute('xv'))
          .attr("class", "sometext")
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .style('font-size', '14px')
          .attr('fill', 'black')
          chartGroup.append("text")
          .attr("y", 350+(this.cx.baseVal.value/10)+10+20)
          .attr("x", 730+this.cx.baseVal.value/10)
          .text(parseFloat(this.getAttribute('xvv')).toFixed(1))
          .attr("class", "sometext")
          .attr('text-anchor', 'middle')
          .attr('alignment-baseline', 'middle')
          .style('font-size', '14px')
          .attr('fill', 'black')}



    })

      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data)
        d3.select(this)
        .transition()
            .duration(500)
            .attr("fill", "skyblue")
        .attr("stroke","none");
        chartGroup.selectAll(".path").remove()
        chartGroup.selectAll(".bigCircle").remove()
        chartGroup.selectAll(".sometext").remove()
        chartGroup.selectAll(".flag").remove()

        ;
      });

  




    return circlesGroup;
  }
  





  d3.csv("assets/js/data.csv").then(function(liveData) {



    // parse data
    liveData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.age = +data.age;
      data.abbr = data.abbr
      data.smokes =+data.smokes
      data.obesity =+data.obesity
      data.income =+data.income
    });
    var xLinearScale = xScale(liveData, chosenXAxis);
  
    console.log(liveData)

    // Create y scale function
    var yLinearScale = yScale(liveData,chosenYAxis)

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var yAxis= chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
    .data(liveData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "skyblue")
    .attr("opacity", "1")
    .attr("value",d=>d.state)
    .attr("svv", d=>d.abbr)
    .attr("xv",chosenXAxis)
    .attr("yv",chosenYAxis)
    .attr("xvv",d=>d[chosenXAxis])
    .attr("yvv",d=>d[chosenYAxis])

    
    
    
    var stateLabel = chartGroup.selectAll("text1")
    .data(liveData)
    .enter()
    .append("text")
    .attr("pointer-events", "none") 
    .attr("y", d => yLinearScale(d[chosenYAxis])+1.25)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .text(function(d){return d.abbr})
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', '11px')
    .attr('fill', 'white');

    var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");


    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var ylabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)")

    obeseLabel= ylabelsGroup.append("text")
    .attr("y", -70)
    .attr("x", 0 - (height / 2))
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obese (%)");

    smokeLabel= ylabelsGroup.append("text")
    .attr("y", -50)
    .attr("x", 0 - (height / 2))
    .attr("value", "smokes") // value to grab for event listener

    .classed("inactive", true)
    .text("Smokes (%)");

    healthLabel= ylabelsGroup.append("text")
    .attr("y", -30)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks HealthCare (%)");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

    labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = value;

        xLinearScale = xScale(liveData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
        statelabel = renderLabel(stateLabel,xLinearScale, chosenXAxis)
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);
        if (chosenXAxis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
              povertyLabel
              .classed("active", false)
              .classed("inactive", true);
              incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if(chosenXAxis === "income"){
            incomeLabel
            .classed("active", true)
            .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
              povertyLabel
              .classed("active", false)
              .classed("inactive", true);
          }

          else if(chosenXAxis === "poverty"){
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
              povertyLabel
              .classed("active", true)
              .classed("inactive", false);
              incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      }
      
      
      
      
      
      );
      // circlesGroup = renderCircles(circlesGroup, xLinearScale,yLinearScale, chosenXAxis, chosenYAxis);
     
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);

      ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var yvalue = d3.select(this).attr("value");
      console.log(yvalue)
      if (yvalue !== chosenYAxis) {

        // replaces chosenXaxis with value
        chosenYAxis = yvalue;

        yLinearScale = yScale(liveData, chosenYAxis);
        // updates x axis with transition
        yAxis = renderAxes1(yLinearScale, yAxis);

        circlesGroup = yrenderCircles(circlesGroup, yLinearScale, chosenYAxis);
        statelabel = yrenderLabel(stateLabel,yLinearScale, chosenYAxis)
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, circlesGroup, chosenYAxis);
        if (chosenYAxis === "healthcare") {
            healthLabel
              .classed("active", true)
              .classed("inactive", false);
              smokeLabel
              .classed("active", false)
              .classed("inactive", true);
              obeseLabel
              .classed("active", false)
              .classed("inactive", true);
          }
          else if(chosenYAxis === "smokes"){
            smokeLabel
              .classed("active", true)
              .classed("inactive", false);
              healthLabel
              .classed("active", false)
              .classed("inactive", true);
              obeseLabel
              .classed("active", false)
              .classed("inactive", true);
          }

          else if(chosenYAxis === "obesity"){
            obeseLabel
              .classed("active", true)
              .classed("inactive", false);
              smokeLabel
              .classed("active", false)
              .classed("inactive", true);
              healthLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      }
      
      
      
      
      
      );





  });
   







  
}
makeResponsive();
d3.select(window).on("resize", makeResponsive);