node.on("mouseover", function(event, d) {
    d3.select(this).attr("r", 15);
})
.on("mouseout", function(event, d) {
    d3.select(this).attr("r", 10);
});
