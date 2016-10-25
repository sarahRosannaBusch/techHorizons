//loading the header, navBar, footer, etc from here means we don't have to copy/paste code onto every page
document.getElementById('header').innerHTML =
  "<img id='logo' src='images/logo.svg' />" +
  "<h1 class='title'> Tech Horizons </h1>" +
  "<p class='subtitle'>" +
    "Proving the usefulness of the IoT" +
  "</p>"
  ;

document.getElementById('navBar').innerHTML =
  "<a class='nav' href='tracker.html'><div class='nav' id='tracker'>Pet Tracker</div></a>" +
  "<a class='nav' href='feeder.html'><div class='nav' id='feeder'>Bird Feeder</div></a>" +
  "<a class='nav' href='lamp.html'><div class='nav' id='lamp'>Smart Lamp</div></a>"
  ;

//clicking anywhere in the header brings you back to the homepage
function goHome()
{
  window.open('index.html', '_self');
}

//the nav bar indicates which subpage you're on
if(window.location.href.match('tracker.html'))
  document.getElementById('tracker').className = 'navActive';
else if(window.location.href.match('feeder.html'))
  document.getElementById('feeder').className = 'navActive';
else if(window.location.href.match('lamp.html'))
  document.getElementById('lamp').className = 'navActive';
else
{
  document.getElementById('tracker').className = 'nav';
  document.getElementById('feeder').className = 'nav';
  document.getElementById('lamp').className = 'nav';
}

document.getElementById("footer").innerHTML =
  "<hr class='footer'>" +
  "<div class='footerColumn'>" +
    "<h3 class='footer'> Capstone Project By: </h3>" +
    "<p class='footer'> Sarah Rosanna Busch <br>" +
    "Emily Claire Wolfe </p>" +
    "<h3 class='footer'> Documentation: </h3>" +
    "<a class='footer' href='https://docs.google.com/document/d/1NRvmEhG1d8bm2GLgIiouHB_C74hp-B3c0jHjvXk4gyE/edit?usp=sharing' target=_blank> Project Proposal</a><br><br>" +
  "</div>" +
  "<div class='footerColumn'>" +
    "<img id='camosunLogo' src='images/camosunLogo.svg' />" +
    "<h3 class='footer'> ELEX 290 & ENGL 273 </h3>" +
  "</div>"
  ;
