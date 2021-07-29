$(function () {
  Shiny.addCustomMessageHandler("render_barplot", function (dummyData) {
    const svgWidth = 500;
    const svgHeight = 200;
    const margin = {
      top: 30,
      right: 10,
      bottom: 30,
      left: 30,
    };
    const plotWidth = svgWidth - margin.left - margin.right;
    const plotHeight = svgHeight - margin.top - margin.bottom;

    const domainX = [0, d3.max(dummyData, (row) => row.value)];
    const domainY = [...new Set(dummyData.map((row) => row.category))];

    const scaleX = d3.scaleLinear(domainX, [0, plotWidth]);
    const scaleY = d3.scaleBand(domainY, [0, plotHeight]).padding(0.2);

    const axisX = d3.axisBottom(scaleX).tickSize(-plotHeight);
    const axisY = d3.axisLeft(scaleY);

    mySvg = d3.select("svg").attr("width", svgWidth).attr("height", svgHeight);

    plot = mySvg
      .select(".plot")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    plot
      .select(".axis-x")
      .attr("transform", `translate(0, ${plotHeight})`)
      .transition()
      .call(axisX);

    plot.select(".axis-y").call(axisY);

    plot
      .selectAll(".bar")
      .data(dummyData)
      .join(
        (enter) => {
          enter
            .append("rect")
            .attr("class", "bar")
            .attr("x", 0)
            .attr("height", scaleY.bandwidth())
            .attr("y", (row) => scaleY(row.category))
            .attr("width", (row) => scaleX(row.value));
        },
        (update) => {
          update.transition().attr("width", (row) => scaleX(row.value));
        }
      );
  });
});
