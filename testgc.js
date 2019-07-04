var gc = require("gc-stats")();

gc.on("stats", function(stats) {
  console.log("GC happened", stats);
});
