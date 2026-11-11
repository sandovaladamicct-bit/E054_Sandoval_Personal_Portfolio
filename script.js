/* =========================================================
       1. MOBILE NAVIGATION
       ========================================================= */
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });

    const pageSections = document.querySelectorAll("main section[id]");
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.querySelectorAll("a").forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
          });
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    pageSections.forEach(section => sectionObserver.observe(section));

    /* =========================================================
       2. HERO PHOTO CAROUSEL
       ========================================================= */
    const track = document.getElementById("carouselTrack");
    const slides = Array.from(track.children);
    const nextButton = document.getElementById("nextPhoto");
    const prevButton = document.getElementById("prevPhoto");
    let currentIndex = 0;

    function updateSlidePosition() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    nextButton.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlidePosition();
    });

    prevButton.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlidePosition();
    });

    /* =========================================================
       3. PROJECT DEMO MODAL
       ========================================================= */
    const modal = document.getElementById("demoModal");
    const modalTitle = document.getElementById("modalTitle");
    const demoContent = document.getElementById("demoContent");
    const closeModalButton = document.getElementById("closeModal");
    let lastFocusedElement = null;

    function openModal(title, content) {
      lastFocusedElement = document.activeElement;
      modalTitle.textContent = title;
      demoContent.innerHTML = content;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeModalButton.focus();
    }

    function closeModal() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      demoContent.innerHTML = "";
      if (lastFocusedElement) lastFocusedElement.focus();
    }

    closeModalButton.addEventListener("click", closeModal);
    modal.addEventListener("click", event => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    function addTaskItem(taskText) {
      const list = document.getElementById("taskList");
      const item = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.setAttribute("aria-label", `Mark ${taskText} complete`);
      const label = document.createElement("span");
      label.textContent = taskText;
      const removeButton = document.createElement("button");
      removeButton.className = "icon-button";
      removeButton.type = "button";
      removeButton.textContent = "Delete";
      removeButton.setAttribute("aria-label", `Delete ${taskText}`);
      checkbox.addEventListener("change", () => item.classList.toggle("done", checkbox.checked));
      removeButton.addEventListener("click", () => item.remove());
      item.append(checkbox, label, removeButton);
      list.appendChild(item);
    }

    function showTaskDemo() {
      openModal("Interactive Task Tracker", `
        <p class="demo-help">Add a task, tick it when complete, or delete it when it is no longer needed.</p>
        <form class="demo-form" id="taskForm">
          <input class="demo-input" id="taskInput" maxlength="100" placeholder="e.g. Review JavaScript notes" aria-label="New task" required>
          <button class="btn small" type="submit">Add task</button>
        </form>
        <ul class="demo-list" id="taskList"></ul>
      `);
      document.getElementById("taskForm").addEventListener("submit", event => {
        event.preventDefault();
        const input = document.getElementById("taskInput");
        const value = input.value.trim();
        if (!value) return;
        addTaskItem(value);
        input.value = "";
        input.focus();
      });
      ["Plan the week", "Practice coding for 30 minutes"].forEach(addTaskItem);
    }

    function showSplitDemo() {
      openModal("Tip & Bill Split Calculator", `
        <p class="demo-help">Enter the bill amount, tip percentage, and number of people.</p>
        <form id="splitForm">
          <div class="demo-form">
            <input class="demo-input" id="billAmount" type="number" min="0" step="0.01" value="1000" placeholder="Bill amount" aria-label="Bill amount">
            <input class="demo-input" id="tipPercent" type="number" min="0" max="100" step="1" value="10" placeholder="Tip %" aria-label="Tip percentage">
            <input class="demo-input" id="peopleCount" type="number" min="1" step="1" value="2" placeholder="People" aria-label="Number of people">
          </div>
          <button class="btn small" type="submit">Calculate</button>
        </form>
        <p class="demo-summary" id="splitResult" aria-live="polite">Each person pays ₱550.00</p>
        <p class="demo-help" id="splitBreakdown">Tip: ₱100.00 · Total: ₱1,100.00</p>
      `);
      const form = document.getElementById("splitForm");
      function calculateSplit(event) {
        if (event) event.preventDefault();
        const bill = Number(document.getElementById("billAmount").value);
        const tip = Number(document.getElementById("tipPercent").value);
        const people = Number(document.getElementById("peopleCount").value);
        const result = document.getElementById("splitResult");
        const breakdown = document.getElementById("splitBreakdown");
        if (!Number.isFinite(bill) || !Number.isFinite(tip) || !Number.isInteger(people) ||
            bill < 0 || tip < 0 || tip > 100 || people < 1) {
          result.textContent = "Please enter valid values.";
          breakdown.textContent = "Bill must be 0 or more, tip 0–100%, and people at least 1.";
          return;
        }
        const tipAmount = bill * tip / 100;
        const total = bill + tipAmount;
        result.textContent = `Each person pays ₱${(total / people).toFixed(2)}`;
        breakdown.textContent = `Tip: ₱${tipAmount.toFixed(2)} · Total: ₱${total.toFixed(2)}`;
      }
      form.addEventListener("submit", calculateSplit);
      form.querySelectorAll("input").forEach(input => input.addEventListener("input", calculateSplit));
      calculateSplit();
    }

    function showExpenseDemo() {
      openModal("Simple Expense Log", `
        <p class="demo-help">Add an item and its cost. Your running total will update automatically.</p>
        <form class="demo-form" id="expenseForm">
          <input class="demo-input" id="expenseName" maxlength="80" placeholder="Item (e.g. Lunch)" aria-label="Expense item" required>
          <input class="demo-input" id="expenseCost" type="number" min="0.01" step="0.01" placeholder="Cost (₱)" aria-label="Expense cost" required>
          <button class="btn small" type="submit">Add expense</button>
        </form>
        <ul class="demo-list" id="expenseList"></ul>
        <p class="demo-summary" id="expenseTotal" aria-live="polite">Total expenses: ₱0.00</p>
      `);
      const form = document.getElementById("expenseForm");
      const list = document.getElementById("expenseList");
      const totalLabel = document.getElementById("expenseTotal");
      let total = 0;

      function updateTotal() {
        totalLabel.textContent = `Total expenses: ₱${total.toFixed(2)}`;
      }

      form.addEventListener("submit", event => {
        event.preventDefault();
        const nameInput = document.getElementById("expenseName");
        const costInput = document.getElementById("expenseCost");
        const name = nameInput.value.trim();
        const cost = Number(costInput.value);
        if (!name || !Number.isFinite(cost) || cost <= 0) return;

        const item = document.createElement("li");
        const description = document.createElement("span");
        description.textContent = `${name} — ₱${cost.toFixed(2)}`;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "icon-button";
        remove.textContent = "Delete";
        remove.setAttribute("aria-label", `Delete expense ${name}`);
        total += cost;
        remove.addEventListener("click", () => {
          total -= cost;
          item.remove();
          updateTotal();
        });
        item.append(description, remove);
        list.appendChild(item);
        updateTotal();
        nameInput.value = "";
        costInput.value = "";
        nameInput.focus();
      });
    }

    document.querySelectorAll(".open-demo").forEach(button => {
      button.addEventListener("click", () => {
        const demo = button.dataset.demo;
        if (demo === "tasks") showTaskDemo();
        if (demo === "split") showSplitDemo();
        if (demo === "expenses") showExpenseDemo();
      });
    });
