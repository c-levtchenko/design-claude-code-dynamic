// Larder prototype — Marcus reviews a low-confidence import
// One flow, no build step: DOM sections toggled by data-screen.

(function () {
  "use strict";

  var EXISTING_RECIPES = [
    "Weeknight Roast Chicken",
    "Grandma Ruth's Pierogi",
    "Sheet-Pan Salmon",
    "Sunday Pot Roast",
    "Lemon Orzo Soup",
    "Braised Short Ribs",
    "Skillet Cornbread"
  ];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function showScreen(name) {
    $all(".screen").forEach(function (s) {
      s.classList.toggle("screen--active", s.getAttribute("data-screen") === name);
    });
  }

  function renderBox() {
    var grid = $("#recipe-grid");
    var html = EXISTING_RECIPES.map(function (title) {
      return (
        '<div class="recipe-card">' +
          '<div class="recipe-card__swatch"></div>' +
          '<p class="recipe-card__title">' + title + '</p>' +
          '<p class="recipe-card__sub">In your Box</p>' +
        '</div>'
      );
    }).join("");
    grid.innerHTML = html;
  }

  function init() {
    renderBox();

    var addBtn = $("#btn-add-recipe");
    var addMenu = $("#add-menu");

    addBtn.addEventListener("click", function () {
      var open = addMenu.classList.toggle("add-menu--open");
      addBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!addMenu.contains(e.target) && e.target !== addBtn && !addBtn.contains(e.target)) {
        addMenu.classList.remove("add-menu--open");
        addBtn.setAttribute("aria-expanded", "false");
      }
    });

    $("#btn-from-photo").addEventListener("click", function () {
      addMenu.classList.remove("add-menu--open");
      showScreen("picker");
    });

    $all("[data-goto]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showScreen(btn.getAttribute("data-goto"));
      });
    });

    // ---- Picker screen ----
    var fileChip = $("#file-chip");
    var continueBtn = $("#btn-continue-picker");

    $("#btn-choose-file").addEventListener("click", function () {
      fileChip.classList.add("file-chip--visible");
      continueBtn.disabled = false;
    });

    continueBtn.addEventListener("click", function () {
      showScreen("processing");
      window.setTimeout(function () {
        showScreen("review");
      }, 1500);
    });

    // ---- Review screen: the flagged line ----
    var flaggedRow = $("#flagged-row");
    var flaggedDetail = $("#flagged-detail");
    var qtyInput = $("#qty-input");
    var confirmLineBtn = $("#btn-confirm-line");
    var reviewStatus = $("#review-status");
    var reviewStatusText = $("#review-status-text");
    var saveBtn = $("#btn-save-recipe");
    var pendingReview = true;

    flaggedRow.addEventListener("click", function () {
      var open = flaggedDetail.classList.toggle("flagged-detail--open");
      flaggedRow.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        qtyInput.focus();
        flaggedRow.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    });

    confirmLineBtn.addEventListener("click", function () {
      var value = qtyInput.value.trim() || "2/8 cup";

      flaggedRow.classList.remove("field-row--flagged");
      flaggedRow.classList.add("field-row--confirmed");
      $("#flagged-text").textContent = value + " breadcrumbs";
      flaggedRow.querySelector(".field-row__status").innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12l5 5 11-11"/></svg>';
      flaggedDetail.classList.remove("flagged-detail--open");
      flaggedRow.disabled = true;

      pendingReview = false;
      reviewStatus.classList.add("review-footer__status--clear");
      reviewStatus.querySelector("svg").outerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 12l5 5 11-11"/></svg>';
      reviewStatusText.textContent = "All lines reviewed.";
      saveBtn.disabled = false;

      // carry the corrected quantity into the saved Detail screen
      var detailQty = document.querySelector('.detail-ingredients li[data-corrected] span:last-child');
      if (detailQty) detailQty.textContent = value;
    });

    saveBtn.addEventListener("click", function () {
      if (pendingReview) return;
      showScreen("detail");
      var toast = $("#toast");
      window.requestAnimationFrame(function () {
        toast.classList.add("toast--visible");
      });
      window.setTimeout(function () {
        toast.classList.remove("toast--visible");
      }, 2600);
    });

    // Detail screen tabs are static dressing for this flow — wire basic active-state only.
    $all(".tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        $all(".tab").forEach(function (t) { t.classList.remove("tab--active"); });
        tab.classList.add("tab--active");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
