"use strict";

// This is the functionality used for closing the Subscription Trial Modal

const closeModal = document.querySelector("#close-modal");
const trialModalSection = document.querySelector("section.trialModal");

const modalCloserFunction = function () {
  trialModalSection.remove();
  document.querySelector("section.setup").classList.add("move-up-setup");
};

closeModal.addEventListener("click", modalCloserFunction);

//This is the functionality used for controlling the accordion menu
let openAccordions = [];
class Accordion {
  constructor(domNode) {
    this.controllerElement = domNode;
    this.controllerElementButton = this.controllerElement.querySelector(
      "span[aria-expanded]"
    );

    this.controlledElementId =
      this.controllerElementButton.getAttribute("aria-controls");

    this.controlledElement = document.getElementById(this.controlledElementId);

    console.log(this.controlledElementId);
    const controlledIndex = this.controlledElementId.charAt(
      this.controlledElementId.length - 1
    );
    console.log(controlledIndex);
    this.controlledElementImage = document.querySelector(
      `#accordion-image-${controlledIndex}`
    );

    this.open =
      this.controllerElementButton.getAttribute("aria-expanded") === "true";

    // add event listeners
    this.controllerElementButton.addEventListener(
      "click",
      this.onButtonClick.bind(this)
    );
  }

  onButtonClick() {
    if (!this.open) {
      this.toggle(!this.open);
    }
  }

  toggle(open) {
    // if the state is already set as requested, do nothing
    if (open === this.open) {
      return;
    }
    // update state
    this.open = open;
    // update DOM
    this.controllerElementButton.setAttribute("aria-expanded", `${open}`);
    console.log(this.controlledElement);
    console.log(this.open);
    if (open) {
      this.controlledElement.removeAttribute("hidden");
      this.controlledElement.nextElementSibling.removeAttribute("hidden");
      this.controlledElement.parentElement.parentElement.classList.add(
        "accordion-card"
      );
      this.controlledElementImage.removeAttribute("hidden");
      this.closeOtherOpenAccordions();
    } else {
      this.controlledElement.setAttribute("hidden", "");
      this.controlledElement.nextElementSibling.setAttribute("hidden", "");
      this.controlledElement.parentElement.parentElement.classList.remove(
        "accordion-card"
      );
      this.controlledElementImage.setAttribute("hidden", "");
    }
  }

  openPanel() {
    this.toggle(true);
  }

  close() {
    this.toggle(false);
  }

  closeOtherOpenAccordions() {
    openAccordions.push(this);
    if (openAccordions.length > 0) {
      const tempOpenAccordions = [];
      openAccordions.forEach((accordion, index) => {
        if (accordion.controlledElementId == this.controlledElementId) {
          tempOpenAccordions.push(accordion);
        } else {
          accordion.close();
        }
      });
      openAccordions = tempOpenAccordions;
    }
  }
}

// initialize all accordions
const allAccordions = document.querySelectorAll(".accordion h3");
const AllAccordionObjects = [];
allAccordions.forEach((accordionElement, index) => {
  const accordion = new Accordion(accordionElement);
  AllAccordionObjects.push(accordion);
  if (!index) {
    openAccordions.push(accordion);
  }
});

//This is the functionality used for controlling the menus
class Menu {
  static openMenuItems = [];
  constructor(menuButton) {
    this.createOverlay();
    this.menuButton = menuButton;
    this.isOpen = false;
    const menuId = this.menuButton.getAttribute("aria-controls");
    this.menu = document.querySelector(`#${menuId}`);
    this.menuItems = this.menu.querySelectorAll(`#${menuId} button`);
    this.menuSection = document.querySelector(`section.${menuId}`);
    this.menuButton.addEventListener("click", this.toggleMenu.bind(this));
    this.overlay.addEventListener("click", this.closeMenu.bind(this));
    this.menuItems.forEach((item, index) => {
      const menu = this;
      item.addEventListener("keyup", (event) => {
        menu.navigateMenu(event.key, index);
      });
    });
  }

  createOverlay() {
    this.overlay = document.createElement("div");
    this.overlay.classList.add("overlay");
    document.body.appendChild(this.overlay);
  }
  closeOverlay() {
    this.overlay.classList.remove("overlay__active");
  }

  openOverlay() {
    this.overlay.classList.add("overlay__active");
  }

  openMenu() {
    this.closeAllMenus();
    this.menuButton.setAttribute("aria-expanded", "true");
    this.menuSection.classList.add("menu-active");
    this.isOpen = true;
    this.menuItems.item(0).focus();
    this.openOverlay();
    Menu.openMenuItems.push(this);
  }

  closeMenu() {
    this.menuButton.setAttribute("aria-expanded", "false");
    this.menuSection.classList.remove("menu-active");
    this.isOpen = false;
    this.closeOverlay();
    this.menuButton.focus();
    Menu.openMenuItems.length = 0;
  }

