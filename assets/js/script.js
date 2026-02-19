'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
if (sidebar && sidebarBtn) {
  sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });
}



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

if (
  testimonialsItem.length &&
  modalContainer &&
  modalCloseBtn &&
  overlay &&
  modalImg &&
  modalTitle &&
  modalText
) {
  // add click event to all modal items
  for (let i = 0; i < testimonialsItem.length; i++) {

    testimonialsItem[i].addEventListener("click", function () {

      modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
      modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
      modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
      modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

      testimonialsModalFunc();

    });

  }

  // add click event to modal close button
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
  overlay.addEventListener("click", testimonialsModalFunc);
}



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
if (select && selectValue && selectItems.length) {
  for (let i = 0; i < selectItems.length; i++) {
    selectItems[i].addEventListener("click", function () {

      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      elementToggleFunc(select);
      filterFunc(selectedValue);

    });
  }
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

if (filterBtn.length && selectValue) {
  for (let i = 0; i < filterBtn.length; i++) {

    filterBtn[i].addEventListener("click", function () {

      let selectedValue = this.innerText.toLowerCase();
      selectValue.innerText = this.innerText;
      filterFunc(selectedValue);

      lastClickedBtn.classList.remove("active");
      this.classList.add("active");
      lastClickedBtn = this;

    });

  }
}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
const formStatus = document.querySelector("[data-form-status]");

const setFormStatus = function (message, isError = false) {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.classList.add("is-visible");
  formStatus.classList.toggle("is-error", isError);
}

const clearFormStatus = function () {
  if (!formStatus) return;

  formStatus.textContent = "";
  formStatus.classList.remove("is-visible", "is-error");
}

// add event to all form input field
if (form && formBtn && formInputs.length) {
  let isIframeSubmitting = false;
  const hiddenIframeName = form.getAttribute("target");
  const hiddenIframe = hiddenIframeName
    ? document.querySelector(`iframe[name="${hiddenIframeName}"]`)
    : null;

  for (let i = 0; i < formInputs.length; i++) {
    formInputs[i].addEventListener("input", function () {
      clearFormStatus();

      // check form validation
      if (form.checkValidity()) {
        formBtn.removeAttribute("disabled");
      } else {
        formBtn.setAttribute("disabled", "");
      }

    });
  }

  if (hiddenIframe) {
    hiddenIframe.addEventListener("load", function () {
      if (!isIframeSubmitting) return;

      isIframeSubmitting = false;
      form.reset();
      formBtn.setAttribute("disabled", "");
      setFormStatus("Message sent successfully!");
    });
  }

  form.addEventListener("submit", async function (event) {
    const googleFormUrl = form.dataset.googleFormUrl;
    const fullNameEntry = form.dataset.entryFullname;
    const emailEntry = form.dataset.entryEmail;
    const messageEntry = form.dataset.entryMessage;

    const fullNameInput = form.querySelector('input[name="fullname"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    if (!googleFormUrl || !fullNameEntry || !emailEntry || !messageEntry) {
      if (hiddenIframe) {
        isIframeSubmitting = true;
        formBtn.setAttribute("disabled", "");
        setFormStatus("Sending message...");
      }
      return;
    }

    if (!fullNameInput || !emailInput || !messageInput) return;

    event.preventDefault();

    const formData = new URLSearchParams();
    formData.append(fullNameEntry, fullNameInput.value);
    formData.append(emailEntry, emailInput.value);
    formData.append(messageEntry, messageInput.value);

    formBtn.setAttribute("disabled", "");

    try {
      await fetch(googleFormUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: formData.toString()
      });

      form.reset();
      formBtn.setAttribute("disabled", "");
      setFormStatus("Message sent successfully!");
    } catch (error) {
      formBtn.removeAttribute("disabled");
      setFormStatus("Unable to send message right now. Please try again.", true);
    }
  });
}



// ==============================
// PAGE NAVIGATION (HARD FIX)
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("article[data-page]");

  if (!navLinks.length || !pages.length) return;

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const target = (link.dataset.target || "").toLowerCase();

      // Navbar active state
      navLinks.forEach(btn => btn.classList.remove("active"));
      link.classList.add("active");

      // Page switching
      pages.forEach(page => {
        page.classList.remove("active");
        if ((page.dataset.page || "").toLowerCase() === target) {
          page.classList.add("active");
        }
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
});
