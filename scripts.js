//loading the header, navBar, footer, etc from here means we don't have to copy/paste code onto every page
document.getElementById('header').innerHTML =
  "<img id='logo' src='images/logo.svg' />" +
  "<h1 class='title'> Tech Horizons </h1>" +
  "<h2 class='subtitle'>" +
    "Demonstrating the usefulness of the IoT" +
  "</h2>"
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
    "<h3 class='footer'> ELEX 290 <br> Capstone Project By: </h3><br>" +
    "<p class='footer'> Sarah Rosanna Busch <br> and <br> Emily Claire Wolfe </p>" +
  "</div>" +
  "<div class='footerColumn'>" +
    "<h3 class='footer'> ENGL 273 <br> Documentation: </h3><br>" +
    "<a class='footer' href='https://docs.google.com/document/d/1NRvmEhG1d8bm2GLgIiouHB_C74hp-B3c0jHjvXk4gyE/edit?usp=sharing' target='_blank'> Project Proposal</a><br>" +
    "<a class='footer' href='https://docs.google.com/presentation/d/15NisVMKIx2EaC61caH7quVC5pXi4chDEDkeWaVqRR00/edit?usp=sharing' target='_blank'> Elevator Pitch</a><br>" +
    "<a class='footer' href='https://docs.google.com/document/d/18PmsGwTxuioCkMh4xr2sk-mvoCNLXaenLL__o2moO4Y/edit?usp=sharing' target='_blank'> Team Bios</a><br>" +
    "<a class='footer' href='https://docs.google.com/presentation/d/1T_Pc-pBYF3uRTH0H3CspDlyI5SlaI0LQnETyy1axIBg/edit?usp=sharing' target='_blank'> Progress Presentation</a><br>" +
    "<a class='footer' href='https://docs.google.com/document/d/1VvYC1uVVuz1JXp5qReavqVJov-z56YZfo4vD6SrP93w/edit?usp=sharing' target='_blank'> Midterm Report</a><br>" +
    "<a class='footer' href='https://drive.google.com/file/d/0ByfAtGh9cwuGN1ppOUNXbjFtT3c/view?usp=sharing' target='_blank'> Brochure</a><br>" +
    "<a class='footer' href='https://docs.google.com/presentation/d/15xnPCVLmd-Z9RsnIzxeshVLgRvQv6Uxz7mjTYehDL6w/edit?usp=sharing' target='_blank'> Final Presentation</a><br>" +
    "<a class='footer' href='https://docs.google.com/document/d/1SDHjUXbdgHbT9_vEoZYCRhwXQDwG7aCZ2x0LdFIWtRg/edit?usp=sharing' target='_blank'> User Manual</a><br>" +
    "<a class='footer' href='https://drive.google.com/file/d/0ByfAtGh9cwuGQ2tTX2ZDVHBhUEE/view?usp=sharing' target='_blank'> Formal Report</a><br>" +
    "<br>" +
  "</div>" +
  "<div class='logoColumn'>" +
    "<img id='camosunLogo' src='images/camosunLogo.svg' />" +
  "</div>" +
  "<div id='bottomLine'><hr class='footer'></div>"
  ;
