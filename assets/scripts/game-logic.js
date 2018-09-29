let characterSelected = false;
let enemySelected = false;
let gameOver = false;
let damageIncrease;

let player, enemy;

$(document).ready (function() {

    $('.character-card').on('click', selectCharacter);
    $('.attack-button').on('click', attackEnemy);
});

function selectCharacter() {
    if(characterSelected && enemySelected) return;
    $("#combat-log").empty();

    let characterElement = $(this);
    let name = characterElement.data('name');
    let health = characterElement.data('health');
    let attack = characterElement.data('attack');
    let counterAttack = characterElement.data('counter-attack');
    
    if(!characterSelected) {
        player = new Character(name, health, attack, counterAttack);
        damageIncrease = player.attackDamage;
        characterElement.addClass('player');
        characterElement.appendTo($('#your-character'));
        $('#character-selection .character-card').appendTo($('#available-enemies'));
        characterSelected = true;
    } else if(!enemySelected && !characterElement.hasClass('player')) {
        enemy = new Character(name, health, attack, counterAttack);
        characterElement.addClass('opponent');
        characterElement.appendTo('#attacking-enemy');
        enemySelected = true;
    }
}

function attackEnemy() {
    $("#combat-log").empty();
    if(!characterSelected){ 
        printMessage("Select a character");
        return;
    } else if(!enemySelected) {
        printMessage('Select opponent');
        return;
    }
   

    
    let enemyHp = $('.opponent .character-hitpoints');
    enemy.health -= player.attackDamage;
    enemyHp.text(enemy.health.toString());
    printMessage(player.name + ' deals ' + player.attackDamage + ' damage to ' + enemy.name + '.')

    player.attackDamage += damageIncrease;
    if(enemy.health <= 0) {
        printMessage(enemy.name + ' is dead!');
        enemy.isDead = true;
        enemyDied();
    } 
    else enemyCounterAttack();
}

function enemyCounterAttack() {
    let playerHp = $('.player .character-hitpoints');
    player.health -= enemy.counterAttack;
    playerHp.text(player.health);
    printMessage(enemy.name + ' counterattacks for ' + enemy.counterAttack + ' damage to ' + player.name + '.');

    if(player.health <= 0) {
        printMessage(player.name + ' is dead!');
        player.isDead = true;
        playerDied();
    } 
}

function playerDied() {
    printMessage('Game Over!');
    printMessage('Select a new character.');
    resetGame();
}

function enemyDied() {
    enemySelected = false;
    enemy = undefined;
    $('#attacking-enemy .opponent').appendTo($('#defeated-enemies'));
    $('#defeated-enemies .opponent').removeClass('opponent');

    checkWinCondition();
}

function checkWinCondition() {
    if($('#available-enemies .character-card').length === 0) {
        printMessage("You win!");
        resetGame();
    }
}

function resetGame() {
    characterSelected = false;
    enemySelected = false;
    $('#your-character .character-card').removeClass('player');
    $('#your-character .character-card').appendTo('#character-selection');
    $('#attacking-enemy .character-card').removeClass('opponent');
    $('#attacking-enemy .character-card').appendTo('#character-selection');
    $('#defeated-enemies .character-card').appendTo('#character-selection');
    $('#available-enemies .character-card').appendTo('#character-selection');
    //find a way to reset character health
    let characters = $('#character-selection .character-card')
    characters.each((i, e) => {
        jQuery(characters[i]).children('.character-hitpoints').text(jQuery(characters[i]).data('health'));
    });
        
}

function printMessage(message) {
    let logString = $('<p>');
    logString.text(message);
    logString.appendTo($('#combat-log'));
}

/*
Character Data
*/

function Character(name, health, attack, counterAttack) {
    this.name = name;
    this.health = parseInt(health);
    this.attackDamage = parseInt(attack);
    this.counterAttack = parseInt(counterAttack);
    this.isDead = false;
}

