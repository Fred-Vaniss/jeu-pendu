console.clear();
let log = console.log

// Tableau des différents mots à trouver (un mot sera choisi aléatoirement)
const wordTable = ["Chaise","Table","Fraise","Veau","Pain","Souris","Tartine","Hamburger","Tortue","Baguette","Ordinateur","Donjon","Tacos","Clavier","Lettre","Papier","Prince","Princesse","Complainte","Marin","Tartiflette"]  

// ID des éléments HTML
const letterInput = document.getElementById("letter");
const penduField = document.getElementById("pendu");
const chancesField = document.getElementById("chances");
const msgField = document.getElementById("message");

const inputDiv = document.getElementById("gameInputs");
const resetDiv = document.getElementById("resetInput");

let found = 0;          // Compteur de lettres trouvés
let chance = 7;         // Compteur de chances
let inputs = []         // Tableau des lettres déjà insérés

let word = "";
let wordArray = [];     // Tableau vide du mot
let pendu = [];         // Tableau vide de l'affichage du pendu


resetGame();
// Réinitialisation
function resetGame(){
    // On vide les différents champs de texte
    penduField.innerHTML = ''  
    msgField.innerHTML = ''     
    penduField.className=""     

    // On réinitialise toutes les variables
    wordArray = [];
    pendu = [];

    found = 0;
    chance = 7;
    inputs = [];

    // On prend un mot aléatoire dans le tableau des mots
    let rand = Math.floor(Math.random() * wordTable.length)
    word = wordTable[rand]
    log(rand)

    // On transpose les lettres du mot dans un tableau
    for(i = 0; i < word.length; i++) {
        wordArray.push(word[i].toUpperCase())   // Conversion du mot en éléments du tableau séparé
        pendu.push("_")                       // Création de cases vide pour les lettres trouvés
        penduField.innerHTML += "_ "          // Cases vide dans l'affichage HTML
    }

    
    inputDiv.className=''                                       // On affiche le champ de texte
    resetDiv.className='hide'                                   // On madsque le boutton "recommencer"
    chancesField.innerHTML = `Il vous reste ${chance} essais.`  // On affiche le nombre d'essais resstant
}


document.getElementById("guessButton").addEventListener("click", inputCheck);   // Le clic pour boutton
document.getElementById("letter").addEventListener("keypress", function(key){   // Boutton entrer dans la page HTML
    if(key.keyCode == 13){
        inputCheck();
    }
})

// Boutton recommencer
document.getElementById("resetButton").addEventListener("click", resetGame);

// Fonction pour vérifier si c'est une lettre valide avant d'aller à la fonction du pendu
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
    // On vérifie d'abord si la lettre n'a pas été déjà entrée
    if (inputs.indexOf(letter) > -1){
        console.error('Cette lettre à déjà été inséré');
        msgField.className = 'red'
        msgField.innerHTML = 'Cette lettre à déjà été inséré';
        return;
    }

    // On définis une variable qui checkera si notre dernière entrée est la bonne réponse
    let isFound = false;
    for(i = 0; i < wordArray.length; i++) {
        if (wordArray[i] == letter){
            pendu[i] = letter;
            found++
            isFound = true;
        }
    }

    inputs.push(letter) // On enregistre la lettre entrée dans le tableau des lettres déjà entrée

    // Si la lettre ne figurait pas dans le mot, on retire une chance
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

    // Affichage d'un message si on a gagné ou perdu
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

// Fonction de fin de partie
function gameOver(won){
    // On masque le champ de texte et affiche le boutton recommencer
    inputDiv.className='hide'
    resetDiv.className=''
    
    // Si la partie est gagnée, on affiche le texte en vert
    if (won == true){
        penduField.className="green";
    } else { // Si la partie est perdue on affiche les lettres non trouvés en rouge
        let stringPendu = "" 
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