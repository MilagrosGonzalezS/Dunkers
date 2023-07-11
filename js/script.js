window.addEventListener("DOMContentLoaded", function () {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("sw.js")
      .then((res) => console.log("SW. Se registró correctamente"))
      .catch((err) => console.log("SW. No se pudo registrar"));
  }

  let eventInstall;
  let btnInstall = document.querySelector(".btnInstall");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    eventInstall = e;
    ShowInstallButton();
  });

  let btnShare = document.querySelector(".btnShare");

  if (btnShare != undefined) {
    if (navigator.share) {
      btnShare.addEventListener("click", (e) => {
        let dataShare = {
          title: "Dunkers",
          text: "Dunkers App",
          url: "http://localhost/PWA/parcial1/index.html",
        };
        navigator.share(dataShare).then((res) => {});
      });
    } else {
      console.log("no es compatible");
      btnShare.style.display = "none";
    }
  }

  let btnShareTeam = document.querySelector(".btnShareTeam");

  if (btnShareTeam != undefined) {
    if (navigator.share) {
      btnShareTeam.addEventListener("click", (e) => {
        var teamPlayers = topTeamPlayers.toString();
        teamPlayers.split(", ");
        let dataShare = {
          title: "Dunkers",
          text: "This is my winning team: " + teamPlayers,
          url: "http://localhost/PWA/parcial1/top-team.html",
        };
        navigator.share(dataShare).then((res) => {});
        console.log(dataShare);
      });
    } else {
      console.log("no es compatible");
      btnShareTeam.style.display = "none";
    }
  }

  let ShowInstallButton = () => {
    if (btnInstall != undefined) {
      btnInstall.style.display = "inline-block";
      btnInstall.addEventListener("click", InstallApp);
    }
  };

  let InstallApp = () => {
    if (eventInstall) {
      eventInstall.prompt();
      eventInstall.userChoice.then((res) => {
        if (res.outcome == "accepted") {
          console.log("El usuario acepto instalar la app");
          btnInstall.style.display = "none";
        } else {
          console.log("el usuario no acepto instalar la app");
        }
      });
    }
  };
});

const topTeamPlayers = JSON.parse(localStorage.getItem("topTeamPlayers")) || [];

function footer() {
  let footer = document.getElementById("footer");

  footer.innerHTML = `
  
      <a href="index.html"
        ><img class="logo" src="./imgs/dunkers-logo.png" alt="logo"
      /></a>
      <p>@Copyright Dunkers2023 - All rights reserved</p>
      <div class="redes">
        <a href="https://www.instagram.com/" target="_blank"><img src="./imgs/instagram.png" alt="instagram logo" /></a>
        <a href="https://www.twitter.com/" target="_blank"><img src="./imgs/gorjeo.png" alt="twitter logo" /></a>
        <a href="https://www.reddit.com/" target="_blank"><img src="./imgs/reddit.png" alt="reddit logo" /></a>
      </div>
  
  `;
}

function getTeams() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "3ca7a986b6msh847722b9d8e0bb3p1be5bejsn16d12eb2f6d9",
      "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
    },
  };

  const fetchEast = fetch(
    "https://api-nba-v1.p.rapidapi.com/teams?conference=East",
    options
  ).then((response) => response.json());

  const fetchWest = fetch(
    "https://api-nba-v1.p.rapidapi.com/teams?conference=West",
    options
  ).then((response) => response.json());

  const allTeams = Promise.all([fetchEast, fetchWest]);

  allTeams
    .then((response) => {
      let html = "<ul>";
      let respuesta = document.getElementById("root");

      for (let teams of response) {
        for (let team of teams.response) {
          if (team.logo) {
            html += `
			<li>
				<div class="card" style="width: 16rem;">
					<div class="card-image">
						<img src=${team.logo} alt="team logo">
					</div>
					<div class="card-body">
						<h5 class="card-title">${team.name}</h5>
					</div>
					<ul class="list-group list-group-flush">
						<li class="list-group-item">${team.city} - ${team.code}</li>
						<li class="list-group-item">Conference: ${team.leagues.standard.conference}</li>
					</ul>
					<div class="card-body">
						<a href="team&players.html?name=${team.name}&logo=${team.logo}" class="button players-button" onclick="setId(${team.id});">Show players</a>
					</div>
				</div>
			</li>
			
			`;
          }
        }
      }
      html += "</ul>";
      if (respuesta) {
        respuesta.innerHTML = html;
      }
    })
    .catch((err) => console.error(err));
}

