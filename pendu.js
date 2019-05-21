console.clear();
let log = console.log

const mot = "Frederick"    // Variable du mot à trouver
let motArray = [];      // Tableau vide du mot
let pendu = [];         // Tableau vide de l'affichage du pendu

for(i = 0; i < mot.length; i++) {
    motArray.push(mot[i].toUpperCase())   // Conversion du mot en éléments du tableau séparé
    pendu.push("_")         // Création de cases vide pour les lettres trouvés
}

let found = 0;      // Compteur de lettres trouvés
let chance = 7;     // Compteur de chances
let inputs = []     // Tableau des lettres déjà insérés

while (found != motArray.length && chance > 0) {
    let stringPendu = ""    // Lettres trouvés à afficher dans le prompt
    for(i = 0; i < pendu.length; i++) {
        stringPendu = stringPendu + pendu[i] + " "  // Insertion des lettres trouvés dans le string
    }

    let letter = prompt(`Choisi une lettre, il te reste ${chance} essais.\n${stringPendu}`);
    console.log(letter)

    if(letter == null){
        break;      // Arret de la boucle si le boutton "annuler" à été appuyé
    }

    for(i = 0; i < motArray.length; i++) {
        if (inputs.indexOf(letter) > -1){
            console.error('Cette lettre à déjà été inséré')
            break;
        } else if (motArray[i] == letter){
            pendu[i] = letter;
            found++
            chance++
        }
    }

    inputs.push(letter)
    chance--
    log(pendu);
}

if(found == motArray.length){
    alert("Vous avez gagné!")
} else if (chance == 0) {
    alert("Vous avez perdu!")
} else {
    alert("Partie annulée")
}