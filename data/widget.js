(function () {
  self.port.on("schedule", function (schedule) {
    var tbody = document.getElementById('schedule-body');

    schedule.forEach(function (game) {
      var el = document.createElement('tr');

      el.innerHTML = "<td>" + game.sport + "</td>" +
                     "<td>" + game.dateString + "</td>" +
                     "<td>" + game.event + "</td>" +
                     "<td>" + game.location + "</td>" +
                     "<td>" + game.result + "</td>";
      tbody.appendChild(el);
    });
  });
})();
