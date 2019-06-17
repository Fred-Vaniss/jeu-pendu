console.clear();
let log = console.log

// Tableau des différents mots à trouver (un mot sera choisi aléatoirement)
// const wordTable = ["Chaise","Table","Fraise","Veau","Pain","Souris","Tartine","Hamburger","Tortue","Baguette","Ordinateur","Donjon","Tacos","Clavier","Lettre","Papier","Prince","Princesse","Complainte","Marin","Tartiflette"] 

// ID des éléments HTML
const letterInput = document.getElementById("letter");
const penduField = document.getElementById("pendu");
const chancesField = document.getElementById("chances");
const msgField = document.getElementById("message");
const used = document.getElementById("used")
const hangGuy = document.getElementById("hang-guy")

const resetDiv = document.getElementById("resetInput");
const lettersDiv = document.getElementById("letters")
const nbWordsField = document.getElementById("nbWords");
const nbNamesField = document.getElementById("nbNames");

let found = 0;           // Compteur de lettres trouvés
let attempt = 0;         // Compteur de chances
let inputs = []          // Tableau des lettres déjà insérés

let word = "";           // Mot sélectionné vide
let wordArray = [];      // Tableau vide du mot
let pendu = [];          // Tableau vide de l'affichage du pendu
let gameIsOver = true;


let wordTable;

// Requête pour récupérer la liste des mots contenu dans assets/liste-mots.json
let req = new XMLHttpRequest;
req.open('get', 'assets/liste-mots.json', true);
req.send()
req.onreadystatechange = function (){
    if(req.readyState === XMLHttpRequest.DONE){
        if(req.status == 200){
            wordTable = req.response;                   // On stocke les données récupérés dans une variable
            wordTable = JSON.parse(wordTable);
            gameInit();
        } else {
            console.error(`Erreur ${req.status}`)
            msgField.innerHTML = `Erreur ${req.status} lors de la lecture de la liste des mots`
            msgField.style.color = "red"
            msgField.style.fontSize = "30px"

        }
    }
}

function gameInit(){
    nbWordsField.innerText = wordTable.words.length;
    nbNamesField.innerText = wordTable.names.length;

    msgField.innerHTML = '';
    resetDiv.classList.remove("hide");

    hangGuy.style.display = "block"; 

    // On masque l'humeur du personnage
    for(let i = 4; i < 10; i++) {
        document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
    }
    document.getElementsByClassName(`mood-win`)[0].style.display = "none";
    document.getElementsByClassName(`mood-4`)[0].style.display = "inline";
}

// Boutton recommencer
for (const button of document.getElementsByClassName("resetButton")) {
    button.addEventListener("click", () => newGame("array", button.getAttribute("data-object")));
}

// Réinitialisation
function newGame(type, data){
    // On vide les différents champs de texte
    penduField.innerHTML = ''   
    msgField.innerHTML = ''     
    used.innerHTML = ''         
    penduField.className=""     

    // On réinitialise toutes les variables
    wordArray = [];
    pendu = [];

    found = 0;
    attempt = 0;
    inputs = [];
    gameIsOver = false;

    if (type == "array"){
        // On prend un mot aléatoire dans le tableau des mots
        let rand = Math.floor(Math.random() * wordTable[data].length)
        word = wordTable[data][rand]
        log(`Mot numéro ${rand}`)
    } else { // Si on éxécute la fonction avec un argument, il récupérera cette valeur en tant que ce mot à trouver
        word = data
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

    
    resetDiv.className='hide'                                   // On madsque le boutton "recommencer"

    // On masque chaque partie du bonhomme pendu
    for(let i = 1; i < 10; i++) {
        document.getElementsByClassName(`attempt-${i}`)[0].style.display = "none";
    }

    // On masque l'humeur du personnage
    for(let i = 4; i < 10; i++) {
        document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
    }
    document.getElementsByClassName(`mood-win`)[0].style.display = "none";

    // Message pour le débogage
    console.log(`Le mot sélectionné est: "${word}"`)
    console.log(wordArray)

    // Création des bouttons des lettres
    lettersDiv.innerHTML = ''
    for(i = 65; i <= 90; i++) {
        let letter = String.fromCharCode(i)
        lettersDiv.innerHTML += `<button id="${letter}" class="letter-button">${letter}</button>`
    }

    const letterButtons = document.getElementsByClassName("letter-button")
    for (const button of letterButtons) {
        button.addEventListener("click", e => {
            inputCheck(e.target.id)
        })
    }

    document.addEventListener("keypress", e => inputCheck(e.key))
}

// Fonction pour vérifier si c'est une lettre valide avant d'aller à la fonction du pendu
function inputCheck (value) {
    if(!gameIsOver){
        if(value.match(/[a-z]/i)){
            guessLetter(value.toUpperCase());
        } else {
            msgField.className = 'red'
            msgField.innerHTML = "Ce n'est pas une lettre valide";
        }
    }
}

// Fonction de vérification de la lettre entrée
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
            // On vérifie si la réponse contiens un accens, si c'est le cas, elle sera accepté pour la lettre entrée
            switch (letter) {
                case "A":
                    isFound = specialLetterCheck(i,isFound,["Â","À"])
                    break;
                case "E":
                    isFound = specialLetterCheck(i,isFound,["É","È","Ê"])
                    break;
                case "I":
                    isFound = specialLetterCheck(i,isFound,["Î","Ï"])
                    break;
                case "C":
                    isFound = specialLetterCheck(i,isFound,["Ç"])
                    break;
                case "O":
                    isFound = specialLetterCheck(i,isFound,["Ô","Ö"])
                    break;
                case "U":
                    isFound = specialLetterCheck(i,isFound,["Û","Ü"])
                    break;
            }
        }
    }

    inputs.push(letter) // On enregistre la lettre entrée dans le tableau des lettres déjà entrée

    // Si la lettre ne figurait pas dans le mot, on retire une chance
    if (!isFound){
        attempt++
        document.getElementsByClassName(`attempt-${attempt}`)[0].style.display = 'inline' // Affichage du morceau du SVG
        used.innerHTML += `${letter} ` // Ajout de la lettre en dessous du bonhomme
    }

    // On change l'humeur du personnage si sa tête apparait
    if (attempt >= 4){
        for(let i = 4; i < 10 ; i++){
            document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
        }
        document.getElementsByClassName(`mood-${attempt}`)[0].style.display = "inline";
    }

    
    let stringPendu = ""    // Lettres trouvés à afficher dans le prompt
    for(i = 0; i < pendu.length; i++) {
        stringPendu = stringPendu + pendu[i] + " "  // Insertion des lettres trouvés dans le string
    }

    penduField.innerHTML = stringPendu;
    msgField.innerHTML = ''

    let inputLetter = document.getElementById(letter);
    inputLetter.style.color = "gray"
    inputLetter.style.border = "2px solid gray"
    inputLetter.disabled = 'disabled'

    // Affichage d'un message si on a gagné ou perdu
    if(found == wordArray.length){
        gameOver(true);
    } else if (attempt == 9) {
        gameOver(false);
    }
}

