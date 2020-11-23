var $ = function (id) {
  return document.getElementById(id);
}

var moviescreen;
var checktimeBtn;

var filmDuration;

var filmInfo;

var startDate;
var startTime;
//var startDate = new Date("November 22, 2020 22:54:00");
//var startTime = startDate.getTime(); //time movie is supposed to start

window.onload = function() {
  moviescreen = $("moviescreen"); //video element
  moviescreen.setAttribute("controlslist", "nodownload");
  filmInfo = getTextFileInfo("films/filmdata.txt");

  moviescreen.addEventListener('durationchange', function() {
    console.log("Duration change");
    filmDuration = moviescreen.duration;
  })
}

function syncUpdate() {
  var currentDate = new Date(); //current date IRL
  var currentTime = currentDate.getTime(); //milliseconds since 01/01/1970
  var secondsIntoFilm = (currentTime - startTime) / 1000;
  var currentFilmTime = moviescreen.currentTime;
  var offsync = secondsIntoFilm - currentFilmTime;
  $("status").innerHTML = "Current Date: " + currentDate + "<br>" + "Offsync: " + offsync;
  if (Math.abs(offsync) > 1 && !moviescreen.paused) {
    moviescreen.currentTime = secondsIntoFilm;
  }
  setTimeout(syncUpdate,1000); //update every second
}

function loadInfo() {
  moviescreen.src = filmInfo.path;
  moviescreen.play();
  startDate = new Date(filmInfo.startDate);
  startTime = startDate.getTime();
  syncUpdate();
  filmDuration = filmInfo.duration;
  var endDate = new Date(startDate.getTime() + filmDuration * 1000);

  $("info").innerHTML = "Title : " + filmInfo.title + "<br>" + "Duration: " + filmDuration + " seconds<br>" + "Start Date: " + startDate + "<br>" + "End Date: " + endDate;
}

function getTextFileInfo(path) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.onload = function() {
    if (this.status === 200) {
        console.log("Successful XML");
        console.log(this.response);
        filmInfo = this.response;
        loadInfo();
      } else {
        filmInfo = "ERROR";
        loadInfo();
      }
    };
  xhr.open("GET", path);
  xhr.send();
}
