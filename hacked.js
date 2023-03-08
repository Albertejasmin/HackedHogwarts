"use strict";

window.addEventListener("DOMContentLoaded", start);

// Global array
const allStudents = [];

let expelledStudents = [];

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
  prefect: false,
  bloodtype: "",
  inqusitorial: false,
  expelled: false,
};

function start() {
  console.log("ready");
  loadJSON();
  addButtons();

  // tilføjer eventlistners til knapperne
  // document.querySelector("#expelledButton").addEventListener("click", showExpelledStudents);
  // document.querySelector("#squadedButton").addEventListener("click", showSquadedStudents);
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
}

// Load json
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
  // console.log(jsonData);
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

  /* CLICK STUDENT - POPUP */
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
  // console.log(student);
  // create clone
  const clone = document.querySelector("template#student").content.cloneNode(true);
  // set clone data
  clone.querySelector("[data-field=fullname]").textContent = student.firstName + " " + student.lastName;
  clone.querySelector("[data-field=firstname]").textContent = student.firstName;
  clone.querySelector("[data-field=prefect]").textContent = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", makePrefect);
  // clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  // clone.querySelector("[data-field=nickname]").textContent = student.nickName;
  clone.querySelector("[data-field=image] img").src = student.image.src;
  clone.querySelector("[data-field=house]").textContent = student.house;

  /* CLICK STUDENT POPUP */
  clone.querySelector("#student_info").addEventListener("click", showPopup);

  // PREFECT
  if (student.prefect) {
    clone.querySelector("[data-field=prefect]").textContent = "Yes";
  } else {
    clone.querySelector("[data-field=prefect]").textContent = "No";
  }

  function makePrefect() {
    if (student.prefect) {
      student.prefect = false;
    } else {
      // console.log("nu skal vi lave prefect");
      tryMakePrefect(student);
    }

    buildList();
  }
  // TRY MAKE PREFECT
  function tryMakePrefect(selectedPrefect) {
    // filterer på alle studerende der prefects
    const prefects = allStudents.filter((student) => student.prefect);
    console.log(prefects);
    const others = prefects.filter((student) => student.house === selectedPrefect.house);
    console.log(others);

    if (others.length > 1) {
      removeOthers(others);
    } else {
      isPrefect(selectedPrefect);
    }
    isPrefect(selectedPrefect);

    function isPrefect(student) {
      student.prefect = true;
    }

    function removeOthers(others) {
      // sprøg om user vil ignore eller fjerne studerende
      document.querySelector("#remove_AorB").classList.remove("hide");
      document.querySelector("#remove_AorB .closebtn_dialog").addEventListener("click", closeDialog);
      document.querySelector("#remove_AorB #remove_a").addEventListener("click", () => clickRemoveA(others[0], selectedPrefect));
      document.querySelector("#remove_AorB #remove_b").addEventListener("click", () => clickRemoveB(others[1], selectedPrefect));

      //vis navne på knapper
      document.querySelector("#remove_a [data-field=prefectA]").textContent = others[0].firstName;
      document.querySelector("#remove_b [data-field=prefectB]").textContent = others[1].firstName;
    }
  }

  function closeDialog() {
    document.querySelector("#remove_AorB").classList.add("hide");
    document.querySelector("#remove_AorB .closebtn_dialog").removeEventListener("click", closeDialog);
    document.querySelector("#remove_AorB #remove_a").removeEventListener("click", clickRemoveA);
    document.querySelector("#remove_AorB #remove_b").removeEventListener("click", clickRemoveB);
  }

  function clickRemoveA(studentA, selectedPrefect) {
    removePrefect(studentA);
    makeNewPrefect(selectedPrefect);
    buildList();
    closeDialog();
  }

  function clickRemoveB(studentB, selectedPrefect) {
    removePrefect(studentB);
    makeNewPrefect(selectedPrefect);
    buildList();
    closeDialog();
  }

  function removePrefect(others) {
    others.prefect = false;
  }

  function makeNewPrefect(student) {
    student.prefect = true;
  }

  /* POPUP STUDENT */
  /* vis popup  */
  function showPopup(others) {
    let popup = document.querySelector("#popupContainer");
    popup.classList.add("show");
    popup.style.display = "block";

    // Make element visible
    let jasonDataStudent = document.querySelector("#student");
    jasonDataStudent.classList.add("show");
    jasonDataStudent.style.display = "block";

    // Get firstname from the student object OBS den kan ikke finde dette ???
    let firstNamePop = student.firstName;
    let middleNamePop = student.middleName;
    let lastNamePop = student.lastName;
    let nickNamePop = student.nickName;

    // let imagePop = student.image;

    // Update the HTML with the first name
    // let getImg = document.querySelector("#studentInfo img");
    let namePop = document.querySelectorAll(".studentName p");
    namePop[0].textContent = "Firstname: " + firstNamePop;
    namePop[1].textContent = "Middlename: " + middleNamePop;
    namePop[2].textContent = "Lastname: " + lastNamePop;
    namePop[3].textContent = "Nickname: " + nickNamePop;
    document.querySelector("#image img").src = student.image.src;

    // change background based on house
    if (student.house === "Gryffindor") {
      document.querySelector("#popupContainer").style.backgroundColor = "#7f0909";
    } else if (student.house === "Slytherin") {
      document.querySelector("#popupContainer").style.backgroundColor = "#1a472a";
    } else if (student.house === "Hufflepuff") {
      document.querySelector("#popupContainer").style.backgroundColor = "#ecb939";
    } else if (student.house === "Ravenclaw") {
      document.querySelector("#popupContainer").style.backgroundColor = "#0e1a40";
    } else {
      document.querySelector("#popupContainer").style.backgroundColor = "white";
    }

    // Listen for click on close button
    document.querySelector(".closebtn").addEventListener("click", closePopup);
  }

  // append clone to list
  document.querySelector("#list tbody").appendChild(clone);
}

/* luk popup */
function closePopup() {
  let closePopup = document.querySelector("#popupContainer");
  closePopup.classList.add("hide");
  closePopup.style.display = "none";
  // document.querySelector("#prefectText").textContent;
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
  document.querySelector("h3").textContent = `The list has ${sortedList.length} students`;

  /* Click search */
  document.querySelector("#search").addEventListener("input", search);

  /* search */
  function search(evt) {
    const input = evt.target.value;

    const searchStudents = sortedList.filter((student) => {
      const fullStudentName = `${student.firstName} ${student.middleName} ${student.nickName} ${student.lastName}`;

      if (fullStudentName.toLowerCase().includes(input.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    });

    displayList(searchStudents);

    document.querySelector("h3").textContent = `The list has ${searchStudents.length} students`;

    if (searchStudents.length === 1) {
      document.querySelector("h3").textContent = `The list has 1 student`;
    }

    if (searchStudents.length === 0) {
      document.querySelector("h3").textContent = `No match`;
    }
  }
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

/* clone jsondata firstname, middlename, nickname og lastname og img på den enkelte student */
