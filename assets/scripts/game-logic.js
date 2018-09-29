let characterSelected = false;
let enemySelected = false;
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
    } else if(!enemySelected) {
        enemy = new Character(name, health, attack, counterAttack);
        characterElement.addClass('opponent');
        characterElement.appendTo('#attacking-enemy');
        enemySelected = true;
    }
}

function attackEnemy() {
    if(!characterSelected){ 
        $('#combat-log').empty();
        printMessage("Select a character");
        return;
    } else if(!enemySelected) {
        $('#combat-log').empty();
        printMessage('Select opponent');
        return;
    }
    $("#combat-log").empty();

    
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
    playerHp.text(player.health - enemy.counterAttack);
    printMessage(enemy.name + ' deals ' + enemy.counterAttack + ' damage to ' + player.name + '.');

    if(player.health <= 0) {
        printMessage(player.name + ' is dead!');
        player.isDead = true;
    } 
}

function enemyDied() {
    enemySelected = false;
    enemy = undefined;
    $('#attacking-enemy').empty();
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

