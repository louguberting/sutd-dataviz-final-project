const data = await d3.csv("scripts/colorrace.js");
duration = 250;
// number of colors to display
n = 25;

replay;

const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height]);

const updateBars = bars(svg);
const updateAxis = axis(svg);
const updateLabels = labels(svg);
const updateTicker = ticker(svg);

yield svg.node();

for (const keyframe of keyframes) {
    const transition = svg.transition()
        .duration(duration)
        .ease(d3.easeLinear);

    // Extract the top bar’s quantity.
    x.domain([0, keyframe[1][0].quantity]);

    updateAxis(keyframe, transition);
    updateBars(keyframe, transition);
    updateLabels(keyframe, transition);
    updateTicker(keyframe, transition);

    invalidation.then(() => svg.interrupt());
    await transition.end();
}