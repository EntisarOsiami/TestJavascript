let authApi = "https://68276c5e6b7628c529104d57.mockapi.io/api/auth";
let countriesApi = "https://restcountries.com/v3.1/all";
//not completed the resource type need to be added!!!!
let harvardApi =
  "https://api.harvardartmuseums.org/object?apikey=f5eddfb6-c92d-4b56-9794-02de5886c761";

addEventListener("DOMContentLoaded", () => {
  isUserLogin();
  formData();
  getCountries();
  getHarvard();
  handleUser();
  logout();
  //add func here, don't forget!!
});

function formData() {
  let forms = document.querySelectorAll(".form");

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let formData = new FormData(e.target);
      console.log(formData);
      let payload = Object.fromEntries(formData.entries());
      console.log(payload);
      let type = form.dataset.type;
      console.log(type);
      handleForm(payload, type);
    });
  });
}

async function handleForm(payload, type) {
  try {
    if (type == "signup") {
      if (payload.password !== payload.confirmPassword) {
        alert("passwords don't match!");
        return;
      }
      delete payload.confirmPassword;

      let res = await fetch(authApi);
      let users = await res.json();
      console.log(users);

      let checkEmail = users.some((u) => u.email === payload.email);
      if (checkEmail) {
        alert("Email already exists");
      }

      let createUser = await fetch(authApi, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (createUser.ok) {
        alert("sign up successful, please login");
        window.location.href = "./login.html";
      }
    } else if (type == "login") {
      let res = await fetch(authApi);
      let users = await res.json();
      let CheckUser = users.find(
        (u) => u.username == payload.username && u.password == payload.password
      );
      if (CheckUser) {
        alert(`login successful`);
        localStorage.setItem("currentUser", JSON.stringify(payload));
        window.location.href = "./index.html";
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function isUserLogin() {
  let getUser = localStorage.getItem("currentUser");
  let loginPage = document.getElementById("login");
  let signPage = document.getElementById("signup");

  if (!loginPage || signPage) {
    if (!getUser) {
      alert("please login, so you can enter the website");
      window.location.href = "./login.html";
      return;
    }
  }
}

async function getCountries() {
  let divRow = document.getElementById("rowCountries");
  if (!divRow) {
    return;
  }

  let res = await fetch(countriesApi);
  console.log(res);
  let countries = await res.json();
  console.log(countries);

  countries.forEach((country) => {
    let card = document.createElement("div");
    card.className = "card col-lg-4 m-2 col-sm-6 col-12";
    let cardBody = document.createElement('div')
    cardBody.className = "card-body"
    let cardNameOff = document.createElement("h4");
    cardNameOff.className = "card-title";
    let cardName = document.createElement("p");
    cardName.className = "card-subtitle mb-2 text-body-secondary";
    let pop = document.createElement("p");
    pop.className = "card-text";
    let img = document.createElement("img");
    img.className = "card-top-img";
    let region = document.createElement("p");
    region.className = "card-text";
    let languages = document.createElement("p");
    languages.className = "card-text";
    let map = document.createElement("a");
    map.className = "card-link";

    // assign the values to the elements
    img.src = country.flags.png;
    img.style.height = "250px";
    cardNameOff.innerText = `Official Name : ${country.name.official}`;
    cardName.innerText = `Common name : ${country.name.common}`;
    pop.innerText = `Population : ${country.population}`;
    region.innerText = `Region : ${country.region}`;

    languages = JSON.stringify(country.languages);
    map.href = country.maps.googleMaps;
    map.innerText = "Map Link"
    // append the elements to the card
    cardBody.append(cardNameOff, cardName, pop, region, languages, map)
    card.append(img, cardBody);
    divRow.append(card);
  });
}

async function getHarvard() {
  let rowdivH = document.getElementById("rowHarvard");
  if (!rowdivH) {
    return;
  }
  let res = await fetch(harvardApi);
  let data = await res.json();
  let items =data.records;

  items.forEach((record) => {
    let card = document.createElement("div");
    card.className = "card col-lg-4 m-2 col-sm-6 col-12 d-flex flex-column";
    let img = document.createElement("img");
    img.className = "card-top-img";
    let cardAddress = document.createElement("h4");
    cardAddress.className = "card-title";
    let artist = document.createElement("p");
    artist.className = "d-inline-block";
    let date = document.createElement("p");
    date.className = "card-text";
    img.src = record.images[0].baseimageurl;
    cardAddress = record.title;
    artist = record.people[0].displayname;
    date = record.dated
    card.append(img, cardAddress, artist, date);
    rowdivH.append(card);
  });
}

function logout() {
  let btn = document.getElementById("logout");
  btn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "./login.html";
  });
}

function handleUser() {
  let userHere = localStorage.getItem("currentUser");
  let usernameText = document.getElementById("user");
  let guest = document.getElementById("guest");
  let welcome = document.getElementById("welcomeText");

 let user = JSON.parse(userHere) ;
 console.log(typeof(user));
  if (userHere) {
    welcome.innerText = `Welcome ${user.username}`;
    welcomeHero.innerText = `${user.username}`;
    usernameText.className = "d-flex gap-4";
    guest.className = "d-none";
  } else {
    guest.className = "d-flex gap-4";
  }
}
