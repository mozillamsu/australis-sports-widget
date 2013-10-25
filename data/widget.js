(function () {
  self.port.on("schedule", function (schedule) {
    var tbody = document.getElementById('schedule-body');

    schedule.forEach(function (game) {
      var result;
      var el = document.createElement('tr');

      if (game.history)
        result = (game.win ? 'Win' : 'Loss') + ', ' + game.score;
      else
        result = game.timeString;

      el.innerHTML = "<td>" + game.sport + "</td>" +
                     "<td>" + game.dateString + "</td>" +
                     "<td>" + game.opponent + "</td>" +
                     "<td>" + game.location + "</td>" +
                     "<td>" + result + "</td>";
      tbody.appendChild(el);
    });
  });
})();
