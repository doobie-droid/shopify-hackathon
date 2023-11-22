
// This is the functionality used for closing the Subscription Trial Modal

const closeModal = document.querySelector('#close-modal');
const alertDialog = document.querySelector('#alertdialog');

const modalCloserFunction = function () {
    alertDialog.style.display = 'none'; 
};

closeModal.addEventListener('click', modalCloserFunction)

