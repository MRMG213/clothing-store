(function () {
  "use strict";

  /* ---------- Утилиты ---------- */

  // Показать сообщение об ошибке рядом с полем
  function setError(fieldName, message) {
    var input = document.getElementById(fieldName);
    var errorEl = document.querySelector('[data-error-for="' + fieldName + '"]');
    if (errorEl) errorEl.textContent = message || "";
    if (input) {
      if (message) {
        input.classList.add("invalid");
        input.setAttribute("aria-invalid", "true");
      } else {
        input.classList.remove("invalid");
        input.removeAttribute("aria-invalid");
      }
    }
  }

  // Очистить все ошибки в форме
  function clearErrors(form) {
    form.querySelectorAll(".error-message").forEach(function (el) {
      el.textContent = "";
    });
    form.querySelectorAll("input").forEach(function (input) {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    });
  }

  // Проверка email регулярным выражением
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  /* ---------- Показ/скрытие пароля ---------- */

  document.querySelectorAll(".toggle-password").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-target");
      var input = document.getElementById(targetId);
      if (!input) return;
      var isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";
      btn.textContent = isPassword ? "🙈" : "👁";
      btn.setAttribute(
        "aria-label",
        isPassword ? "Скрыть пароль" : "Показать пароль"
      );
    });
  });

  /* ---------- Форма регистрации ---------- */

  var registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault(); // отменяем отправку по умолчанию
      clearErrors(registerForm);

      var successEl = document.getElementById("form-success");
      if (successEl) successEl.textContent = "";

      var fullname = document.getElementById("fullname").value.trim();
      var email = document.getElementById("email").value.trim();
      var login = document.getElementById("login").value.trim();
      var password = document.getElementById("password").value;
      var confirm = document.getElementById("confirm-password").value;

      var hasErrors = false;

      if (!fullname) {
        setError("fullname", "Введите ФИО");
        hasErrors = true;
      }

      if (!email) {
        setError("email", "Введите email");
        hasErrors = true;
      } else if (!isValidEmail(email)) {
        setError("email", "Некорректный email");
        hasErrors = true;
      }

      if (!login) {
        setError("login", "Введите логин");
        hasErrors = true;
      } else if (login.length < 3) {
        setError("login", "Логин должен содержать минимум 3 символа");
        hasErrors = true;
      }

      if (!password) {
        setError("password", "Введите пароль");
        hasErrors = true;
      } else if (password.length < 8) {
        setError("password", "Пароль должен содержать минимум 8 символов");
        hasErrors = true;
      }

      if (!confirm) {
        setError("confirm-password", "Повторите пароль");
        hasErrors = true;
      } else if (password && password !== confirm) {
        setError("confirm-password", "Пароли не совпадают");
        hasErrors = true;
      }

      if (hasErrors) {
        // Фокус на первом поле с ошибкой
        var firstInvalid = registerForm.querySelector("input.invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Успешная клиентская валидация
      if (successEl) {
        successEl.textContent =
          "Форма заполнена корректно! Данные готовы к отправке (в ЛР №1 обработки нет).";
      }
    });
  }

  /* ---------- Форма входа ---------- */

  var loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors(loginForm);

      var successEl = document.getElementById("form-success");
      if (successEl) successEl.textContent = "";

      var loginValue = document.getElementById("login-email").value.trim();
      var password = document.getElementById("login-password").value;

      var hasErrors = false;

      if (!loginValue) {
        setError("login-email", "Введите email или логин");
        hasErrors = true;
      }

      if (!password) {
        setError("login-password", "Введите пароль");
        hasErrors = true;
      }

      if (hasErrors) {
        var firstInvalid = loginForm.querySelector("input.invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      if (successEl) {
        successEl.textContent = "Проверка пройдена! (в ЛР №1 авторизация не выполняется)";
      }
    });
  }

  /* ---------- Очистка ошибки при вводе ---------- */

  document.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("input", function () {
      if (input.classList.contains("invalid")) {
        input.classList.remove("invalid");
        input.removeAttribute("aria-invalid");
        var errorEl = document.querySelector(
          '[data-error-for="' + input.id + '"]'
        );
        if (errorEl) errorEl.textContent = "";
      }
    });
  });
})();