"use strict";

// This is the functionality used for closing the Subscription Trial Modal

const closeModal = document.querySelector("#close-modal");
const alertDialog = document.querySelector("#alert-dialog");

const modalCloserFunction = function () {
  alertDialog.remove();
  document.querySelector("section.setup").classList.add("move-up-setup");
};

closeModal.addEventListener("click", modalCloserFunction);

//This is the functionality used for controlling the accordion menu
let openAccordions = [];
class Accordion {
  constructor(domNode) {
    this.controllerElement = domNode;
    this.controllerElementButton = this.controllerElement.querySelector(
      "button[aria-expanded]"
    );

    this.controlledElementId =
      this.controllerElementButton.getAttribute("aria-controls");

    this.controlledElement = document.getElementById(this.controlledElementId);

    const controlledIndex = this.controlledElementId.charAt(
      this.controlledElementId.length - 1
    );
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
    this.toggle(!this.open);
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

  open() {
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
allAccordions.forEach((accordionElement, index) => {
  const accordion = new Accordion(accordionElement);
  if (!index) {
    openAccordions.push(accordion);
  }
});


class Menu {
  static openMenuItems = [];
  constructor(menuButton) {
    this.createOverlay();
    this.menuButton = menuButton;
    this.isOpen = false;
    const menuId = this.menuButton.getAttribute("aria-controls");
    this.menu = document.querySelector(`#${menuId}`);
    this.menuItems = this.menu.querySelectorAll(`#${menuId} button`);

    //I did not want to change the html or css to get the menu section so I just added the menuId as a class in the section to use for retrieving the section but I noticed coincidentally that the class for section is the same as the id for the menu
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

