"use strict";

window.addEventListener("DOMContentLoaded", start);

// Global array
const allStudents = [];

// variabler

const settings = {
  filter: "all",
  sortBy: "house",
  sortDir: "asc",
};

let studentInfo = document.querySelector("#student");
let filterBy = "all";
let sortDropDown = "";

// Laver prototypen til Student objects
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
  prefect: "",
  bloodtype: "",
  inqusitorial: "",
  expelled: "",
};

function start() {
  console.log("ready");
  loadJSON();
  addButtons();

  // tilføjer eventlistners til knapperne
  // document.querySelector("#expelledButton").addEventListener("click", showExpelledStudents);
  // document.querySelector("#squadedButton").addEventListener("click", showSquadedStudents);
  // document.querySelector("#prefectedButton").addEventListener("click", showPrefectedStudents);
  // document.querySelector("#search input").addEventListener("input", searchClicked);
}

// BUTTON FILTER + SORT EVENTLISTNERS CLICK
function addButtons() {
  // sætter click event på filter knapper, så den kan filtrer mellem husene
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectHouse));
  console.log("klik virker");
  //  sætter click event på filter knapper, så den kan SORTERER
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
  // DROPDOWN
  document.querySelector("#hasDropDown").addEventListener("click", toggleDropDown);
  /* Bliver nødt til at lave forEach for at den tager fat i begge p tags og dermed lukker uansetm om klik på fornavn eller efternavn */
  document.querySelectorAll("#dropDown p").forEach(function (element) {
    element.addEventListener("click", toggleDropDown);
  });

  /* CLICK STUDENT - POPUP */
  document.querySelector("#list tbody").addEventListener("click", clickStudent);
}

// MIT GAMLE JSON
function loadJSON() {
  console.log("fetcher jsondata");
  fetch("https://petlatkea.dk/2021/hogwarts/students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

// Creating new array with cleaned Student data
function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    // TODO: Create new object with cleaned data - and store that in the allAnimals array
    const student = Object.create(Student);

    const text = jsonObject.fullname.trim().split(" ");
    // console.log("variabler oprettet");

    // FIRSTNAME
    // sætter forbogstav til STORT og resten til småt
    student.firstName = text[0].charAt(0).toUpperCase() + text[0].slice(1).toLowerCase();

    //    MIDDLENAME
    // If there are more than 2 text in the full name, the middle name(s) are present
    if (text.length > 2) {
      // console.log(text[1].charAt(0).toUpperCase() + text[1].slice(1).toLowerCase());
      // Capitalize and clean the first middle name
      student.middleName = text[1].charAt(0).toUpperCase() + text[1].slice(1).toLowerCase();
    } else if (text.length === 2) {
      // If there are only 2 text elements, the second element is the last name
      student.lastName = text[1].charAt(0).toUpperCase() + text[1].slice(1).toLowerCase();
    }

    // LASTNAME

    // Capitalize and clean the last name
    student.lastName = text[text.length - 1].charAt(0).toUpperCase() + text[text.length - 1].slice(1).toLowerCase();

    // IMAGE
    let imgSrc = new Image(100, 100);
    student.image = imgSrc;

    let lastNameImage = student.lastName.toLowerCase();
    let firstNameImage = student.firstName.charAt(0).toLowerCase();
    // finder mappen til billederne
    imgSrc.src = "./images/" + lastNameImage + "_" + firstNameImage + ".png";
    // Sætningen under er det samme som ovenstående, bare ved brug af $ - de begge virker
    // imgSrc.src = `./images/${lastNameImage}_${firstNameImage}.png`;
    // console.log(student.image);

    if (lastNameImage === "Leanne") {
      imgSrc = "";
    } else if (lastNameImage.includes("Patil")) {
      imgSrc.src = "./images/" + lastNameImage + "_" + student.firstName.toLowerCase() + ".png";
    } else if (lastNameImage.includes("-")) {
      imgSrc.src = "./images/" + lastNameImage.substring(lastNameImage.indexOf("-") + 1) + "_" + firstNameImage + ".png";
    }
    // HOUSE
    student.house = jsonObject.house.trim().charAt(0).toUpperCase() + jsonObject.house.slice(1).toLowerCase();

    // let housename = jsonObject.house;
    // housename = house.trimStart();
    // housename = house.trimEnd();
    // student.housename.charAt(0).toUpperCase() + housename.slice(1).toLowerCase();
    // console.log(housename);

    // NICKNAME
    let nickNameClear = jsonObject.fullname.substring(jsonObject.fullname.indexOf(`"`), jsonObject.fullname.lastIndexOf(`"`) + 1);

    student.nickName = nickNameClear.replaceAll(`"`, ``);
    // console.log(student.nickName);

    // Tilføjer det nye object til vores array allStudents
    allStudents.push(student);
  });
  // displayList();
  buildList();
}

