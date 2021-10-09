//Chart INIT------
let data;
let sort_order = d3.select("#sort").node().value;
let type = d3.select("#group-by").node().value;
const margin = ({top: 20, right: 20, bottom: 20, left: 50})
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const svg = d3.select('.chart')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  

const xScale = d3
  .scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.1)

const yScale = d3
  .scaleLinear()
  .range([height, 0]);

svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", `translate(0, ${height})`)

svg.append("g")
    .attr("class", "axis y-axis")

svg
    .append("text")
    .attr("class", "y-axis-title")
    .attr("text-anchor", "end")
    .attr("x", 40)
    .attr("y", height - 365)
    .text("Stores")
    


// CHART UPDATE FUNCTION -------------------
 function update(data, type, sort_now){
    // update domains
  if(sort_now == "ascending"){
      data = data.sort((a, b) => b[type] - a[type]);
  } else {
      data = data.sort((a, b) => a[type] - b[type]);
  }
  xScale.domain(data.map(d => d.company));

  yScale.domain([0, d3.max(data, d => d[type])]);

  const xAxis = d3.axisBottom()
    .scale(xScale)

  const yAxis = d3.axisLeft()
    .scale(yScale);

  svg.select('.x-axis')
    .transition()
    .duration(1000)
    .call(xAxis)

  svg.select('.y-axis')
    .transition()
    .duration(1000)
    .call(yAxis)

  const bars = svg.selectAll('.bar')
    .data(data, d=>d.company);
    // update bars
  bars.enter()
    .append('rect')
    .attr("class", "bar")
    .attr('fill', 'red')
    .attr("width", d => xScale.bandwidth())
    .attr("height", 0)
    .attr("x", d => xScale(d.company))
    .attr("y", height)
    .merge(bars)
    .transition()
    .duration(1000)
    .attr("x", d => xScale(d.company))
    .attr("y", d => yScale(d[type]))
    .attr("height", d => height - yScale(d[type]))
    .attr('fill', 'steelblue')

  bars.exit()
    .transition()
    .duration(1000)
    .attr('fill', 'red')
    .attr('opacity', 0.0)
    .remove();

  // update axes and axis title
  d3.select('.y-axis-title').text(type === "stores" ? "Stores" : "Billions USD")
}

//Chart UPDATE
d3.csv('coffee-house-chains.csv', d3.autoType).then(_data=>{
    data = _data;
    update(data, type, sort_order);
  })

// (Later) Handling the type change
d3.select("#group-by").on("change", (event) => {
    type = d3.select("#group-by").node().value;
    update(data, type, sort_order);
})

// (Later) Handling the sorting direction change
document.querySelector("#sort").addEventListener("click", event => {
    if(sort_order == "ascending"){
        sort_order = "descending";
    } else {
        sort_order = "ascending";
    }
    update(data, type, sort_order);
})