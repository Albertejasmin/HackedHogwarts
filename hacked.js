"use strict";

// JSON DATA - https://petlatkea.dk/2021/hogwarts/students.json

window.addEventListener("DOMContentLoaded", start);

// Global array
const allStudents = [];

// variabler
let studentInfo = document.querySelector("#student");

// Laver prototypen til Student objects
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
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
  // sætter click event på filter knapper, så den kan filtrer mellem dyrne
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addButtons("click", selectHouse));
  //  sætter click event på filter knapper, så den kan SORTERER
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addButtons("click", selectSort));
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

// // Henter JSON data async
// async function loadJSON() {
//   const resStudent = await fetch("https://petlatkea.dk/2021/hogwarts/students.json");
//   const studentData = await resStudent.json();
//   const resBlood = await fetch("https://petlatkea.dk/2021/hogwarts/families.json");
//   const bloodData = await resBlood.json();
//   prepareStudents(studentData, bloodData);
// }

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
      console.log(text[1].charAt(0).toUpperCase() + text[1].slice(1).toLowerCase());
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
    console.log(student.image);

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
    console.log(student.nickName);

    // Tilføjer det nye object til vores array allStudents
    allStudents.push(student);
  });
  displayList();
}

function displayList() {
  // clear the list
  document.querySelector("#list tbody").innerHTML = "";
  // build a new list
  allStudents.forEach(displayStudent);
}

// FILTER HOUSE FUNCTIONS
function selectHouse(event) {
  const filter = event.target.dataset.filter;
  console.log(`User selected ${filter}`);
  //   Kalder setFilter(med det selectede filter)
  // filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  // sets the global variable
  settings.filterBy = filter;
  buildList();
}

function filterList(filteredList) {
  if (settings.filterBy === "cat") {
    // Create a filtered list of only cats
    filteredList = allAnimals.filter(isCat);
  } else if (settings.filterBy === "dog") {
    // Create a filtered list of only dogs
    filteredList = allAnimals.filter(isDog);
  }

  return filteredList;
}

function isCat(animal) {
  return animal.type === "cat";
}

function isDog(animal) {
  return animal.type === "dog";
}

function displayStudent(student) {
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=fullname]").textContent = student.firstName + " " + student.lastName;
  // clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  // clone.querySelector("[data-field=middlename]").textContent = student.middleName;
  // clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  // clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=image] img").src = student.image.src;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}