// DISPLAY
function displayList(students) {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  students.forEach(displayStudent);
  console.log("nu er vi i display listen");
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=fullname]").textContent = student.firstName + " " + student.lastName;
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  // clone.querySelector("[data-field=middlename]").textContent = student.middleName;
  // clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  // clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=image] img").src = student.image.src;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

// DROPDOWN
function toggleDropDown(evt) {
  console.log("klik drop");
  document.querySelector("#dropDown").classList.toggle("hide");
}

// FILTER HOUSE FUNCTIONS
function selectHouse(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  //   Kalder setFilter(med det selectede filter)
  setFilter(filter);
}

function setFilter(filter) {
  // sets the global variable
  settings.filterBy = filter;
  buildList();
  console.log("buildlist kaldes");
}

function filterList(filteredList) {
  if (settings.filterBy === "gryffindor") {
    console.log("This is gryffindor");
    // Create a filtered list of only cats
    filteredList = allStudents.filter(isGryf);
  } else if (settings.filterBy === "slytherin") {
    console.log("This is slytherin");
    // Create a filtered list of only dogs
    filteredList = allStudents.filter(isSlyt);
  } else if (settings.filterBy === "hufflepuff") {
    console.log("This is hufflepuff");
    // Create a filtered list of only dogs
    filteredList = allStudents.filter(isHuff);
  } else if (settings.filterBy === "ravenclaw") {
    console.log("This is ravenclaw");
    // Create a filtered list of only dogs
    filteredList = allStudents.filter(isRave);
  }

  return filteredList;
}

function isGryf(student) {
  return student.house === "Gryffindor";
}
console.log(`valgt hus ${student}`);

function isSlyt(student) {
  return student.house === "Slytherin";
}
function isHuff(student) {
  return student.house === "Hufflepuff";
}
function isRave(student) {
  return student.house === "Ravenclaw";
}

function buildList() {
  // først filterer vi
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);
  // kalder displayList med vores sortedList
  displayList(sortedList);
  // console.log("displayList kaldes", allStudents);
  // console.log("displayList kaldes", currentList);
}

// Capitalize function
function capitalize(str) {
  const capStr = str.toUpperCase();
  return capStr;
}

// SORTING
function selectSort(event) {
  console.log("selectSort", event);
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // // find "old" sortBy element and remove .sortBy
  // const oldArrow = document.querySelector(`[data-sort=${settings.sortBy}]`);
  // oldArrow.classList.remove("sortby");
  // // indicate active sort
  // event.target.classList.add("sortby");

  // Toggle the direction !
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
    document.querySelector("#hasDropDown span").textContent = `${capitalize(sortBy)} ( A - Z )`;
  } else {
    event.target.dataset.sortDirection = "asc";
    document.querySelector("#hasDropDown span").textContent = `${capitalize(sortBy)} ( Z - A )`;
  }

  console.log(`User selected ${sortBy} - ${sortDir}`);
  //   Kalder sortList(med det valgte sorting
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  // let sortedList = allAnimals;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    settings.direction = 1;
  }
  // Hvis sortedList = er "sorted" by name / .sort (en array methods)
  sortedList = sortedList.sort(sortByProperty);

  // SORTING BY  NAME med CLOSURE !! nødvendigt for at vi kan bruge sortBy parametret
  function sortByProperty(A, Z) {
    // console.log(`SortBy is ${sortBy}`);
    // siger hvis animalA kommer før < animalB
    if (A[settings.sortBy] < Z[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  // husk at return listen
  return sortedList;
}

/* POPUP STUDENT */
/* vis popup  */
function clickStudent() {
  let popup = document.querySelector("#popupContainer");
  popup.classList.add("show");
  popup.style.display = "block";

  // Listen for click on close button
  document.querySelector(".closebtn").addEventListener("click", closePopup);
}

/* luk popup */
function closePopup() {
  let closePopup = document.querySelector("#popupContainer");
  closePopup.classList.add("hide");
  closePopup.style.display = "none";
}

/* clone jsondata firstname, middlename, nickname og lastname og img på den enkelte student */
