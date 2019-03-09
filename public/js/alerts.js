console.log("alerts.js connected")

document.addEventListener('DOMContentLoaded', function () {

  setTimeout(function () {
    console.log("hide alert")
    let alert = document.getElementById('alert');
    // if (alert) alert.setAttribute("style", "display: none");
    if (alert) alert.parentNode.removeChild(alert);
  }, 2500);

});