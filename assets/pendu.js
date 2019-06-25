console.clear();
let log = console.log

// Tableau des différents mots à trouver (un mot sera choisi aléatoirement)
// const wordTable = ["Chaise","Table","Fraise","Veau","Pain","Souris","Tartine","Hamburger","Tortue","Baguette","Ordinateur","Donjon","Tacos","Clavier","Lettre","Papier","Prince","Princesse","Complainte","Marin","Tartiflette"] 

// ID des éléments HTML
const letterInput = document.getElementById("letter");
const penduField = document.getElementById("pendu");
const chancesField = document.getElementById("chances");
const msgField = document.getElementById("message");
const hangGuy = document.getElementById("hang-guy")

const responsiveMenu = document.getElementsByClassName("menu")[0];
const responsiveMenuButton = document.getElementById("showRespMenu")
const resetDiv = document.getElementById("resetInput");
const keyboardDiv = document.getElementById("keyboard")
const nbWordsField = document.getElementById("nbWords");
const nbNamesField = document.getElementById("nbNames");

let found = 0;           // Compteur de lettres trouvés
let attempt = 0;         // Compteur de chances
let inputs = []          // Tableau des lettres déjà insérés

let word = "";           // Mot sélectionné vide
let wordArray = [];      // Tableau vide du mot
let pendu = [];          // Tableau vide de l'affichage du pendu
let gameIsOver = true;
let debugDisplayed = false;


let wordTable;

// Requête pour récupérer la liste des mots contenu dans assets/liste-mots.json
let req = new XMLHttpRequest;
req.open('get', 'assets/liste-mots.json', true);
req.send()
req.onreadystatechange = function (){
    if(req.readyState === XMLHttpRequest.DONE){
        if(req.status == 200){
            try{
                wordTable = req.response;                   // On stocke les données récupérés dans une variable
                wordTable = JSON.parse(wordTable);
                gameInit();
            } catch (err) {
                msgField.innerHTML = `Une erreur est survenue lors tu traitement de la liste des mots.<br/> ${err}`
                msgField.style.color = "red"
                msgField.style.fontSize = "30px"
                console.error(err)
            }
        } else {
            console.error(`Erreur ${req.status}`)
            msgField.innerHTML = `Erreur ${req.status} lors de la lecture de la liste des mots`
            msgField.style.color = "red"
            msgField.style.fontSize = "30px"
        }
    }
}

function gameInit(){
    for (let i = 0; i < wordTable.length; i++) {
        let button = document.createElement("button")
        button.className = "resetButton"
        button.textContent = `${wordTable[i].dispName} (${wordTable[i].words.length})`
        resetDiv.appendChild(button)
        button.addEventListener("click", () => {
            newGame("array", wordTable[i])
            responsiveMenu.classList.add('hideResponsiveMenu') 
        })
    }

    msgField.innerHTML = '';
    resetDiv.classList.remove("hide");

    hangGuy.style.display = "block"; 

    // On masque l'humeur du personnage
    for(let i = 4; i < 10; i++) {
        document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
    }
    document.getElementsByClassName(`mood-win`)[0].style.display = "none";
    document.getElementsByClassName(`mood-4`)[0].style.display = "inline";

    document.addEventListener("keypress", e => {
        if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122)){
            inputCheck(e.key)
        }
    })
}

// Boutton menu responsive
responsiveMenuButton.addEventListener("click", () => responsiveMenu.classList.remove("hideResponsiveMenu"))

// Fermeture menu responsive
window.addEventListener('click', e => {
    if (e.target != responsiveMenu && e.target.parentNode != responsiveMenu && e.target != responsiveMenuButton){
        responsiveMenu.classList.add('hideResponsiveMenu') 
    }
})

