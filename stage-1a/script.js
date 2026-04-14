// State object to manage todo data
const todoState = {
  title: "Build Advanced Todo Card",
  description:
    "Create a production-quality todo card with HTML, Tailwind CSS, and vanilla JavaScript including edit mode, status control, priority indicator, expand/collapse, and time management features.",
  priority: "High",
  dueDate: "2025-12-20",
  status: "In Progress",
  isCompleted: false,
  previousState: null,
  updateInterval: null,
};

// Priority color mapping
const priorityColors = {
  High: { bg: "bg-red-500", border: "priority-high", indicator: "bg-red-500" },
  Medium: {
    bg: "bg-yellow-500",
    border: "priority-medium",
    indicator: "bg-yellow-500",
  },
  Low: {
    bg: "bg-green-500",
    border: "priority-low",
    indicator: "bg-green-500",
  },
};

// Status color mapping
const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Done: "bg-green-100 text-green-800",
};

// Get DOM elements
const todoCard = document.querySelector('[data-testid="test-todo-card"]');
const titleElement = document.querySelector('[data-testid="test-todo-title"]');
const descriptionElement = document.querySelector(
  '[data-testid="test-todo-description"]',
);
const priorityElement = document.querySelector(
  '[data-testid="test-todo-priority"]',
);
const priorityIndicator = document.querySelector(
  '[data-testid="test-todo-priority-indicator"]',
);
const statusControl = document.querySelector(
  '[data-testid="test-todo-status-control"]',
);
const statusElement = document.querySelector(
  '[data-testid="test-todo-status"]',
);
const dueDateElement = document.querySelector(
  '[data-testid="test-todo-due-date"]',
);
const timeRemainingElement = document.querySelector(
  '[data-testid="test-todo-time-remaining"]',
);
const overdueIndicator = document.querySelector(
  '[data-testid="test-todo-overdue-indicator"]',
);
const completeToggle = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);
const editButton = document.querySelector(
  '[data-testid="test-todo-edit-button"]',
);
const deleteButton = document.querySelector(
  '[data-testid="test-todo-delete-button"]',
);
const editForm = document.querySelector('[data-testid="test-todo-edit-form"]');
const editTitleInput = document.querySelector(
  '[data-testid="test-todo-edit-title-input"]',
);
const editDescriptionInput = document.querySelector(
  '[data-testid="test-todo-edit-description-input"]',
);
const editPrioritySelect = document.querySelector(
  '[data-testid="test-todo-edit-priority-select"]',
);
const editDueDateInput = document.querySelector(
  '[data-testid="test-todo-edit-due-date-input"]',
);
const saveButton = document.querySelector(
  '[data-testid="test-todo-save-button"]',
);
const cancelButton = document.querySelector(
  '[data-testid="test-todo-cancel-button"]',
);
const expandToggle = document.querySelector(
  '[data-testid="test-todo-expand-toggle"]',
);

