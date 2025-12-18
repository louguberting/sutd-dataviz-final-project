// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#licensed_chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

//Read the data

const data = await d3.csv("/Python/themeagg.csv");


// // group the data: one array for each value of the X axis.
const sumstat = d3.group(data, d => d.year);

console.log(sumstat)

// Stack the data: each group will be represented on top of each other
const mygroups = ["Original", "Licensed"] // list of group names
// const mygroup = [0, 1] // list of group names
// const stackedData = d3.stack()
//     .keys(mygroup)
//     .value(function (d, key) {
//         if(d[1][key]?.num) {
//             return d[1][key].num
//         }
//         else{
//             return d[1][key].num ? d[1][key]?.num : 0
//         }
//     })
//     (sumstat)


const stackedData = d3.stack()
    .keys(d3.union(data.map(d => d.group)))
    .value(([, group], key) => group.get(key)?.num ?? 0)
    (d3.index(data, d => d.year, d => d.group));

// Add X axis --> it is a date format
const x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year; }))
    .range([0, width]);
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format("d")));
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom)
    .text("Year");

// Add Y axis
const y = d3.scaleLinear()
    .domain([0, d3.max(data, function (d) { return +d.num; }) * 1.5])
    .range([height, 0]);
svg.append("g")
    .call(d3.axisLeft(y));
svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -margin.left + 20)
    .text("Number of Sets");

console.log(stackedData)
// Show the areas
svg
    .selectAll("mylayers")
    .data(stackedData)
    .join("path")
    .style("fill", function (d, i) { return i == 0 ? '#377eb8' : '#4daf4a' })
    .attr("d", d3.area()
        .x(function (d, i) { return x(d.data[0]); })
        .y0(function (d) { return y(d[0]); })
        .y1(function (d) { return y(d[1]); })
    )