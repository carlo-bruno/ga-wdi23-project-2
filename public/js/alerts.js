console.log("alerts.js connected")

document.addEventListener('DOMContentLoaded', function () {

  setTimeout(function () {
    let alert = document.getElementById('alert');
    if (alert) alert.parentNode.removeChild(alert);
  }, 2500);

});