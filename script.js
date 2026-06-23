let diceWrap = document.querySelector('.diceRoll');
let allDie = document.querySelectorAll('.diceRoll div');
let allScoreSingles = document.querySelectorAll('.choiceScoreP');
let rollNums = [0,0,0,0,0];
let heldDie = [false,false,false,false,false];
let answeredSingles = [false, false, false, false, false];
let rolls = 3;
let rollP = document.getElementById('rollsNum');
let choseScore = false;
// when you roll and you hold, if it doesnt equal 0 (placeholder), replace it
function roll() {
    if (rolls < 1) {
        if (choseScore === true) {
            rolls = 3;
            generateNums();
            setDiceNums();
            checkPossibleScores();
        }
    } else {
        rolls = rolls - 1;
        generateNums();
        setDiceNums();
        checkPossibleScores();
    }
    
}

function generateNums() {
    for (i =0; i<rollNums.length; i++) {
        if (heldDie[i]) {
            
        } else {
            if (answeredSingles[i] === true) {
                
            } else {
                let num = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            rollNums[i] = num;
            }
            
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
let possScores = [
    {name: 1, value: 0, num: 0},
    {name: 2, value: 0, num: 0},
    {name: 3, value: 0, num: 0},
    {name: 4, value: 0, num: 0},
    {name: 5, value: 0, num: 0},
    {name: 6, value: 0, num: 0},
];
function checkPossibleScores() {
    console.clear();
    possScores.forEach(score => {
        score.num = rollNums.filter(num => num === score.name).length;
        score.value = score.name * score.num; // gets score by multiplying the number of that die by the value of the die
        // console.log(score.value);
    });
    for (w = 0; w < possScores.length; w++) {
        let val = possScores[w].value; // sets all text content to the value of the score
        if (answeredSingles[w] != true) { // sets all text that is blue has n
            allScoreSingles[w].textContent = val;
            allScoreSingles[w].style.color = "blue";
            // make it so that when you roll again it doesnt remove the value
        } else {
            
        }
        
    }
    click();
}
function click() {
    allScoreSingles.forEach(score => {
        score.addEventListener('click', function(vali){
            if (answeredSingles[score] != true) {
                answeredSingles[score] = true;
            }
        });
    });
}