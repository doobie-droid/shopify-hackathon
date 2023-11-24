"use strict";

// This is the functionality used for closing the Subscription Trial Modal

const closeModal = document.querySelector("#close-modal");
const alertDialog = document.querySelector("#alert-dialog");

const modalCloserFunction = function () {
  alertDialog.remove();
  document.querySelector("section.setup").classList.add("move-up");

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

//This is functionality that is common to both menus
const overlay = document.querySelector("#overlay");
function closeOverlay() {
  overlay.classList.remove("overlay__active");
}

function openOverlay() {
  overlay.classList.add("overlay__active");
}

// This is the functionality used for controlling the notifications menu

let notificationMenuIsOpen = false;
const notificationMenuSection = document.querySelector(
  "#notification__menu--section"
);
const notificationMenuButton = document.querySelector("#notification__button");
const notificationMenu = document.querySelector("#notification__menu");
const notificationMenuItemList = document.querySelectorAll(
  "#notification__menu button"
);

function navigateNotificationMenu(key, menuItems, index) {
  switch (key) {
    case "ArrowUp":
    case "Up":
    case "ArrowLeft":
    case "Left":
      if (index > 0) {
        menuItems.item(index - 1).focus();
      } else {
        menuItems.item(menuItems.length - 1).focus();
      }
      break;
    case "ArrowDown":
    case "Down":
    case "ArrowRight":
    case "Right":
      if (index < menuItems.length - 1) {
        menuItems.item(index + 1).focus();
      } else {
        menuItems.item(0).focus();
      }
      break;
    case "Escape":
    case "Esc":
      closeNotificationMenu();
      break;
  }
}
notificationMenuItemList.forEach((item, index) => {
  item.addEventListener("keyup", function (event) {
    navigateNotificationMenu(event.key, notificationMenuItemList,index);
  });
});

function closeNotificationMenu() {
  notificationMenuButton.setAttribute("aria-expanded", "false");
  notificationMenuSection.classList.remove("menu-active");
  notificationMenuIsOpen = false;
  closeOverlay();
  notificationMenuButton.focus();
}

function openNotificationMenu() {
  notificationMenuButton.setAttribute("aria-expanded", "true");
  notificationMenuSection.classList.add("menu-active");
  notificationMenuIsOpen = true;
  notificationMenuItemList.item(0).focus();
  openOverlay();
}

function ToggleNotificationMenu() {
  const open = notificationMenuButton.getAttribute("aria-expanded") === "true";

  if (open) {
    closeNotificationMenu();
  } else {
    openNotificationMenu();
  }
}

notificationMenuButton.addEventListener("click", ToggleNotificationMenu);
// // This is the functionality used for controlling the profile menu

// // This is the functionality used for closing all menu when a user clicks in the document

// const body = document.querySelector("body");
// body.addEventListener("click", function (event) {
//   // const isClickInsideProfileMenu = profileMenu.contains(event.target);
//   // console.log(event.target);
//   if(menuIsOpen){
//     console.log("menu is open");
//   }else{
//     console.log("menu is closed");
//   }
//   // const isClickInsideNotificationMenu = notificationMenu.contains(event.target);

//   // if (!isClickInsideNotificationMenu) {
//   //   // closeProfileMenu();
//   //   closeNotificationMenu();
//   // }
// });

overlay.addEventListener("click", function (event) {
  if (notificationMenuIsOpen) {
    closeNotificationMenu();
  }
});