function specialLetterCheck(i,foundState,array){
    let isFound = foundState
    for(const letter of array){
        if (letter == wordArray[i]){
            isFound = foundLetter(i,letter);
        }
    }
    return isFound
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
    resetDiv.className=''
    penduField.innerHTML=""
    gameIsOver = true
    
    // Si la partie est gagnée, on affiche le texte en vert
    if (won == true){
        msgField.innerHTML = 'Vous avez gagné!'
        msgField.className = "green"
        penduField.className="green";
        for(i = 0; i < pendu.length; i++) {
            if (wordArray[i] == " "){
                penduField.innerHTML += `<span class="space"></span> `
            } else {
                penduField.innerHTML += `${wordArray[i]} `
            }
        }
        if (attempt >= 4){
            for(let i = 4; i < 10 ; i++){
                document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
            }
            document.getElementsByClassName(`mood-win`)[0].style.display = "inline";
        }
    } else { // Si la partie est perdue on affiche les lettres non trouvés en rouge        
        msgField.innerHTML = 'Vous avez perdu!'
        msgField.className = "red"
        for(i = 0; i < pendu.length; i++) {
            if (wordArray[i] == " "){
                penduField.innerHTML += `<span class="space"></span> `
            }else if (wordArray[i] == pendu[i]){
                penduField.innerHTML += `${wordArray[i]} `
            } else {
                penduField.innerHTML += `<span class="red">${wordArray[i]}</span> `
            }
        }    
        for(let i = 4; i < 10 ; i++){
            document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
        }
        document.getElementsByClassName(`mood-9`)[0].style.display = "inline";
    }

    if (won == "debug-lose"){
        for(let i = 1; i < 10; i++) {
            document.getElementsByClassName(`attempt-${i}`)[0].style.display = "inline";
        }
    }
}

// Code de triche pour afficher le menu de débogage caché
const cheatCode = [37,39,38,40,38,37,39]
let cheatSeq = 0
let cheatActivated = false

document.addEventListener("keydown", key => {
    if (!cheatActivated){
        if (key.keyCode == cheatCode[cheatSeq]){
            cheatSeq++
        } else {
            cheatSeq = 0
        }
    
    
        if (cheatSeq == cheatCode.length){
            document.getElementById("cheatMenu").style.display = "block"
            console.log("cheat activated!")
            cheatActivated = true;
    
            document.getElementById("debug-win").addEventListener("click", () => gameOver(true))
            document.getElementById("debug-lose").addEventListener("click", () => gameOver("debug-lose"))
            
            document.getElementById("custom").addEventListener("keypress", key => {   // Boutton entrer dans la page HTML
                if(key.keyCode == 13){
                    customWord();
                }
            })
            
            document.getElementById("debug-custom").addEventListener("click", () => customWord())

            
        }
    }
})

function customWord(){
    let custom = document.getElementById("custom").value
    newGame("custom",custom)
}