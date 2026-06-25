let diceWrap = document.querySelector('.diceRoll');
let allDie = document.querySelectorAll('.diceRoll div');
let allScoreSingles = document.querySelectorAll('.choiceScoreP'); // Needs exactly 13 elements
let rollP = document.getElementById('rollsNum');

// Scoreboard UI Elements
let upperBonusP = document.getElementById('upperBonusDisplay');
let grandTotalP = document.getElementById('grandTotalDisplay');

// Game state variables
let rollNums = [0, 0, 0, 0, 0]; // Current dice values
let heldDie = [false, false, false, false, false];
let rolls = 3;
let choseScore = false; 

// Track locked states and final values for all 13 categories
let answeredSingles = Array(13).fill(false);
let answeredScores = Array(13).fill(0);
let totalYahtzeeBonuses = 0; // Tracks extra 100-point chips

// Full standard Yahtzee scorecard configuration
let possScores = [
  { name: "Ones", value: 0 },
  { name: "Twos", value: 0 },
  { name: "Threes", value: 0 },
  { name: "Fours", value: 0 },
  { name: "Fives", value: 0 },
  { name: "Sixes", value: 0 },
  { name: "Three of a Kind", value: 0 },
  { name: "Four of a Kind", value: 0 },
  { name: "Full House", value: 0 },
  { name: "Small Straight", value: 0 },
  { name: "Large Straight", value: 0 },
  { name: "Chance", value: 0 },
  { name: "Yahtzee", value: 0 }
];

// Initialize event listeners ONCE on page load
setupClickListeners();
calculateTotals(); // Set initial zeros on load

function roll() {
  if (rolls < 1) {
    if (choseScore) {
      resetTurn();
      roll(); 
    }
    return;
  }

  rolls--;
  choseScore = false; 
  generateNums();
  setDiceNums();
  checkPossibleScores();
}

function generateNums() {
  for (let i = 0; i < rollNums.length; i++) {
    if (!heldDie[i]) {
      rollNums[i] = Math.floor(Math.random() * 6) + 1;
    }
  }
}

function setDiceNums() {
  for (let o = 0; o < rollNums.length; o++) {
    let dieEl = document.getElementById("diceP" + (o + 1));
    if (dieEl) dieEl.textContent = rollNums[o];
  }
  rollP.textContent = "rolls: " + rolls;
}

function hold(dieNum) {
  if (dieNum.textContent === "" || rollNums.every(n => n === 0)) return;

  let heldDieIndex = Array.prototype.indexOf.call(allDie, dieNum);
  
  if (!heldDie[heldDieIndex]) {
    allDie[heldDieIndex].classList.add('held');
    allDie[heldDieIndex].classList.remove('free');
    heldDie[heldDieIndex] = true;
  } else {
    heldDie[heldDieIndex] = false;
    allDie[heldDieIndex].classList.remove('held');
    allDie[heldDieIndex].classList.add('free');
  }
}

function checkPossibleScores() {
  const counts = Array(7).fill(0);
  rollNums.forEach(num => counts[num]++);
  
  const totalSum = rollNums.reduce((sum, val) => sum + val, 0);

  const hasThreeOfAKind = counts.some(c => c >= 3);
  const hasFourOfAKind = counts.some(c => c >= 4);
  const hasFullHouse = counts.some(c => c === 3) && counts.some(c => c === 2);
  const isYahtzee = counts.some(c => c === 5);

  const uniqueSortedStr = [...new Set(rollNums)].sort().join("");

  possScores.forEach((score, index) => {
    // If the category is already chosen, keep its locked score black and skip math
    if (answeredSingles[index]) {
      allScoreSingles[index].textContent = answeredScores[index];
      allScoreSingles[index].style.color = "black";
      return; 
    }

    let val = 0;

    switch(index) {
      case 0: case 1: case 2: case 3: case 4: case 5:
        val = counts[index + 1] * (index + 1);
        break;
      case 6: 
        val = hasThreeOfAKind ? totalSum : 0;
        break;
      case 7: 
        val = hasFourOfAKind ? totalSum : 0;
        break;
      case 8: 
        val = hasFullHouse ? 25 : 0;
        break;
      case 9: 
        const isSmall = uniqueSortedStr.includes("1234") || uniqueSortedStr.includes("2345") || uniqueSortedStr.includes("3456");
        val = isSmall ? 30 : 0;
        break;
      case 10: 
        const isLarge = uniqueSortedStr === "12345" || uniqueSortedStr === "23456";
        val = isLarge ? 40 : 0;
        break;
      case 11: 
        val = totalSum;
        break;
      case 12: 
        val = isYahtzee ? 50 : 0;
        break;
    }

    score.value = val;
    allScoreSingles[index].textContent = val;
    allScoreSingles[index].style.color = "blue"; // Show previews in blue
  });
}

function setupClickListeners() {
  allScoreSingles.forEach((scoreElement, index) => {
    scoreElement.addEventListener('click', function() {
      if (!answeredSingles[index] && !rollNums.every(n => n === 0)) {
        
        // --- MULTIPLE YAHTZEE BONUS CHECK ---
        const counts = Array(7).fill(0);
        rollNums.forEach(num => counts[num]++);
        const rolledYahtzee = counts.some(c => c === 5);

        if (rolledYahtzee && answeredSingles[12] && answeredScores[12] === 50) {
          totalYahtzeeBonuses += 100;
          alert("🎉 Multiple Yahtzee Bonus! +100 points!");
        }

        // Lock choice
        answeredSingles[index] = true;
        answeredScores[index] = possScores[index].value;
        choseScore = true;

        // Clear out non-selected dynamic preview values
        allScoreSingles.forEach((otherScore, otherIndex) => {
          if (!answeredSingles[otherIndex]) {
            otherScore.textContent = "";
          }
        });

        // Save selected score and make it black
        allScoreSingles[index].textContent = answeredScores[index];
        allScoreSingles[index].style.color = "black";
        
        // Update math score layout
        calculateTotals();
        
        rollP.textContent = "Click Roll to Start Next Turn";
        checkGameOver();
      }
    });
  });
}

function calculateTotals() {
  // 1. Sum up Upper Section (Indices 0 through 5)
  let upperSum = 0;
  for (let i = 0; i <= 5; i++) {
    upperSum += answeredScores[i];
  }

  // 2. Check for 35 point validation
  let upperBonus = 0;
  if (upperSum >= 63) {
    upperBonus = 35;
  }
  
  if (upperBonusP) {
    upperBonusP.textContent = `Upper Bonus: ${upperBonus} (${upperSum}/63)`;
    upperBonusP.style.color = "black";
  }

  // 3. Sum up Lower Section (Indices 6 through 12)
  let lowerSum = 0;
  for (let i = 6; i <= 12; i++) {
    lowerSum += answeredScores[i];
  }

  // 4. Combine everything for Grand Total
  let grandTotal = upperSum + upperBonus + lowerSum + totalYahtzeeBonuses;
  
  if (grandTotalP) {
    grandTotalP.textContent = `Grand Total: ${grandTotal}`;
    grandTotalP.style.color = "black";
  }
}

function checkGameOver() {
  const isOver = answeredSingles.every(status => status === true);
  if (isOver) {
    rollP.textContent = "Game Over!";
    setTimeout(() => {
      alert("Game Complete! Final Score calculated in Grand Total.");
    }, 300);
  }
}

function resetTurn() {
  rolls = 3;
  rollNums = [0, 0, 0, 0, 0];
  heldDie = [false, false, false, false, false];
  
  allDie.forEach(die => {
    die.classList.remove('held');
    die.classList.add('free');
  });
}
