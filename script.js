let diceWrap = document.querySelector(".diceRoll");
let allDie = document.querySelectorAll('.diceRoll div');
let rollNums = [0, 0, 0, 0, 0];
let heldDie = [false,false,false,false,false];
let rolls = 3;
let rollP = document.getElementById("rollsNum");

function roll() {
    if (rolls<1) {

    } else {
        rolls = rolls - 1;
        generateNums();
        setDiceNums();
    }
}

function generateNums() {
    for (let i = 0; i < rollNums.length; i++) {
        if (heldDie[i]) {
            
        } else {
            let num = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            rollNums[i] = num;
        }
        
    }
}

function setDiceNums() {
    for (let o = 0; o < rollNums.length; o++) {
        let diceNumEl = o;
        let dieEl = document.getElementById("diceP" + (o+1));
        dieEl.textContent = rollNums[o];
    }
    rollP.textContent = "rolls: " + rolls;
}

function hold(dieNum) {
    if (dieNum.textContent != "") {
        let heldDieIndex = Array.prototype.indexOf.call(allDie, dieNum);
        if (heldDie[heldDieIndex] === false) {
            heldDie[heldDieIndex].classList.add("held");
            heldDie[heldDieIndex].classList.remove("free");
            heldDie[heldDieIndex] = true;
        } else {
            heldDie[heldDieIndex] = false;
            heldDie[heldDieIndex].classList.remove("held");
            heldDie[heldDieIndex].classList.add("free");
        }
    } else {
        
    }
}