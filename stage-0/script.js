const checkbox = document.getElementById("todo-checkbox");
const title = document.getElementById("todo-title");
const status = document.getElementById("status");
const dueDateEl = document.getElementById("due-date");
const timeRemainingEl = document.getElementById("time-remaining");

const dueDate = new Date();
dueDate.setDate(dueDate.getDate() + 3);

// Format date
function formatDueDate(date) {
  return (
    "Due " +
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  );
}

// Time remaining logic (your exact logic reused)
function calculateTimeRemaining(dueDate) {
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();

  const mins = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    if (Math.abs(days) > 0) return `Overdue by ${Math.abs(days)} days`;
    if (Math.abs(hours) > 0) return `Overdue by ${Math.abs(hours)} hours`;
    if (Math.abs(mins) > 0) return `Overdue by ${Math.abs(mins)} minutes`;
    return "Overdue";
  }

  if (mins === 0) return "Due now!";
  if (hours === 0) return `Due in ${mins} minutes`;
  if (days === 0) return `Due in ${hours} hours`;
  if (days === 1) return "Due tomorrow";

  return `Due in ${days} days`;
}

// Initial render
dueDateEl.textContent = formatDueDate(dueDate);
timeRemainingEl.textContent = calculateTimeRemaining(dueDate);

// Optional live update
setInterval(() => {
  timeRemainingEl.textContent = calculateTimeRemaining(dueDate);
}, 60000);

// Checkbox behavior
checkbox.addEventListener("change", (e) => {
  if (e.target.checked) {
    title.classList.add("line-through", "text-gray-500");
    status.textContent = "Done";
    status.className = "text-xs font-medium text-green-700";
  } else {
    title.classList.remove("line-through", "text-gray-500");
    status.textContent = "In Progress";
    status.className = "text-xs font-medium text-blue-700";
  }
});

// Buttons
document.getElementById("edit-btn").addEventListener("click", () => {
  alert("Edit button clicked.");
});

document.getElementById("delete-btn").addEventListener("click", () => {
  alert("Delete button clicked.");
});