function setId(id) {
  localStorage.setItem("id", id);
}

function getPlayers() {
  const options2 = {
    method: "GET",
    headers: {
      "content-type": "application/octet-stream",
      "X-RapidAPI-Key": "3ca7a986b6msh847722b9d8e0bb3p1be5bejsn16d12eb2f6d9",
      "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
    },
  };

  let id = localStorage.getItem("id");
  let urlString = window.location.href;
  let url = new URL(urlString);
  let teamName = url.searchParams.get("name");
  let teamLogo = url.searchParams.get("logo");

  fetch(
    `https://api-nba-v1.p.rapidapi.com/players?team=${id}&season=2021`,
    options2
  )
    .then((response) => response.json())
    .then((response) => {
      let fullTeam = document.getElementById("full-team");
      let html = `<h2 class="title title-pages">${teamName}</h2>
							<ul class="full-team">`;
      for (player of response.response) {
        html += `
				<li>
					<div class="card card-team-player mb-3" style="max-width: 250px;">
						<div class="row g-0">
							<div class="col-md-4">
								<img src="${teamLogo}" class="rounded-start" alt="...">
							</div>
							<div class="col-md-8">
								<div class="card-body">
									<h5 class="card-title">${player.firstname} ${player.lastname}</h5>
									<p class="card-text">Birth: ${player.birth.date ? player.birth.date : " - "}</p>
									<p class="card-text">Height: ${
                    player.height.meters ? player.height.meters : " - "
                  }</p>
									<p class="card-text">Weight: ${
                    player.weight.kilograms ? player.weight.kilograms : " - "
                  }</p>
									<p class="card-text">Nba since: ${
                    player.nba.start ? player.nba.start : " - "
                  }</p>
		  							<a href="top-team.html" class="button button-add" onclick="addPlayer('${
                      player.firstname
                    } ${player.lastname}');">Add to my team</a>
								</div>
								
							</div>
						</div>
					</div>
				</li>

					`;
      }

      html += "</ul>";
      fullTeam.innerHTML = html;
    })

    .catch((err) => console.error(err));
}

function addPlayer(name) {
  if (topTeamPlayers.length < 5) {
    if (topTeamPlayers.find((value) => value == name)) {
      alert("You have already chosen that player, please choose another one");
      window.location.href = "teams.html";
    } else {
      topTeamPlayers.push(name);
      localStorage.setItem("topTeamPlayers", JSON.stringify(topTeamPlayers));
      console.log(topTeamPlayers);
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          const notificacion = new Notification("Dunkers App", {
            body: "You succesfully added a player to your Top Team!",
            icon: "icons/icon-192x192.png",
            tag: 1,
            silent: true,
          });
        }
      });
    }
  } else {
    alert("You can only add 5 players to your team");
  }
}

