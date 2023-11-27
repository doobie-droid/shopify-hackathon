"use strict";
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
      item.addEventListener("click", this.visitShopifyAdmin.bind(this));
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
  visitShopifyAdmin() {
    window.location.href = "https://admin.shopify.com/";
  }
  navigateMenu(keyPress, index) {
    console.log(keyPress);
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
      case "Enter":
        window.location.href = "https://admin.shopify.com/";
    }
  }
}

const profileMenuButton = document.querySelector("#profile__menu--button");
const profileMenu = new Menu(profileMenuButton);
const notificationMenuButton = document.querySelector("#notification__button");
const notificationMenu = new Menu(notificationMenuButton);

// This is the functionality used for closing the Subscription Trial Modal

const closeModal = document.querySelector("#close-modal");
const closeModal2 = document.querySelector("#close-modal2");
const trialModalSection = document.querySelector("section.trialModal");

const modalCloserFunction = function () {
  trialModalSection.remove();
};

closeModal.addEventListener("click", modalCloserFunction);
closeModal2.addEventListener("click", modalCloserFunction);

//This is the functionality used for controlling the accordion menu
class Accordion {
  static openAccordions = [];
  static accordionCount = 0;
  static allAccordions = [];
  constructor(domNode) {
    this.accordionNumber = Accordion.accordionCount++;
    if (!this.accordionNumber) {
      Accordion.openAccordions.push(this);
    }
    Accordion.allAccordions.push(this);
    this.controllerElement = domNode;
    this.controlledElementId =
      this.controllerElement.getAttribute("aria-controls");
    this.controlledElement = document.getElementById(this.controlledElementId);

    this.open = this.controllerElement.getAttribute("aria-expanded") === "true";

    // add event listeners
    this.controllerElement.addEventListener(
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
    if (open === this.open) {
      return;
    }
    this.open = open;
    this.controllerElement.setAttribute("aria-expanded", `${open}`);
    if (open) {
      this.controlledElement.classList.add("accordion-active");
      this.closeOtherOpenAccordions();
    } else {
      this.controlledElement.classList.remove("accordion-active");
    }
  }

  openPanel() {
    this.toggle(true);
  }

  close() {
    this.toggle(false);
  }

  closeOtherOpenAccordions() {
    Accordion.openAccordions.push(this);
    if (Accordion.openAccordions.length > 0) {
      const tempOpenAccordions = [];
      Accordion.openAccordions.forEach((accordion, index) => {
        if (accordion.controlledElementId == this.controlledElementId) {
          tempOpenAccordions.push(accordion);
        } else {
          accordion.close();
        }
      });
      Accordion.openAccordions = tempOpenAccordions;
    }
  }
}

// initialize all accordions
const allAccordions = document.querySelectorAll(".accordion-header-hidden");
allAccordions.forEach((accordionElement, index) => {
  new Accordion(accordionElement);
});

//This is the functionality for opening and closing the setup Accordion Menu
class AccordionMenu {
  constructor(menuPopupButton) {
    this.menuPopupButton = menuPopupButton;
    this.menuPopupButton.addEventListener("click", this.toggleMenu.bind(this));
    const menuId = this.menuPopupButton.getAttribute("aria-controls");
    this.menu = document.querySelector(`#${menuId}`);
  }

  openMenu() {
    this.menuPopupButton.setAttribute("aria-expanded", "true");
    this.menu.classList.add("menu-active");
    this.menuPopupButton.classList.add("dropdown-activated");
  }

  closeMenu() {
    this.menuPopupButton.setAttribute("aria-expanded", "false");
    this.menu.classList.remove("menu-active");
    this.menuPopupButton.classList.remove("dropdown-activated");
  }

  toggleMenu() {
    console.log("toggle");
    const open = this.menuPopupButton.getAttribute("aria-expanded") === "true";

    if (open) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
}

const dropDown = document.querySelector("#menu-dropdown");
const AccordionMenuObject = new AccordionMenu(dropDown);

//This is the functionality for controlling the stages of the setup process

const checkboxButtons = document.querySelectorAll(".accordion-checkbox");
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

    this.checkboxButton.classList.add("accordion-checking");

    setTimeout(() => {
      this.checkboxButton.classList.remove("accordion-checking");
      this.checkboxButton.classList.add("accordion-checked");
    }, 100);

    this.updateProgress("checked");

    this.switchFocusToNextUncheckedCheckbox();
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
    Accordion.allAccordions[emptyCheckBoxIndex].openPanel();
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