// Calculate time remaining
function calculateTimeRemaining(dueDate) {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due - now;

  if (diff < 0) {
    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (days > 0) {
      return `Overdue by ${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
      return `Overdue by ${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
      return "Overdue";
    }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `Due in ${days} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `Due in ${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `Due in ${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return "Due soon";
  }
}

// Update time remaining display
function updateTimeRemaining() {
  if (todoState.isCompleted) {
    timeRemainingElement.textContent = "Completed";
    overdueIndicator.classList.add("hidden");
  } else {
    const timeText = calculateTimeRemaining(todoState.dueDate);
    timeRemainingElement.textContent = timeText;

    const isOverdue = timeText.includes("Overdue");
    if (isOverdue) {
      overdueIndicator.classList.remove("hidden");
      todoCard.classList.add("overdue");
    } else {
      overdueIndicator.classList.add("hidden");
      todoCard.classList.remove("overdue");
    }
  }
}

// Update UI from state
function updateUI() {
  titleElement.textContent = todoState.title;
  descriptionElement.textContent = todoState.description;
  priorityElement.textContent = todoState.priority;
  statusControl.value = todoState.status;
  statusElement.textContent = todoState.status;
  dueDateElement.textContent = `Due: ${todoState.dueDate}`;
  completeToggle.checked = todoState.isCompleted;

  // Update priority styling
  Object.keys(priorityColors).forEach((priority) => {
    todoCard.classList.remove(priorityColors[priority].border);
  });
  todoCard.classList.add(priorityColors[todoState.priority].border);
  priorityIndicator.className = `inline-block h-3 w-3 rounded-full ${priorityColors[todoState.priority].indicator}`;

  // Update status styling
  statusElement.className = `inline-block px-3 py-1 text-sm rounded-full ${statusColors[todoState.status]}`;

  // Update completed styling
  if (todoState.isCompleted) {
    todoCard.classList.add("completed");
  } else {
    todoCard.classList.remove("completed");
  }

  updateTimeRemaining();
}

// Edit mode handlers
editButton.addEventListener("click", () => {
  todoState.previousState = {
    title: todoState.title,
    description: todoState.description,
    priority: todoState.priority,
    dueDate: todoState.dueDate,
    status: todoState.status,
    isCompleted: todoState.isCompleted,
  };

  editTitleInput.value = todoState.title;
  editDescriptionInput.value = todoState.description;
  editPrioritySelect.value = todoState.priority;
  editDueDateInput.value = todoState.dueDate;

  editForm.classList.remove("hidden");
  editButton.classList.add("hidden");
  deleteButton.classList.add("hidden");
  editTitleInput.focus();
});

saveButton.addEventListener("click", (e) => {
  e.preventDefault();

  todoState.title = editTitleInput.value || todoState.title;
  todoState.description = editDescriptionInput.value || todoState.description;
  todoState.priority = editPrioritySelect.value;
  todoState.dueDate = editDueDateInput.value || todoState.dueDate;

  editForm.classList.add("hidden");
  editButton.classList.remove("hidden");
  deleteButton.classList.remove("hidden");

  updateUI();
});

cancelButton.addEventListener("click", () => {
  if (todoState.previousState) {
    todoState.title = todoState.previousState.title;
    todoState.description = todoState.previousState.description;
    todoState.priority = todoState.previousState.priority;
    todoState.dueDate = todoState.previousState.dueDate;
    todoState.status = todoState.previousState.status;
    todoState.isCompleted = todoState.previousState.isCompleted;
    todoState.previousState = null;
  }

  editForm.classList.add("hidden");
  editButton.classList.remove("hidden");
  deleteButton.classList.remove("hidden");

  updateUI();
});

// Checkbox toggle
completeToggle.addEventListener("change", () => {
  todoState.isCompleted = completeToggle.checked;

  if (todoState.isCompleted) {
    todoState.status = "Done";
    statusControl.value = "Done";
  } else {
    todoState.status = "Pending";
    statusControl.value = "Pending";
  }

  updateUI();
});

// Status control
statusControl.addEventListener("change", () => {
  todoState.status = statusControl.value;

  if (todoState.status === "Done") {
    todoState.isCompleted = true;
    completeToggle.checked = true;
  } else {
    todoState.isCompleted = false;
    completeToggle.checked = false;
  }

  updateUI();
});

// Expand/Collapse toggle
expandToggle.addEventListener("click", () => {
  const isExpanded = expandToggle.getAttribute("aria-expanded") === "true";
  expandToggle.setAttribute("aria-expanded", !isExpanded);
  expandToggle.textContent = isExpanded ? "Show Details ▼" : "Hide Details ▲";
});

// Delete button
deleteButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this todo?")) {
    todoCard.style.opacity = "0";
    todoCard.style.transform = "scale(0.95)";
    todoCard.style.transition = "all 0.3s ease";

    setTimeout(() => {
      todoCard.remove();
      clearInterval(todoState.updateInterval);
    }, 300);
  }
});

// Keyboard navigation
editForm.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cancelButton.click();
  }
});

// Initialize time updates
function startTimeUpdates() {
  updateTimeRemaining();
  todoState.updateInterval = setInterval(() => {
    updateTimeRemaining();
  }, 30000); // Update every 30 seconds
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  startTimeUpdates();
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (todoState.updateInterval) {
    clearInterval(todoState.updateInterval);
  }
});
