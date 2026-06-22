let diceWrap = document.querySelector('.diceRoll');
let allDie = document.querySelectorAll('.diceRoll div');
let rollNums = [0,0,0,0,0];
let heldDie = [false,false,false,false,false];
let rolls = 3;
let rollP = document.getElementById('rollsNum');
// when you roll and you hold, if it doesnt equal 0 (placeholder), replace it
function roll() {
    if (rolls < 1) {
        
    } else {
        rolls = rolls - 1;
        generateNums();
        setDiceNums();
    }
    
}

function generateNums() {
    for (i =0; i<rollNums.length; i++) {
        if (heldDie[i]) {
            
        } else {
            let num = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            rollNums[i] = num;
        }
            
    }
}

function setDiceNums() {
    for (o = 0; o<rollNums.length; o++) {
        let dicenumEl = o;
        let dieEl = document.getElementById("diceP" + (o + 1));
        dieEl.textContent = rollNums[o];
    }
    rollP.textContent = "rolls: " + rolls;
}

function hold(dieNum) {
    if (dieNum.textContent != "") {
        let heldDieIndex = Array.prototype.indexOf.call(allDie, dieNum);
        if (heldDie[heldDieIndex] === false) {
            allDie[heldDieIndex].classList.add('held');
            allDie[heldDieIndex].classList.remove('free');
            heldDie[heldDieIndex] = true;
        } else {
            heldDie[heldDieIndex] = false;
            allDie[heldDieIndex].classList.remove('held');
            allDie[heldDieIndex].classList.add('free');
        }
    } else {
        
    }
}
