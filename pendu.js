console.clear();
let log = console.log

const letterInput = document.getElementById("letter");
const penduField = document.getElementById("pendu");
const chancesField = document.getElementById("chances");
const msgField = document.getElementById("message");    // Champ d'affichage des lettres dans le HTML

const mot = "Chaise"    // Variable du mot à trouver
let motArray = [];      // Tableau vide du mot
let pendu = [];         // Tableau vide de l'affichage du pendu

for(i = 0; i < mot.length; i++) {
    motArray.push(mot[i].toUpperCase())   // Conversion du mot en éléments du tableau séparé
    pendu.push("_")                       // Création de cases vide pour les lettres trouvés
    penduField.innerHTML += "_ "
}

let found = 0;      // Compteur de lettres trouvés
let chance = 7;     // Compteur de chances
let inputs = []     // Tableau des lettres déjà insérés

// Boutton entrer dans la page HTML
document.getElementById("guessButton").addEventListener("click", inputCheck);
document.getElementById("letter").addEventListener("keypress", function(key){
    if(key.keyCode == 13){
        inputCheck();
    }
})

function inputCheck () {
    let letter = letterInput.value
    if(letter.match(/[a-z]/i)){
        guessLetter(letter.toUpperCase());
    } else {
        console.error("Ce n'est pas une lettre");
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

    for(i = 0; i < motArray.length; i++) {
        if (motArray[i] == letter){
            pendu[i] = letter;
            found++
            chance++
        }
    }

    inputs.push(letter)
    chance--
    
    let stringPendu = ""    // Lettres trouvés à afficher dans le prompt
    for(i = 0; i < pendu.length; i++) {
        stringPendu = stringPendu + pendu[i] + " "  // Insertion des lettres trouvés dans le string
    }

    penduField.innerHTML = stringPendu;
    chancesField.innerHTML = `Il vous reste ${chance} essais.`
    msgField.innerHTML = ''

    
    if(found == motArray.length){
        msgField.innerHTML = 'Vous avez gagné!'
        msgField.className = "green"
        alert("Vous avez gagné!")
    } else if (chance == 0) {
        msgField.innerHTML = 'Vous avez perdu!'
        msgField.className = "red"
        alert("Vous avez perdu!")
    }
}