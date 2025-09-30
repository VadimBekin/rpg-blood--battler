import { monstersInstance, addToConsole } from './class.js';
import { getPlayer, incrementWinStrik, resetGame } from './player.js';

//получаем случайного монстра
function randomMonsters() {
    let monsterKey = Object.keys(monstersInstance);
    let randomKey = monsterKey[Math.floor(Math.random() * monsterKey.length)];
    return {...monstersInstance[randomKey]};
}

//проверка попадания
function hitBox(attAgl, defAgl) {
    let randomHit = Math.floor(Math.random() * (attAgl + defAgl)) + 1;
    return randomHit > defAgl;
}

//расчёт урона игрока
function playerDmg(turn, monster) {
    const player = getPlayer();
    let damage = player.weapon.dmg + player.stats.str;

    if(player.classLvl.Rogue >= 1 && player.stats.agl > monster.agl) {
        damage += 1;
        addToConsole('Скрытая атака: +1 урона');
    }
    if (player.classLvl.Rogue >=3) {
        let poisonDmg = Math.max(0, turn - 1)
        if (poisonDmg > 0) {
            damage += poisonDmg;
            addToConsole(`Яд +${poisonDmg} урона!`)
        }
    }
    if (player.classLvl.Warrior >= 1 && turn === 1) {
        damage += player.weapon.dmg;
        addToConsole('Порыв к действию: В первый ход наносит двойной урон оружием')
    }
    if (player.classLvl.Barbarian >= 1) {
        if (turn <= 3) {
            damage += 2;
            addToConsole('Ярость: +2 к урону')
        } else {
            damage -= 1;
            addToConsole('Ярость: -1 к урону')
        }
    }
    //защита монстров
    if (monster.name === 'Скелет' && player.weapon.type === 'Дробящий') {
        damage *= 2;
        addToConsole('Скелет получает двойной урон от дробящего оружия')
    }
    if (monster.name === 'Слайм' && player.weapon.type === 'Рубящий') {
        damage = player.stats.str;
        addToConsole('Рубящее оружие не наносит ему урона ')
    }
    if (monster.name === 'Голем') {
        damage -= monster.stm;
        addToConsole(`Каменная кожа голема снижает урон на ${monster.stm}`)
    }
    return Math.max(0, damage);
}

//расчёт урона монстров
function monsterDmg(turn, monster) {
    const player = getPlayer();
    let damage = monster.dmg + monster.str;
    if (monster.name === 'Призрак' && monster.agl > player.stats.agl) {
        damage += 1;
        addToConsole('Скрытая атака призрака: +1 урона')
    }
    if (monster.name === 'Дракон' && turn % 3 === 0) {
        damage += 3;
        addToConsole('Дыхание дракона: +3 урона')
    }
    if (player.classLvl.Warrior >= 2 && player.stats.str > monster.str) {
        damage -= 3;
        addToConsole('Щит воина: -3 урона')
    }
    if (player.classLvl.Barbarian >= 2) {
        damage -= player.stats.stm;
        addToConsole(`Каменная кожа варвара: -${player.stats.stm} урона`)
    }
    return Math.max(0, damage);
}

function turnPlayer(turn, monster) {
    const player = getPlayer();
    if (hitBox(player.stats.agl, monster.agl)) {
        let damage = playerDmg(turn, monster);
        monster.hp -= damage;
        addToConsole(`Вы нанесли ${damage} урона!`);
    } else {
        addToConsole('Вы промахнулись!');
    }
    addToConsole(`Здоровье ${monster.name}: ${Math.max(0, monster.hp)}`);
}

function turnMonster(turn, monster) {
    const player = getPlayer();
    if (hitBox(monster.agl, player.stats.agl)) {
        let damage = monsterDmg(turn, monster);
        player.hp -= damage;
        addToConsole(`${monster.name} нанёс вам ${damage} урона!`);
    } else {
        addToConsole(`${monster.name} промахнулся!`);
    }
    addToConsole(`Ваше здоровье: ${Math.max(0, player.hp)}`);
}

//бой
function startBattle() {
    const player = getPlayer();
    if (!player) {
        addToConsole('Создайте персонажа!');
        return;
    }

    let monster = randomMonsters();
    monster.currentHP = monster.hp;

    addToConsole(`Кровавая битва с ${monster.name}`);
    addToConsole(`Здоровье ${monster.name}: ${monster.hp}`);
    addToConsole(`Ваше здоровье: ${player.hp}`);
    showClassLvl();
    addToConsole('==============================================================');

    let turn = 1;
    let playerTurn = player.stats.agl >= monster.agl;

    addToConsole(playerTurn ? 'Первый ход за вами!' : `Первый ход за ${monster.name}!`);

    while (player.hp > 0 && monster.hp > 0) {
        addToConsole(`Ход: ${turn}`);

        if (playerTurn) {
            turnPlayer(turn, monster);
            if (monster.hp <= 0) {
                addToConsole(`Вы победили ${monster.name}!`);
                incrementWinStrik();
                player.countWins++;
                return { victory: true, monster: monster };
            }

            turnMonster(turn, monster);
            if (player.hp <= 0) {
                addToConsole(`Вы проиграли ${monster.name}!`);
                return { victory: false, monster: monster };
            }
        } else {
            turnMonster(turn, monster);
            if (player.hp <= 0) {
                addToConsole(`Вы проиграли ${monster.name}!`);
                return { victory: false, monster: monster };
            }

            turnPlayer(turn, monster);
            if (monster.hp <= 0) {
                addToConsole(`Вы победили ${monster.name}!`);
                incrementWinStrik();
                player.countWins++;
                return { victory: true, monster: monster };
            }
        }
        addToConsole('-------------------------------------');
        turn++;
    }
}
function showClassLvl() {
    const player = getPlayer();
    if (!player) return;

    const classNames = {
        Rogue: 'Разбойник',
        Warrior: 'Воин',
        Barbarian: 'Варвар'
    };
    const levels = Object.entries(player.classLvl)
        .map(([cls, lvl]) => `${classNames[cls] || cls}: уровень ${lvl}`)
        .join(', ');
    addToConsole(`Ваши классы: ${levels}`);
}

function resetBattle() {
    resetGame();
}

export {
    randomMonsters, hitBox, playerDmg, monsterDmg, turnPlayer, turnMonster,
    startBattle, resetBattle};