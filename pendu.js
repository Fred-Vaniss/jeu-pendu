console.clear();

let log = console.log
const mot = ["B","O","N","J","O","U","R"];
let pendu = ["_","_","_","_","_","_","_"];
let found = 0;
let chance = 7;
let stringPendu = ""

while (found != mot.length && chance > 0) {
    for(i = 0; i < pendu.length; i++) {
        stringPendu = stringPendu + mot[i] + " "
    }


    let letter = prompt(`Choisi une lettre, il te reste ${chance} essais.\n${stringPendu}`);
    console.log(letter)

    if(letter == null){
        break;
    }

    for(i = 0; i < mot.length; i++) {
        if (mot[i] == letter){
            pendu[i] = letter;
            found++
            chance++
        }
    }

    chance--
    log(pendu);
}