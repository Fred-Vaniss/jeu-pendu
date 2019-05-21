console.clear();
let log = console.log

const wordTable = ["Chaise","Table","Fraise","Veau","Pain","Souris","Tartine","Burger"]    // Variable du mot à trouver
const letterInput = document.getElementById("letter");
const penduField = document.getElementById("pendu");
const chancesField = document.getElementById("chances");
const msgField = document.getElementById("message");    // Champ d'affichage des lettres dans le HTML

const inputDiv = document.getElementById("gameInputs");
const resetDiv = document.getElementById("resetInput");

let found = 0;      // Compteur de lettres trouvés
let chance = 7;     // Compteur de chances
let inputs = []     // Tableau des lettres déjà insérés

let word = "";
let wordArray = [];      // Tableau vide du mot
let pendu = [];         // Tableau vide de l'affichage du pendu

resetGame();

function resetGame(){
    penduField.innerHTML = ''
    msgField.innerHTML = ''
    penduField.className=""


    wordArray = [];
    pendu = [];

    found = 0;
    chance = 7;
    inputs = [];

    let rand = Math.floor(Math.random() * wordTable.length)
    word = wordTable[rand]
    log(rand)

    for(i = 0; i < word.length; i++) {
        wordArray.push(word[i].toUpperCase())   // Conversion du mot en éléments du tableau séparé
        pendu.push("_")                       // Création de cases vide pour les lettres trouvés
        penduField.innerHTML += "_ "
    }

    inputDiv.className=''
    resetDiv.className='hide'
    chancesField.innerHTML = `Il vous reste ${chance} essais.`
}


// Boutton entrer dans la page HTML
document.getElementById("guessButton").addEventListener("click", inputCheck);
document.getElementById("letter").addEventListener("keypress", function(key){
    if(key.keyCode == 13){
        inputCheck();
    }
})

// Boutton recommencer
document.getElementById("resetButton").addEventListener("click", resetGame);

function inputCheck () {
    let letter = letterInput.value
    if(letter.match(/[a-z]/i)){
        guessLetter(letter.toUpperCase());
    } else {
        msgField.className = 'red'
        msgField.innerHTML = "Ce n'est pas une lettre valide";
    }

    letterInput.value = ''
}

function guessLetter(letter){
    if (inputs.indexOf(letter) > -1){
        console.error('Cette lettre à déjà été inséré');
        msgField.className = 'red'
        msgField.innerHTML = 'Cette lettre à déjà été inséré';
        return;
    }

    let isFound = false;
    for(i = 0; i < wordArray.length; i++) {
        if (wordArray[i] == letter){
            pendu[i] = letter;
            found++
            isFound = true;
        }
    }

    inputs.push(letter)
    if (!isFound){
        chance--
    }
    
    let stringPendu = ""    // Lettres trouvés à afficher dans le prompt
    for(i = 0; i < pendu.length; i++) {
        stringPendu = stringPendu + pendu[i] + " "  // Insertion des lettres trouvés dans le string
    }

    penduField.innerHTML = stringPendu;
    chancesField.innerHTML = `Il vous reste ${chance} essais.`
    msgField.innerHTML = ''

    
    if(found == wordArray.length){
        msgField.innerHTML = 'Vous avez gagné!'
        msgField.className = "green"
        gameOver(true);
    } else if (chance == 0) {
        msgField.innerHTML = 'Vous avez perdu!'
        msgField.className = "red"
        gameOver(false);
    }
}

function gameOver(won){
    inputDiv.className='hide'
    resetDiv.className=''
    
    if (won == true){
        penduField.className="green";
    } else {
        let stringPendu = ""    // Lettres trouvés à afficher dans le prompt
        penduField.innerHTML=''
        for(i = 0; i < pendu.length; i++) {
            if (wordArray[i] == pendu[i]){
                penduField.innerHTML += `${wordArray[i]} `
            } else{
                penduField.innerHTML += `<span class="red">${wordArray[i]}</span> `
            }
        }
    
    }
}