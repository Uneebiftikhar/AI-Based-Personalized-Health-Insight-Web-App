document.addEventListener("DOMContentLoaded", () => {
  // --- Theme Toggle Logic ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
  const themeToggleLightIcon = document.getElementById(
    "theme-toggle-light-icon"
  );

  if (
    localStorage.getItem("color-theme") === "dark" ||
    (!("color-theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    if (themeToggleLightIcon) themeToggleLightIcon.classList.remove("hidden");
  } else {
    if (themeToggleDarkIcon) themeToggleDarkIcon.classList.remove("hidden");
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      themeToggleDarkIcon.classList.toggle("hidden");
      themeToggleLightIcon.classList.toggle("hidden");
      if (localStorage.getItem("color-theme")) {
        if (localStorage.getItem("color-theme") === "light") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        }
      } else {
        if (document.documentElement.classList.contains("dark")) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("color-theme", "light");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("color-theme", "dark");
        }
      }
    });
  }

  // --- Mobile Menu Toggle ---
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener("click", () =>
      mobileMenu.classList.toggle("hidden")
    );
  }

  // --- Logout Confirmation Modal Logic ---
  const desktopLogoutButton = document.getElementById("logout-button");
  const mobileLogoutButton = document.getElementById("mobile-logout-button");
  const logoutModal = document.getElementById("logout-modal");
  const confirmLogoutBtn = document.getElementById("confirm-logout-btn");
  const cancelLogoutBtn = document.getElementById("cancel-logout-btn");

  function showLogoutModal(e) {
    e.preventDefault();
    if (logoutModal) logoutModal.classList.remove("hidden");
  }

  if (desktopLogoutButton)
    desktopLogoutButton.addEventListener("click", showLogoutModal);
  if (mobileLogoutButton)
    mobileLogoutButton.addEventListener("click", showLogoutModal);
  if (cancelLogoutBtn)
    cancelLogoutBtn.addEventListener("click", () =>
      logoutModal.classList.add("hidden")
    );
  if (confirmLogoutBtn)
    confirmLogoutBtn.addEventListener(
      "click",
      () => (window.location.href = "/logout")
    );

  // --- Generic Form Submission for Text-based Tools ---
  async function handleTextFormSubmit(formElement, url, body, resultDivId) {
    const resultDiv = document.getElementById(resultDivId);
    const submitButton = formElement.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    try {
      submitButton.innerHTML = "Generating...";
      submitButton.disabled = true;
      resultDiv.innerHTML =
        '<div class="text-center p-4 text-gray-600 dark:text-gray-300">Getting insights from our AI... Please wait.</div>';
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body,
      });
      const data = await response.json();
      if (data.html) {
        resultDiv.innerHTML = data.html;
      } else {
        resultDiv.innerHTML = `<p class="text-red-500">Sorry, the server returned an error: ${
          data.error || "Invalid response"
        }</p>`;
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      resultDiv.innerHTML =
        '<p class="text-red-500">An error occurred. Please check the console for details.</p>';
    } finally {
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
    }
  }

  // Event listeners for text-based forms
  const meditationForm = document.getElementById("meditation-form");
  if (meditationForm) {
    meditationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const meditationType = document.getElementById("meditation-type").value;
      handleTextFormSubmit(
        e.target,
        "/get-meditation-therapy",
        `meditation_type=${meditationType}`,
        "meditation-result"
      );
    });
  }

  const dietForm = document.getElementById("diet-form");
  if (dietForm) {
    dietForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const healthInfo = document.getElementById("health-info").value;
      handleTextFormSubmit(
        e.target,
        "/get-diet-plan",
        `health_info=${healthInfo}`,
        "diet-result"
      );
    });
  }

  const symptomsForm = document.getElementById("symptoms-form");
  if (symptomsForm) {
    symptomsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const symptoms = document.getElementById("symptoms").value;
      handleTextFormSubmit(
        e.target,
        "/get-disease-precautions",
        `symptoms=${symptoms}`,
        "symptoms-result"
      );
    });
  }

  // --- BMI Calculator Logic ---
  const bmiForm = document.getElementById("bmi-form");
  if (bmiForm) {
    bmiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const heightFt = parseFloat(document.getElementById("height-ft").value);
      const heightIn =
        parseFloat(document.getElementById("height-in").value) || 0;
      const weightKg = parseFloat(document.getElementById("weight-kg").value);
      const resultDiv = document.getElementById("bmi-result");
      if (isNaN(heightFt) || isNaN(weightKg)) {
        resultDiv.innerHTML =
          '<p class="text-red-500">Please enter valid numbers for height and weight.</p>';
        return;
      }
      const heightInches = heightFt * 12 + heightIn;
      const heightMeters = heightInches * 0.0254;
      const bmi = weightKg / (heightMeters * heightMeters);
      let category = "";
      let categoryClass = "";
      if (bmi < 18.5) {
        category = "Underweight";
        categoryClass = "text-yellow-600";
      } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal weight";
        categoryClass = "text-green-600";
      } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
        categoryClass = "text-orange-600";
      } else {
        category = "Obesity";
        categoryClass = "text-red-600";
      }
      const resultHTML = `
        <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Your BMI is: <span class="text-blue-600 dark:text-blue-400">${bmi.toFixed(
              2
            )}</span></h3>
            <p class="mt-2 text-md text-gray-700 dark:text-gray-300">This is considered: <strong class="${categoryClass}">${category}</strong></p>
            <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <p><strong>Underweight:</strong> less than 18.5</p>
                <p><strong>Normal weight:</strong> 18.5 – 24.9</p>
                <p><strong>Overweight:</strong> 25 – 29.9</p>
                <p><strong>Obesity:</strong> BMI of 30 or greater</p>
            </div>
        </div>`;
      resultDiv.innerHTML = resultHTML;
      const isGuest = !document.getElementById("logout-button");
      if (!isGuest) {
        fetch("/save-bmi-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            height_ft: heightFt,
            height_in: heightIn,
            weight_kg: weightKg,
            response_html: resultHTML,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.status !== "success")
              console.error("Failed to save BMI history:", data.message);
          })
          .catch((error) => console.error("Error saving BMI history:", error));
      }
    });
  }

  // --- History Page Search Logic ---
  const historySearchInput = document.getElementById("history-search");
  if (historySearchInput) {
    const historyItems = document.querySelectorAll(".history-item");
    const noResultsMessage = document.getElementById("no-results-message");
    historySearchInput.addEventListener("input", (e) => {
      const searchTerm = e.target.value.toLowerCase();
      let visibleCount = 0;
      historyItems.forEach((item) => {
        const toolType = item
          .querySelector(".history-tool-type")
          .textContent.toLowerCase();
        const prompt = item
          .querySelector(".history-prompt")
          .textContent.toLowerCase();
        if (toolType.includes(searchTerm) || prompt.includes(searchTerm)) {
          item.style.display = "block";
          visibleCount++;
        } else {
          item.style.display = "none";
        }
      });
      if (noResultsMessage) {
        noResultsMessage.classList.toggle("hidden", visibleCount > 0);
      }
    });
  }

  // --- History Deletion Logic ---
  const historyList = document.getElementById("history-list");
  const flashMessageDiv = document.getElementById("history-flash-message");
  const deleteAllBtn = document.getElementById("delete-all-history-btn");

  function showHistoryFlash(msg, isError = false) {
    if (!flashMessageDiv) return;
    flashMessageDiv.innerHTML = `<div class="${isError ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'} p-3 rounded-lg shadow mb-2">${msg}</div>`;
    setTimeout(() => { flashMessageDiv.innerHTML = ""; }, 3000);
  }

  if (historyList) {
    historyList.addEventListener("click", async (e) => {
      const btn = e.target.closest(".delete-history-btn");
      if (!btn) return;
      const id = btn.getAttribute("data-id");
      if (!id) return;
      if (!confirm("Are you sure you want to delete this history entry?")) return;
      btn.disabled = true;
      try {
        const res = await fetch("/delete-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.status === "success") {
          const details = btn.closest("details.history-item");
          if (details) details.remove();
          showHistoryFlash("History entry deleted.");
        } else {
          showHistoryFlash(data.message || "Delete failed.", true);
        }
      } catch (err) {
        showHistoryFlash("Error deleting entry.", true);
      } finally {
        btn.disabled = false;
      }
    });
  }

  if (deleteAllBtn) {
    deleteAllBtn.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete ALL your history? This cannot be undone.")) return;
      deleteAllBtn.disabled = true;
      try {
        const res = await fetch("/delete-all-history", { method: "POST" });
        const data = await res.json();
        if (data.status === "success") {
          document.querySelectorAll("details.history-item").forEach(el => el.remove());
          showHistoryFlash("All history deleted.");
        } else {
          showHistoryFlash(data.message || "Delete all failed.", true);
        }
      } catch (err) {
        showHistoryFlash("Error deleting all history.", true);
      } finally {
        deleteAllBtn.disabled = false;
      }
    });
  }

  // --- Blood Report Analyzer Logic ---
  const reportForm = document.getElementById("report-form");
  const reportImageInput = document.getElementById("report-image-input");
  const imagePreviewContainer = document.getElementById(
    "image-preview-container"
  );
  const imagePreview = document.getElementById("image-preview");

  if (reportImageInput) {
    reportImageInput.addEventListener("change", () => {
      const file = reportImageInput.files[0];
      if (file) {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreviewContainer.classList.remove("hidden");
            imagePreview.style.display = "block";
            // Remove any PDF preview if present
            const pdfPreview = document.getElementById("pdf-preview");
            if (pdfPreview) pdfPreview.remove();
          };
          reader.readAsDataURL(file);
        } else if (file.type === "application/pdf") {
          // Hide image preview
          imagePreview.style.display = "none";
          imagePreviewContainer.classList.remove("hidden");
          // Show PDF preview (icon + filename)
          let pdfPreview = document.getElementById("pdf-preview");
          if (!pdfPreview) {
            pdfPreview = document.createElement("div");
            pdfPreview.id = "pdf-preview";
            pdfPreview.className = "mt-2 flex flex-col items-center";
            imagePreviewContainer.appendChild(pdfPreview);
          }
          pdfPreview.innerHTML = `
            <svg class="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            <span class="mt-2 text-sm text-gray-700 dark:text-gray-200">${file.name}</span>
          `;
        } else {
          imagePreviewContainer.classList.add("hidden");
        }
      } else {
        imagePreviewContainer.classList.add("hidden");
        imagePreview.style.display = "block";
        const pdfPreview = document.getElementById("pdf-preview");
        if (pdfPreview) pdfPreview.remove();
      }
    });
  }

  function renderBloodReport(data, resultDiv) {
    if (data.error || !data.components) {
      resultDiv.innerHTML = `<p class="text-red-500">${
        data.error || "An unknown error occurred."
      }</p>`;
      return;
    }

    const tableRows = data.components
      .map((item) => {
        const status = (item.status || "Normal").toLowerCase();
        let statusClass = "";
        switch (status) {
          case "high":
            statusClass =
              "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200";
            break;
          case "low":
            statusClass =
              "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200";
            break;
          default:
            statusClass =
              "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200";
        }
        return `
            <tr class="border-b border-gray-200 dark:border-gray-700">
                <td class="py-3 px-4 font-medium text-gray-900 dark:text-white">${
                  item.name || "N/A"
                }</td>
                <td class="py-3 px-4 text-gray-700 dark:text-gray-300">${
                  item.value || "N/A"
                } ${item.unit || ""}</td>
                <td class="py-3 px-4 text-gray-700 dark:text-gray-300">${
                  item.range || "N/A"
                }</td>
                <td class="py-3 px-4">
                    <span class="px-2 py-1 font-semibold leading-tight text-xs rounded-full ${statusClass}">
                        ${item.status || "N/A"}
                    </span>
                </td>
            </tr>
        `;
      })
      .join("");

    const reportHTML = `
        <div class="space-y-6">
            <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Analysis Results</h3>
                <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" class="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Component</th>
                                <th scope="col" class="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
                                <th scope="col" class="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reference Range</th>
                                <th scope="col" class="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            ${tableRows}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Summary</h3>
                <p class="text-gray-600 dark:text-gray-300">${
                  data.summary || "No summary provided."
                }</p>
            </div>
            <div class="p-4 bg-yellow-50 dark:bg-gray-700 border-l-4 border-yellow-400 dark:border-yellow-500 rounded-r-lg">
                <h4 class="text-md font-bold text-yellow-800 dark:text-yellow-200">Disclaimer</h4>
                <p class="text-sm text-yellow-700 dark:text-yellow-300 mt-1">${
                  data.disclaimer || ""
                }</p>
            </div>
        </div>
    `;

    resultDiv.innerHTML = reportHTML;
  }

  if (reportForm) {
    reportForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const resultDiv = document.getElementById("report-result");
      const submitButton = reportForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;
      const formData = new FormData(reportForm);

      try {
        submitButton.innerHTML = "Analyzing...";
        submitButton.disabled = true;
        resultDiv.innerHTML =
          '<div class="text-center p-4 text-gray-600 dark:text-gray-300">Analyzing your report with AI... Please wait.</div>';

        const response = await fetch("/analyze-report", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        renderBloodReport(data, resultDiv);
      } catch (error) {
        console.error("Error during form submission:", error);
        resultDiv.innerHTML =
          '<p class="text-red-500">An error occurred. Please check the console for details.</p>';
      } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
      }
    });
  }
});