function getBest() {
  const options = {
    method: "GET",
    headers: {
      "content-type": "application/octet-stream",
      "X-RapidAPI-Key": "3ca7a986b6msh847722b9d8e0bb3p1be5bejsn16d12eb2f6d9",
      "X-RapidAPI-Host": "api-nba-v1.p.rapidapi.com",
    },
  };

  //fetch of MVP

  fetch("https://api-nba-v1.p.rapidapi.com/players?name=embiid", options)
    .then((response) => response.json())
    .then((response) => {
      let mvp = document.getElementById("mvp");
      let html;
      let player = response.response;
      html = `
		<div>
			<div class="card card-player" style="width:16rem; height:16rem;">
   					<div class="card-body card-body-players">
   					</div>
			</div>
			<h3 class="card-title" style="color:white;">${
        player[0].firstname + " " + player[0].lastname
      }</h3>

		</div>
			
		`;
      mvp.innerHTML = html;
    })
    .catch((err) => console.error(err));

  //fetch of best 5

  const fetch1 = fetch(
    "https://api-nba-v1.p.rapidapi.com/players?id=124",
    options
  ).then((res) => res.json());

  const fetch2 = fetch(
    "https://api-nba-v1.p.rapidapi.com/players?id=126",
    options
  ).then((res) => res.json());

  const fetch3 = fetch(
    "https://api-nba-v1.p.rapidapi.com/players?id=1881",
    options
  ).then((res) => res.json());

  const fetch4 = fetch(
    "https://api-nba-v1.p.rapidapi.com/players?id=86",
    options
  ).then((res) => res.json());

  const fetch5 = fetch(
    "https://api-nba-v1.p.rapidapi.com/players?id=1887",
    options
  ).then((res) => res.json());

  const allPlayers = Promise.all([fetch1, fetch2, fetch3, fetch4, fetch5]);

  allPlayers
    .then((res) => {
      let best5 = document.getElementById("best-5");
      let html = "";
      for (let player of res) {
        html += `
			<div style="text-align:center; margin-bottom:8em;">
				<div class="card card-player" style="background-image: url(imgs/${player.response[0].lastname}.jpg);">

				</div>
				<h3 class="card-title" style="color:white;">${player.response[0].firstname} ${player.response[0].lastname}</h3>
			</div>
			
			`;
      }

      best5.innerHTML = html;
    })
    .catch((err) => console.error(err));
}

// function deletePlayer(name) {
//   if ((deleted = topTeamPlayers.filter((value) => value == name))) {
//     let index = topTeamPlayers.indexOf(deleted);
//     topTeamPlayers.splice(index, 1);
//     localStorage.clear();
//     localStorage.setItem("topTeamPlayers", JSON.stringify(topTeamPlayers));
//     // window.location.href = "top-team.html";
//   }
//   console.log(topTeamPlayers);
// }

function topTeam() {
  let topTeam = document.querySelector(".top-team");
  let clearPlayers = document.getElementById("clearPlayers");
  let html = "";
  console.log(topTeamPlayers);

  for (player of topTeamPlayers) {
    html += `
		<div class="top5">
			<div class="card card-player card-form" >
        
			</div>
			<h5 class="card-title">${player ? player : ""}</h5>
      <button id="deletePlayer" onclick="deletePlayer(${player});" class="delete" >x</button>
		</div>
			
		`;

    if (topTeam) {
      topTeam.innerHTML = html;
    }
  }

  clearPlayers.addEventListener("click", function () {
    localStorage.clear();
    window.location.href = "top-team.html";
  });
}

if (window.Notification) {
  if (Notification.permission !== "denied") {
    setTimeout(function () {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("El usuario acepto recibir notificaciones");
        } else {
          console.log("El usuario no acepto recibir notificaciones");
        }
      });
    }, 5000);
  }
}

let OnlineStatus = () => {
  console.log(navigator.onLine);
  let status = document.querySelector(".online");
  let share = document.querySelector(".btnShare");
  let shareTeam = document.querySelector(".btnShareTeam");

  if (navigator.onLine) {
    console.log("Estamos online");
    status.style.color = "green";
    status.innerHTML = "Online";
    share.removeAttribute("disabled");
    shareTeam.removeAttribute("disabled");
    shareTeam.style.backgroundColor = "#d72323";
  } else {
    console.log("Estamos offline");
    status.style.color = "red";
    status.innerHTML = "Offline";
    share.setAttribute("disabled", "");
    shareTeam.setAttribute("disabled", "");
    shareTeam.style.backgroundColor = "grey";
  }
};

window.addEventListener("online", function () {
  console.log("online");
  OnlineStatus();
});

window.addEventListener("offline", function () {
  console.log("offline");
  OnlineStatus();
});
