// ES6 modules are subject to same-origin policy. You need to run your script from a local server, opening the file directly with a browser will not work.
// see here https://stackoverflow.com/questions/52919331/access-to-script-at-from-origin-null-has-been-blocked-by-cors-policy
import db from "../data.json" assert { type: "json" };

window.db = db;

const cachedUserName = localStorage.getItem("user");

if (cachedUserName) {
  document.querySelector("#login-button").classList.add("hidden");
  document.querySelector("#registration-button").classList.add("hidden");
  document.querySelector("#logout-button").classList.remove("hidden");

  const user = JSON.parse(cachedUserName);
  document.querySelector("#user-name").textContent = user.login;
  db.users.push(user);
}

const overlay = document.getElementById("overlay");
let openModalQuery = "";

const openModal = (query) => {
  if (!query) return;

  const modal = document.querySelector(query);

  document.body.classList.add("overflow-hidden");
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");

  openModalQuery = query;
};
const closeModal = (query) => {
  if (!query) return;

  const modal = document.querySelector(query);

  document.body.classList.remove("overflow-hidden");
  modal.classList.add("hidden");
  overlay.classList.add("hidden");

  openModalQuery = "";
};

// Overlay handler
overlay.addEventListener("click", () => closeModal(openModalQuery));

// Modal handlers
document.querySelectorAll("[data-trigger-open-modal]").forEach((element) => {
  const query = element.dataset.triggerOpenModal;
  element.addEventListener("click", () => openModal(query));
});
document.querySelectorAll("[data-trigger-close-modal]").forEach((element) => {
  const query = element.dataset.triggerCloseModal;
  element.addEventListener("click", () => closeModal(query));
});

// Feedback form handler
document.querySelector("#feedback-form").addEventListener("submit", (event) => {
  event.preventDefault();

  // emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, event.target).then(
  emailjs.sendForm("service_zdsw2qr", "template_fq7fsk7", event.target).then(
    () => console.log("SUCCESS!"),
    (error) => console.log("FAILED...", error)
  );

  closeModal("#feedback-modal");
});

// Registration modal handlers
const registrationForm = document.querySelector("#registration-form");

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const { target: form } = event;

  const isSameUser = db.users.some(
    (user) => user.login === form["registration-form--name"].value
  );

  if (isSameUser) {
    const alert = document.querySelector("#alert-registration-fail");
    alert.classList.remove("hidden");
    setTimeout(() => {
      alert.classList.add("hidden");
    }, 2000);
    return;
  }

  db.users.push({
    login: form["registration-form--name"].value,
    password: form["registration-form--password"].value,
  });

  form.reset();

  closeModal("#registration-modal");

  const alert = document.querySelector("#alert-registration");
  alert.classList.remove("hidden");
  setTimeout(() => {
    alert.classList.add("hidden");
  }, 2000);
});

registrationForm["registration-form--confirmPassword"].addEventListener(
  "input",
  (event) => {
    const { target: input } = event;
    const passwordValue = registrationForm["registration-form--password"].value;

    if (input.value !== passwordValue) {
      input.setCustomValidity("Паролі не співпадають");
      return;
    }

    input.setCustomValidity("");
  }
);

// Login modal handlers
const loginForm = document.querySelector("#login-form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const { target: form } = event;

  const user = db.users.find(
    (user) =>
      user.login === form["login-form--name"].value &&
      user.password === form["login-form--password"].value
  );

  if (!user) {
    const alert = document.querySelector("#alert-login");
    alert.classList.remove("hidden");
    setTimeout(() => {
      alert.classList.add("hidden");
    }, 2000);
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
  window.location.reload();
  form.reset();
  closeModal("#login-modal");
});

// Logout handler
document.querySelector("#logout-button").addEventListener("click", () => {
  document.querySelector("#login-button").classList.remove("hidden");
  document.querySelector("#registration-button").classList.remove("hidden");
  document.querySelector("#logout-button").classList.add("hidden");

  localStorage.removeItem("user");
  document.querySelector("#user-name").textContent = "";
});
