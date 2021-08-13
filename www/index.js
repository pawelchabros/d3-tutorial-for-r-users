$(function () {
  Shiny.addCustomMessageHandler(
    "render_barplot",
    function ({ dummyData, plotWidth, plotHeight }) {
      const domainX = [0, d3.max(dummyData, (row) => row.value)];
      const domainY = [...new Set(dummyData.map((row) => row.category))];

      const scaleX = d3.scaleLinear(domainX, [0, plotWidth]);
      const scaleY = d3.scaleBand(domainY, [0, plotHeight]).padding(0.2);

      const axisX = d3.axisBottom(scaleX).tickSize(-plotHeight);
      const axisY = d3.axisLeft(scaleY);

      plot = d3.select("svg > .plot");

      plot.select(".axis-x").transition().call(axisX);
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
    }
  );
});
