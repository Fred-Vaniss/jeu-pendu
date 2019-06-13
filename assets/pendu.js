console.clear();
let log = console.log

// Tableau des différents mots à trouver (un mot sera choisi aléatoirement)
// const wordTable = ["Chaise","Table","Fraise","Veau","Pain","Souris","Tartine","Hamburger","Tortue","Baguette","Ordinateur","Donjon","Tacos","Clavier","Lettre","Papier","Prince","Princesse","Complainte","Marin","Tartiflette"] 

// ID des éléments HTML
const letterInput = document.getElementById("letter");
const penduField = document.getElementById("pendu");
const chancesField = document.getElementById("chances");
const msgField = document.getElementById("message");

const inputDiv = document.getElementById("gameInputs");
const resetDiv = document.getElementById("resetInput");

let found = 0;          // Compteur de lettres trouvés
let attempt = 0;         // Compteur de chances
let inputs = []         // Tableau des lettres déjà insérés

let word = "";
let wordArray = [];     // Tableau vide du mot
let pendu = [];         // Tableau vide de l'affichage du pendu


let wordTable;

let req = new XMLHttpRequest;
req.open('get', 'assets/liste-mots.json', true);
req.send()
req.onreadystatechange = function (){
    if(req.readyState === XMLHttpRequest.DONE){
        if(req.status == 200){
            wordTable = req.response;    // On stocke les données récupérés dans une variable
            wordTable = JSON.parse(wordTable);     // On convertis son texte brut en véritable données JSON
            resetGame();
        } else {
            console.error(`Erreur ${req.status}`)
            msgField.innerHTML = `Erreur ${req.status} lors de la lecture de la liste des mots`
            msgField.style.color = "red"
            msgField.style.fontSize = "30px"

            inputDiv.style.display = "none"
        }
    }
}

// Réinitialisation
function resetGame(wordParameter = null){
    // On vide les différents champs de texte
    penduField.innerHTML = ''  
    msgField.innerHTML = ''     
    penduField.className=""     

    // On réinitialise toutes les variables
    wordArray = [];
    pendu = [];

    found = 0;
    attempt = 0;
    inputs = [];

    if (wordParameter == null){
        // On prend un mot aléatoire dans le tableau des mots
        let rand = Math.floor(Math.random() * wordTable.length)
        word = wordTable[rand]
        log(rand)
    } else {
        word = wordParameter
    }
    

    // On transpose les lettres du mot dans un tableau
    for(i = 0; i < word.length; i++) {
        wordArray.push(word[i].toUpperCase())   // Conversion du mot en éléments du tableau séparé
        if (word[i] == " "){
            pendu.push(`<span class="space"></span>` ) 
            penduField.innerHTML += `<span class="space"></span>` 
            found++
        } else if (word[i] == "-") {
            pendu.push("-") 
            penduField.innerHTML += `- ` 
            found++
        } else if (word[i] == "'") {
            pendu.push("'") 
            penduField.innerHTML += `' ` 
            found++
        } else {
            pendu.push("_")                       // Création de cases vide pour les lettres trouvés
            penduField.innerHTML += "_ "          // Cases vide dans l'affichage HTML
        }
    }

    
    inputDiv.className=''                                       // On affiche le champ de texte
    resetDiv.className='hide'                                   // On madsque le boutton "recommencer"

    // On masque chaque partie du bonhomme pendu
    for(let i = 1; i < 10; i++) {
        document.getElementsByClassName(`attempt-${i}`)[0].style.display = "none";
    }

    // Message pour le débogage
    console.log(`Le mot sélectionné est: "${word}"`)
    console.log(wordArray)
}


document.getElementById("guessButton").addEventListener("click", inputCheck);   // Le clic pour boutton
document.getElementById("letter").addEventListener("keypress", function(key){   // Boutton entrer dans la page HTML
    if(key.keyCode == 13){
        inputCheck();
    }
})

// Boutton recommencer
document.getElementById("resetButton").addEventListener("click", () => resetGame());

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
            isFound = foundLetter(i,letter)
        } else {
            switch (letter) {
                case "E":
                    switch (wordArray[i]) {
                        case "É":
                            isFound = foundLetter(i,"É");
                            break;
                        case "È":
                            isFound = foundLetter(i,"È");
                            break;
                        case "Ê":
                            isFound = foundLetter(i,"Ê");
                            break;
                    }
                    break;
                case "I":
                    switch (wordArray[i]) {
                        case "Ï":
                            isFound = foundLetter(i,"Ï");
                            break;
                        case "Î":
                            isFound = foundLetter(i,"Î");
                            break;
                    }
                case "C":
                    switch (wordArray[i]){
                        case "Ç":
                            isFound = foundLetter(i,"Ç");
                            break;
                    }
                case "O":
                    switch (wordArray[i]){
                        case "Ô":
                            isFound = foundLetter(i,"Ô");
                            break;
                        case "Ö":
                            isFound = foundLetter(i,"Ö");
                            break;
                    }
            }
        }
    }

    inputs.push(letter) // On enregistre la lettre entrée dans le tableau des lettres déjà entrée

    // Si la lettre ne figurait pas dans le mot, on retire une chance
    if (!isFound){
        attempt++
        document.getElementsByClassName(`attempt-${attempt}`)[0].style.display = 'inline'
    }
    
    let stringPendu = ""    // Lettres trouvés à afficher dans le prompt
    for(i = 0; i < pendu.length; i++) {
        stringPendu = stringPendu + pendu[i] + " "  // Insertion des lettres trouvés dans le string
    }

    penduField.innerHTML = stringPendu;
    msgField.innerHTML = ''

    // Affichage d'un message si on a gagné ou perdu
    if(found == wordArray.length){
        msgField.innerHTML = 'Vous avez gagné!'
        msgField.className = "green"
        gameOver(true);
    } else if (attempt == 9) {
        msgField.innerHTML = 'Vous avez perdu!'
        msgField.className = "red"
        gameOver(false);
    }
}

// Fonction de lettre trouvée
function foundLetter(i,letter){
    pendu[i] = letter;
    found++
    return true;
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
        penduField.innerHTML=""
        
        for(i = 0; i < pendu.length; i++) {
            if (wordArray[i] == " "){
                penduField.innerHTML += `<span class="space"></span> `
            }else if (wordArray[i] == pendu[i]){
                penduField.innerHTML += `${wordArray[i]} `
            } else {
                penduField.innerHTML += `<span class="red">${wordArray[i]}</span> `
            }
        }

        // penduField.innerHTML=stringPendu
    
    }

    if (won == "debug"){
        for(let i = 1; i < 10; i++) {
            document.getElementsByClassName(`attempt-${i}`)[0].style.display = "inline";
        }
    }
}