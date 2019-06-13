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

const inputDiv = document.getElementById("gameInputs");
const resetDiv = document.getElementById("resetInput");

let found = 0;           // Compteur de lettres trouvés
let attempt = 0;         // Compteur de chances
let inputs = []          // Tableau des lettres déjà insérés

let word = "";           // Mot sélectionné vide
let wordArray = [];      // Tableau vide du mot
let pendu = [];          // Tableau vide de l'affichage du pendu


let wordTable;

// Requête pour récupérer la liste des mots contenu dans assets/liste-mots.json
let req = new XMLHttpRequest;
req.open('get', 'assets/liste-mots.json', true);
req.send()
req.onreadystatechange = function (){
    if(req.readyState === XMLHttpRequest.DONE){
        if(req.status == 200){
            wordTable = req.response;                   // On stocke les données récupérés dans une variable
            wordTable = JSON.parse(wordTable);          // On convertis son texte brut en véritable données JSON
            resetGame();                                // On initialise le jeu
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
    used.innerHTML = ''         
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
        log(`Mot numéro ${rand}`)
    } else { // Si on éxécute la fonction avec un argument, il récupérera cette valeur en tant que ce mot à trouver
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

    for(let i = 4; i < 10; i++) {
        document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
    }
    document.getElementsByClassName(`mood-win`)[0].style.display = "none";

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
                    switch (wordArray[i]) {
                        case "Â":
                            isFound = foundLetter(i,"Â");
                            break;
                    }
                case "E":
                    isFound = specialLetterCheck(i,"E",["É","È","Ê"])
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
                    break;
                case "O":
                    switch (wordArray[i]){
                        case "Ô":
                            isFound = foundLetter(i,"Ô");
                            break;
                        case "Ö":
                            isFound = foundLetter(i,"Ö");
                            break;
                    }
                    break;
                case "U":
                    switch (wordArray[i]){
                        case "Û":
                            isFound = foundLetter(i,"Û");
                            break;
                        case "Ü":
                            isFound = foundLetter(i,"Ü");
                            break;
                    }
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

    for(let i = 4; i < 10 ; i++){
        document.getElementsByClassName(`mood-${i}`)[0].style.display = "none";
    }

    if (attempt >= 4){
        document.getElementsByClassName(`mood-${attempt}`)[0].style.display = "inline";
    }

    
    let stringPendu = ""    // Lettres trouvés à afficher dans le prompt
    for(i = 0; i < pendu.length; i++) {
        stringPendu = stringPendu + pendu[i] + " "  // Insertion des lettres trouvés dans le string
    }

    penduField.innerHTML = stringPendu;
    msgField.innerHTML = ''

    // Affichage d'un message si on a gagné ou perdu
    if(found == wordArray.length){
        gameOver(true);
    } else if (attempt == 9) {
        gameOver(false);
    }
}

function specialLetterCheck(i,letter,array){
    let isFound = false
    for(const l of array){
        if (l == wordArray[i]){
            isFound = foundLetter(i,l);
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
    inputDiv.className='hide'
    resetDiv.className=''
    penduField.innerHTML=""
    
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
            document.getElementById("cheatMenu").style.display = "inline"
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
    resetGame(custom)
}