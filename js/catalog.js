(function () {
  "use strict";

  var grid = document.getElementById("catalog-grid");
  var searchInput = document.getElementById("catalog-search");
  var filterButtons = document.querySelectorAll(".filter-btn");
  var statusEl = document.getElementById("catalog-status");

  if (!grid) return;

  var cards = Array.prototype.slice.call(
    grid.querySelectorAll(".product-card")
  );

  var currentCategory = "all";
  var currentQuery
    var currentQuery = "";

  function applyFilters() {
    var query = currentQuery.toLowerCase().trim();
    var visibleCount = 0;

    cards.forEach(function (card) {
      var category = card.getAttribute("data-category");
      var name = (card.getAttribute("data-name") || "").toLowerCase();

      var matchesCategory =
        currentCategory === "all" || category === currentCategory;
      var matchesQuery = !query || name.indexOf(query) !== -1;

      if (matchesCategory && matchesQuery) {
        card.classList.remove("is-hidden");
        visibleCount++;
      } else {
        card.classList.add("is-hidden");
      }
    });

    // Убираем старое сообщение «ничего не найдено»
    var emptyEl = grid.querySelector(".catalog-empty");
    if (emptyEl) emptyEl.remove();

    // Если ничего не найдено — показываем заглушку
    if (visibleCount === 0) {
      var empty = document.createElement("p");
      empty.className = "catalog-empty";
      empty.textContent = "По вашему запросу ничего не найдено.";
      grid.appendChild(empty);
    }

    if (statusEl) {
      statusEl.textContent = "Найдено товаров: " + visibleCount;
    }
  }

  // Поиск
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      currentQuery = searchInput.value;
      applyFilters();
    });
  }

  // Фильтр по категориям
  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterButtons.forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      applyFilters();
    });
  });

  // Начальное состояние
  applyFilters();
})();