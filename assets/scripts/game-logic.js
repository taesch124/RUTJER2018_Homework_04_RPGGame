let characterSelected = false;
let enemySelected = false;
let gameOver = false;
let damageIncrease;
var characters;

let player, enemy;

$(document).ready (function() {
    characters = [arthas, jaina, thrall, illidan];
    for(let i = 0; i < characters.length; i++) {
        generateCharacterCard(characters[i]).appendTo('#character-selection');
    }

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
        player = findCharacterFromArray(characters, characterElement.attr('id'));
        player.attackDamage = player.startingAttackDamage;
        damageIncrease = player.attackDamage;
        characterElement.addClass('player');
        characterElement.appendTo($('#your-character'));
        $('#character-selection .character-card').appendTo($('#available-enemies'));
        characterSelected = true;
    } else if(!enemySelected && !characterElement.hasClass('player')) {
        enemy = findCharacterFromArray(characters, characterElement.attr('id'));
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
    printEndGameMessage('Game Over!');
    switchAttackButton(true);
}

function enemyDied() {
    enemySelected = false;
    enemy = undefined;
    $('#attacking-enemy .opponent').appendTo($('#defeated-enemies'));
    $('#defeated-enemies .opponent').removeClass('opponent');

    checkWinCondition();
}

function switchAttackButton(gameOver) {
    $('#attack').off('click');
    if(gameOver) {
        $('#attack').text('Start Over');
        $('#attack').on('click', function() {
            resetGame();
        });
    } else {
        $('#attack').text('Attack');
        $('#attack').on('click', attackEnemy);
    }
   
}

function checkWinCondition() {
    if($('#available-enemies .character-card').length === 0) {
        printEndGameMessage("You win!");
        switchAttackButton(true);
    }
}

function resetGame() {
    characterSelected = false;
    enemySelected = false;
    switchAttackButton(false);
    $('#combat-log').empty();
    $('#your-character .character-card').removeClass('player');
    $('#your-character .character-card').appendTo('#character-selection');
    $('#attacking-enemy .character-card').removeClass('opponent');
    $('#attacking-enemy .character-card').appendTo('#character-selection');
    $('#defeated-enemies .character-card').appendTo('#character-selection');
    $('#available-enemies .character-card').appendTo('#character-selection');
    //TODO - find a way to reset character health
    let characterCards = $('#character-selection .character-card')
    characterCards.each((i, e) => {
        let current = findCharacterFromArray(characters, jQuery(characterCards[i]).attr('id'));
        current.health = current.startingHealth;
        jQuery(characterCards[i]).children('.character-hitpoints').text(current.startingHealth);
    });
        
}

function printEndGameMessage(message) {
    let logString = $('<p id="end-game">');
    logString.text(message);
    logString.appendTo($('#combat-log'));
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

function findCharacterFromArray(characters, id) {
    return characters.find(x => x.id === id);
}

function generateCharacterCard(character) {
    let card = $('<div>');
    card.attr('id', character.id);
    card.addClass('character-card');
    if(character.horde) card.addClass('horde');
    else card.addClass('alliance');

    let name = $('<h3>');
    name.addClass('character-name');
    name.text(character.name);

    let portrait = $('<img>');
    portrait.addClass('character-portrait');
    portrait.attr('src', character.src);
    portrait.attr('alt', character.name + '\'s character portrait.');

    let health = $('<h4>');
    health.addClass('character-hitpoints');
    health.text(character.health);

    name.appendTo(card);
    portrait.appendTo(card);
    health.appendTo(card);

    return card;
}

var arthas = {
    id: 'arthas',
    name: "Arthas Menethil",
    startingHealth: 200,
    health: 200,
    startingAttackDamage: 6,
    attackDamage: 6,
    counterAttack: 12,
    isDead: false,
    src: './assets/images/characters/arthas-portrait.jpg',
    horde: true
}

var jaina = {
    id: 'jaina',
    name: "Jaina Proudmoore",
    startingHealth: 140,
    health: 140,
    startingAttackDamage: 9,
    attackDamage: 9,
    counterAttack: 25,
    isDead: false,
    src: './assets/images/characters/jaina-proudmoore-portrait.jpg',
    horde: false
}

var thrall = {
    id: 'thrall',
    name: "Thrall",
    startingHealth: 150,
    health: 150,
    startingAttackDamage: 8,
    attackDamage: 8,
    counterAttack: 21,
    isDead: false,
    src: './assets/images/characters/thrall-portrait.jpg',
    horde: true
}

var illidan = {
    id: 'illidan',
    name: "Illidan Stormrage",
    startingHealth: 160,
    health: 160,
    startingAttackDamage: 7,
    attackDamage: 7,
    counterAttack: 16,
    isDead: false,
    src: './assets/images/characters/illidan-portrait.jpg',
    horde: false
}