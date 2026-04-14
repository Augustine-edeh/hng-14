// Update the current time in milliseconds every 500ms
const timeElement = document.querySelector('[data-testid="test-user-time"]');

function updateTime() {
  timeElement.textContent = Date.now();
}

// Initial update
updateTime();

// Update every 500ms
setInterval(updateTime, 500);
