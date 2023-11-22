"use strict";
// This is the functionality used for closing the Subscription Trial Modal

const closeModal = document.querySelector("#close-modal");
const alertDialog = document.querySelector("#alert-dialog");

const modalCloserFunction = function () {
  alertDialog.remove();
};

closeModal.addEventListener("click", modalCloserFunction);

//This is the functionality used for controlling the accordion menu
let  openAccordions = [];
class Accordion {
  constructor(domNode) {
    this.controllerElement = domNode;
    this.controllerElementButton = this.controllerElement.querySelector(
      "button[aria-expanded]"
    );

    this.controlledElementId =
      this.controllerElementButton.getAttribute("aria-controls");
    this.controlledElement = document.getElementById(this.controlledElementId);

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
      this.closeOtherOpenAccordions();
    } else {
      this.controlledElement.setAttribute("hidden", "");
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