// Réinitialisation
function newGame(type, data){
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
    gameIsOver = false;

    if (type == "array"){
        // On prend un mot aléatoire dans le tableau des mots
        let rand = Math.floor(Math.random() * data.words.length)
        word = data.words[rand]
        log(`Mot numéro ${rand}`)
    } else { // Si on éxécute la fonction avec un argument, il récupérera cette valeur en tant que ce mot à trouver
        word = data
    }
    

    // On transpose les lettres du mot dans un tableau
    let wordGroup = document.createElement("span")
    wordGroup.className = "word-group"
    for(i = 0; i < word.length; i++) {
        wordArray.push(word[i].toUpperCase())   // Conversion du mot en éléments du tableau séparé
        if (word[i] == " "){
            pendu.push(` ` ) 
            penduField.appendChild(wordGroup)
            wordGroup = document.createElement("span")
            wordGroup.className = "word-group" 
            found++
        } else if (word[i] == "-") {
            pendu.push("-") 
            wordGroup.innerHTML += `<span id="letter-${i}">-</span> ` 
            found++
        } else if (word[i] == "'") {
            pendu.push("'") 
            wordGroup.innerHTML += `<span id="letter-${i}">'</span> ` 
            found++
        } else if (word[i] == "&") {
            pendu.push("&") 
            wordGroup.innerHTML += `<span id="letter-${i}">&</span> ` 
            found++
        } else {
            pendu.push("_")                       // Création de cases vide pour les lettres trouvés
            wordGroup.innerHTML += `<span id="letter-${i}">_</span> `          // Cases vide dans l'affichage HTML
        }
    }
    penduField.appendChild(wordGroup)

    
    // resetDiv.className='hide'                                   // On madsque le boutton "recommencer"

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
    if (debugDisplayed){
        console.log(`Le mot sélectionné est: "${word}"`)
        console.log(wordArray)
    }

    // Création des bouttons des lettres
    keyboardDiv.innerHTML = ''
    for(i = 65; i <= 90; i++) {
        let letter = String.fromCharCode(i)
        keyboardDiv.innerHTML += `<button id="${letter}" class="letter-button">${letter}</button>`
    }

    const letterButtons = document.getElementsByClassName("letter-button")
    for (const button of letterButtons) {
        button.addEventListener("click", e => {
            inputCheck(e.target.id)
        })
    }
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
        msgField.innerHTML = ''
        console.error('Cette lettre à déjà été inséré');
        msgField.className = 'red'
        msgField.innerHTML = '<span class="shake-horizontal">Cette lettre à déjà été inséré</span>';
        return;
    }

    // On définis une variable qui checkera si notre dernière entrée est la bonne réponse
    let isFound = false;
    let delay = 0
    for(i = 0; i < wordArray.length; i++) {
        if (wordArray[i] == letter){
            isFound = foundLetter(i,letter,delay)
        } else {
            // On vérifie si la réponse contiens un accens, si c'est le cas, elle sera accepté pour la lettre entrée
            switch (letter) {
                case "A":
                    isFound = specialLetterCheck(i,isFound,["Â","À"],delay)
                    break;
                case "E":
                    isFound = specialLetterCheck(i,isFound,["É","È","Ê"],delay)
                    break;
                case "I":
                    isFound = specialLetterCheck(i,isFound,["Î","Ï"],delay)
                    break;
                case "C":
                    isFound = specialLetterCheck(i,isFound,["Ç"],delay)
                    break;
                case "O":
                    isFound = specialLetterCheck(i,isFound,["Ô","Ö"],delay)
                    break;
                case "U":
                    isFound = specialLetterCheck(i,isFound,["Û","Ü"],delay)
                    break;
            }
        }
        if (typeof isFound[1] != "undefined"){
            delay = isFound[1]
        }
    }

    inputs.push(letter) // On enregistre la lettre entrée dans le tableau des lettres déjà entrée

    // Si la lettre ne figurait pas dans le mot, on retire une chance
    if (!isFound){
        attempt++
        document.getElementsByClassName(`attempt-${attempt}`)[0].style.display = 'inline' // Affichage du morceau du SVG
    }

    // On change l'humeur du personnage si sa tête apparait
    if (attempt >= 4){
        for(let i = 4; i < 10 ; i++){
            document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
        }
        document.getElementsByClassName(`mood-${attempt}`)[0].style.display = "inline";
    }


    msgField.innerHTML = ''

    let inputLetter = document.getElementById(letter)
    inputLetter.disabled = 'disabled'
    if (isFound){
        inputLetter.classList.add("green-letter-anim")
    } else {
        inputLetter.classList.add("red-letter-anim")
    }

    // Affichage d'un message si on a gagné ou perdu
    if(found == wordArray.length){
        gameOver(true);
    } else if (attempt == 9) {
        gameOver(false);
    }
}

function specialLetterCheck(i,foundState,array,delay){
    let isFound = foundState
    for(const letter of array){
        if (letter == wordArray[i]){
            isFound = foundLetter(i,letter,delay);
        }
    }
    return isFound
}

// Fonction de lettre trouvée
function foundLetter(i,letter,delay){
    pendu[i] = letter;

    let letterField = document.getElementById(`letter-${i}`)
    setTimeout(() => {
        letterField.innerText = letter;
        letterField.classList.add("found-anim")
    }, delay);
    delay += 50
    found++
    return [true,delay];
}

// Fonction de fin de partie
function gameOver(won){
    // On masque le champ de texte et affiche le boutton recommencer
    resetDiv.className=''
    gameIsOver = true
    
    // Si la partie est gagnée, on affiche le texte en vert
    if (won == true){
        msgField.innerHTML = 'Vous avez gagné!'
        msgField.className = "green"
        penduField.className="green";
        for(i = 0; i < pendu.length; i++) {
            let letter = document.getElementById(`letter-${i}`)
            if (wordArray[i] != " "){
                letter.innerHTML = `${wordArray[i]}`
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
            let letter = document.getElementById(`letter-${i}`)
            if (wordArray[i] != " "){
                letter.innerHTML = `${wordArray[i]}`
                if (wordArray[i] != pendu[i]){
                    letter.style.color = "red"
                }
                
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
            if (key.keyCode == cheatCode[cheatSeq]){
                cheatSeq++
            }
        }
        if (cheatSeq == cheatCode.length){displayDebugMenu()}
    }
})

function displayDebugMenu(){
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

    debugDisplayed = true
}

function customWord(){
    let custom = document.getElementById("custom").value
    newGame("custom",custom)
}

document.getElementById("debug-debug").addEventListener("click", debugMode)

function debugMode(){
    newGame("custom","Debug")
    msgField.innerHTML = `Mode débogage`
    resetDiv.className = ""
    gameIsOver = true

    // On masque l'humeur du personnage
    for(let i = 4; i < 10; i++) {
        document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
    }
    document.getElementsByClassName(`mood-win`)[0].style.display = "none";
    document.getElementsByClassName(`mood-4`)[0].style.display = "inline";

    for(let i = 1; i < 10; i++) {
        document.getElementsByClassName(`attempt-${i}`)[0].style.display = "inline";
    }

    penduField.innerHTML = "D E B U G"
}