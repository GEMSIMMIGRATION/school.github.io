let money = 0;
let autoEarnerCost = 10;
let autoEarnerLevel = 0;

// Update display
function updateDisplay() {
  document.getElementById("money").textContent = money;
  document.getElementById("upgradeButton").textContent = `Buy Auto-Earner ($${autoEarnerCost})`;
}

// Earn money by clicking
function earnMoney() {
  money += 1;
  updateDisplay();
}

// Buy upgrade
function buyUpgrade() {
  if (money >= autoEarnerCost) {
    money -= autoEarnerCost;
    autoEarnerLevel += 1;
    autoEarnerCost = Math.floor(autoEarnerCost * 1.5); // price goes up
    updateDisplay();
  } else {
    alert("Not enough money!");
  }
}

// Passive income
setInterval(() => {
  money += autoEarnerLevel; // earn $ per second
  updateDisplay();
}, 1000);

updateDisplay();