  toggleMenu() {
    this.menuButton.focus();
    const open = this.menuButton.getAttribute("aria-expanded") === "true";

    if (open) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  closeAllMenus() {
    if (Menu.openMenuItems.length > 0) {
      Menu.openMenuItems.forEach((menuItem) => {
        menuItem.closeMenu();
      });
    }
  }
  navigateMenu(keyPress, index) {
    switch (keyPress) {
      case "ArrowUp":
      case "Up":
      case "ArrowLeft":
      case "Left":
        if (index > 0) {
          this.menuItems.item(index - 1).focus();
        } else {
          this.menuItems.item(this.menuItems.length - 1).focus();
        }
        break;
      case "ArrowDown":
      case "Down":
      case "ArrowRight":
      case "Right":
        if (index < this.menuItems.length - 1) {
          this.menuItems.item(index + 1).focus();
        } else {
          this.menuItems.item(0).focus();
        }
        break;
      case "Escape":
      case "Esc":
        this.closeMenu();
        break;
    }
  }
}

const profileMenuButton = document.querySelector("#profile__menu--button");
const profileMenu = new Menu(profileMenuButton);
const notificationMenuButton = document.querySelector("#notification__button");
const notificationMenu = new Menu(notificationMenuButton);

//This is the functionality for controlling the stages of the setup process

//get all the buttons

const checkboxButtons = document.querySelectorAll(".accordion-icon");
class CheckBox {
  static progress = 0;
  static allCheckboxes = [];
  static checkBoxes = 0;

  constructor(checkboxButton) {
    this.checkCheckboxNumber = CheckBox.checkBoxes++;
    this.progressBar = document.querySelector("progress");
    this.progressBarText = document.querySelector("#progressbar__text");
    this.checkboxButton = checkboxButton;
    this.checkboxButton.addEventListener(
      "click",
      this.toggleCheckbox.bind(this)
    );
    this.checkboxButton.addEventListener("keyup", (event) => {
      this.navigateCheckBox(event.key);
    });

    CheckBox.allCheckboxes.push(this);
  }

  updateProgress(stateChange) {
    if (stateChange == "checked") {
      CheckBox.progress++;
    } else {
      CheckBox.progress--;
    }
    this.progressBar.value = CheckBox.progress;
    this.progressBar.setAttribute("aria-valuenow", CheckBox.progress);
    this.progressBarText.setAttribute(
      "aria-label",
      `${CheckBox.progress} out of 5 Completed`
    );
    this.progressBarText.textContent = `${CheckBox.progress} / 5 Completed`;
  }

  checkCheckbox() {
    this.checkboxButton.setAttribute("aria-checked", "true");
    this.checkboxButton.classList.add("accordion-checked");
    this.updateProgress("checked");
    setTimeout(() => {
      
      this.switchFocusToNextUncheckedCheckbox();
    }, 100);
  }

  uncheckCheckbox() {
    this.checkboxButton.setAttribute("aria-checked", "false");
    this.checkboxButton.classList.remove("accordion-checked");
    this.updateProgress("unchecked");
  }

  toggleCheckbox() {
    const checked = this.checkboxButton.getAttribute("aria-checked") === "true";

    if (checked) {
      this.uncheckCheckbox();
    } else {
      this.checkCheckbox();
    }
  }

  switchFocusToNextUncheckedCheckbox() {
    let emptyCheckBoxFound = false;
    let emptyCheckBoxIndex = 0;
    CheckBox.allCheckboxes.forEach((checkbox, index) => {
      if (
        checkbox.checkboxButton.getAttribute("aria-checked") === "false" &&
        !emptyCheckBoxFound
      ) {
        emptyCheckBoxFound = true;
        emptyCheckBoxIndex = index;
        return;
      }
    });
    CheckBox.allCheckboxes[emptyCheckBoxIndex].checkboxButton.focus();
    AllAccordionObjects[emptyCheckBoxIndex].openPanel();
   
  }

  switchFocusToPreviousCheckbox() {
    if (this.checkCheckboxNumber > 0) {
      CheckBox.allCheckboxes[
        this.checkCheckboxNumber - 1
      ].checkboxButton.focus();
    } else {
      CheckBox.allCheckboxes[
        CheckBox.allCheckboxes.length - 1
      ].checkboxButton.focus();
    }
  }

  switchFocusToNextCheckbox() {
    if (this.checkCheckboxNumber < CheckBox.allCheckboxes.length - 1) {
      CheckBox.allCheckboxes[
        this.checkCheckboxNumber + 1
      ].checkboxButton.focus();
    } else {
      CheckBox.allCheckboxes[0].checkboxButton.focus();
    }
  }

  navigateCheckBox(keyPress) {
    switch (keyPress) {
      case "ArrowUp":
      case "Up":
      case "ArrowLeft":
      case "Left":
        this.switchFocusToPreviousCheckbox();
        break;
      case "ArrowDown":
      case "Down":
      case "ArrowRight":
      case "Right":
        this.switchFocusToNextCheckbox();
        break;
    }
  }
}

checkboxButtons.forEach((checkboxButton) => {
  new CheckBox(checkboxButton);
});

//if the button class was toggled on,
//go through the list for any button that has not been toggled and focus on them
//if there are no buttons, then just close that tab

//every toggling of the button clicked class increases the progress value

const progressBar = document.querySelector("progress");
