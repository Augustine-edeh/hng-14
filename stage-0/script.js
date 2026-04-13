const checkbox = document.getElementById("todo-checkbox");
const title = document.getElementById("todo-title");
const todoStatus = document.getElementById("status");
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
    todoStatus.textContent = "Done";
    todoStatus.className =
      "inline-block rounded-full border px-3 py-1 text-xs font-medium bg-green-100 text-green-800 border-green-300";
  } else {
    title.classList.remove("line-through", "text-gray-500");
    todoStatus.textContent = "In Progress";
    todoStatus.className =
      "inline-block rounded-full border px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 border-blue-300";
  }
});

// Buttons
document.getElementById("edit-btn").addEventListener("click", () => {
  alert("Edit button clicked.");
});

document.getElementById("delete-btn").addEventListener("click", () => {
  alert("Delete button clicked.");
});
