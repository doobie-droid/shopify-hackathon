"use strict";

// DOM Elements
const notificationIcon = document.querySelector(".notification__box");
const userIcon = document.querySelector(".user__box");
const alertBox = document.querySelector(".alert__box");
const adminMenuBox = document.querySelector(".admin__menu__box");
const closeTrialIcon = document.querySelector(".trial__close__icon");
const trialBox = document.querySelector(".trial__section");
const progressBar = document.querySelector(".setup__progress__bar");
const closeSetupIcon = document.querySelector(".close__setup");
const openSetupIcon = document.querySelector(".open__setup");

const setupStepsBox = document.querySelector(".setup__steps__box");
const allSetupStepBox = document.querySelectorAll(".setup__step__box");
const allSetupSteps = document.querySelectorAll(".setup__step__heading__text");
const allSetupBtn = document.querySelectorAll(".setup__step__box__button");
const allSetupCheckedIcon = document.querySelector(
  ".setup__step__checked__icon"
);
const allSetupSelectIcon = document.querySelector(".setup__step__select__icon");
const allSetupCheckbox = document.querySelectorAll(".setup__checkbox");
const allSetupCheckboxBoxes = document.querySelectorAll(
  ".setup__step__checkbox__box"
);

// Functions

function closeSetupBox() {
  setupStepsBox.style.display = "none";
  openSetupIcon.style.display = "block";
  closeSetupIcon.style.display = "none";
  allSetupStepBox.forEach((step) => {
    step.setAttribute("aria-hidden", "true");
  });
  setupStepsBox.setAttribute("aria-hidden", "true");
}

function openSetupBox() {
  setupStepsBox.style.display = "block";
  openSetupIcon.style.display = "none";
  closeSetupIcon.style.display = "block";
  allSetupStepBox.forEach((step) => {
    step.setAttribute("aria-hidden", "false");
  });
  setupStepsBox.setAttribute("aria-hidden", "false");
}

function toggleNotificationBox() {
  alertBox.classList.toggle("alert__box__toggle");
  notificationIcon.classList.toggle("notification__icon__hover");

  const expanded = alertBox.classList.contains("alert__box__toggle");
  alertBox.setAttribute("aria-expanded", expanded);
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (event.target === notificationIcon) {
      toggleNotificationBox();
    } else if (event.target === userIcon) {
      toggleAdminUserBox();
    }
  }
}

function toggleAdminUserBox() {
  adminMenuBox.classList.toggle("admin__menu__toggle");
  userIcon.classList.toggle("user__box__active");

  const expanded = adminMenuBox.classList.contains("admin__menu__toggle");
  adminMenuBox.setAttribute("aria-expanded", expanded);
}

function removeTrialBox() {
  trialBox.setAttribute("aria-hidden", "true");
  trialBox.style.display = "none";
}

function handleTrialBoxKeyPress(event) {
  if (event.key === "Enter" || event.key === " ") {
    removeTrialBox();
    event.preventDefault();
  }
}

// Checkbox Functions
function handleCheckboxToggle(checkbox, checkedIcon, selectIcon) {
  checkbox.checked = !checkbox.checked;

  if (checkbox.checked) {
    checkedIcon.classList.add("setup__step__checked__icon__active");
    selectIcon.style.display = "none";
  } else {
    checkedIcon.classList.remove("setup__step__checked__icon__active");
    selectIcon.style.display = "block";
  }
}

function updateProgressBar() {
  const progressNumber = document.querySelector(".setup__completed__number");
  const completedSteps = document.querySelectorAll(
    ".setup__step__checked__icon__active"
  );

  progressBar.value = completedSteps.length;
  progressNumber.textContent = completedSteps.length;
}

function expandNextIncompleteStep(startIndex) {
  let nextUncheckedIndex = null;

  for (let i = startIndex; i < allSetupCheckboxBoxes.length; i++) {
    const checkboxBox = allSetupCheckboxBoxes[i];
    const checkbox = checkboxBox.querySelector(".setup__checkbox");

    if (!checkbox.checked) {
      nextUncheckedIndex = i;
      removeAllActiveBoxClasses();
      activateNextStepBox(checkboxBox);
      break;
    }
  }

  if (nextUncheckedIndex === null) {
    for (let i = 0; i < startIndex; i++) {
      const checkboxBox = allSetupCheckboxBoxes[i];
      const checkbox = checkboxBox.querySelector(".setup__checkbox");

      if (!checkbox.checked) {
        removeAllActiveBoxClasses();
        activateNextStepBox(checkboxBox);
        break;
      }
    }
  }
}

function removeAllActiveBoxClasses() {
  const activeSetUpBox = document.querySelectorAll(".setup__step__box__active");

  activeSetUpBox.forEach((box) => {
    box.classList.remove("setup__step__box__active");
  });
}

function activateNextStepBox(checkboxBox) {
  const nextStepBox = checkboxBox.closest(".setup__step__box");
  if (nextStepBox) {
    nextStepBox.classList.add("setup__step__box__active");
  }
}

function expandSetupStep(e) {
  removeAllActiveBoxClasses();
  const parentEl = e.target.closest(".setup__step__box");
  parentEl.classList.add("setup__step__box__active");
}

// Checkbox Setup
allSetupCheckboxBoxes.forEach((checkboxBox, index) => {
  const checkbox = checkboxBox.querySelector(".setup__checkbox");
  const checkedIcon = checkboxBox.querySelector(".setup__step__checked__icon");
  const selectIcon = checkboxBox.querySelector(".setup__step__select__icon");

  checkboxBox.addEventListener("click", function () {
    handleCheckboxToggle(checkbox, checkedIcon, selectIcon);
    updateProgressBar();
    removeAllActiveBoxClasses();
    expandNextIncompleteStep(index + 1);
  });
});

// Event Listeners
notificationIcon.addEventListener("click", toggleNotificationBox);
userIcon.addEventListener("click", toggleAdminUserBox);
notificationIcon.addEventListener("keypress", handleKeyPress);
userIcon.addEventListener("keypress", handleKeyPress);

closeTrialIcon.addEventListener("click", removeTrialBox);
closeTrialIcon.addEventListener("keypress", handleTrialBoxKeyPress);
closeTrialIcon.addEventListener("keypress", (event) => {
  if (event.key === "Escape") {
    removeTrialBox();
  }
});

closeSetupIcon.addEventListener("click", closeSetupBox);
openSetupIcon.addEventListener("click", openSetupBox);
allSetupSteps.forEach((btn) => btn.addEventListener("click", expandSetupStep));

// notificationIcon.addEventListener("keydown", (event) => {
//   if (event.key === "Enter" || event.key === " ") {
//     toggleNotificationBox();
//     event.preventDefault(); // Prevents the default behavior of the space key
//   }
// });

// // Add ARIA attributes to the notification icon
// notificationIcon.setAttribute("role", "button");
// notificationIcon.setAttribute("aria-haspopup", "true");
// notificationIcon.setAttribute("aria-expanded", "false");

// // Add keyboard accessibility to the user icon
// userIcon.addEventListener("keydown", (event) => {
//   if (event.key === "Enter" || event.key === " ") {
//     toggleAdminUserBox();
//     event.preventDefault(); // Prevents the default behavior of the space key
//   }
// });

// // Add ARIA attributes to the user icon
// userIcon.setAttribute("role", "button");
// userIcon.setAttribute("aria-haspopup", "true");
// userIcon.setAttribute("aria-expanded", "false");
