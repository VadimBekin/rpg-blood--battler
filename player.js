import { classInstance, addToConsole } from './class.js';

// приватные переменные
let _player = null;
let _lastBattle = null;
let _winStrik = 0;

//стартовые статы персонажа при создании
function startStats(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + 1;
}

function createRandomStats() {
    return {str: startStats(1, 3), agl: startStats(1, 3), stm: startStats(1, 3)};
}

//создание персонажа
function createPerson(classKey) {
    let stats = createRandomStats();
    let personClass = classInstance[classKey];
    _player = {
        class: classKey,
        className: personClass.name,
        classLvl: {[classKey]: 1},
        stats: stats,
        weapon: personClass.startWeapon,
        maxHP: personClass.startHP + stats.stm,
        hp: personClass.startHP + stats.stm,
        level: 1,
        countWins: 0,
    };
    _lastBattle = null;
    _winStrik = 0;
    addToConsole('Создан новый персонаж!')
    addToConsole(`Класс: ${_player.className}`)
    addToConsole(`Уровень: ${_player.level}`)
    addToConsole(`Здоровье: ${_player.hp}/${_player.maxHP}`)
    addToConsole(`Характеристики: Сила ${_player.stats.str}, Ловкость ${_player.stats.agl}, Выносливость ${_player.stats.stm}`);
    addToConsole(`Оружие: ${_player.weapon.name} (урон: ${_player.weapon.dmg}, тип урона: ${_player.weapon.type})`)
    addToConsole('==============================================================')
}

//повышаем лвл
function levelUp(className) {
    _player.level++;
    _player.classLvl[className] = (_player.classLvl[className] || 0) + 1;

    if (className === 'Rogue' && _player.classLvl.Rogue === 2) {
        _player.stats.agl++;
        addToConsole('Ловкость +1');
    } else if (className === 'Warrior' && _player.classLvl.Warrior === 3) {
        _player.stats.str++;
        addToConsole('Сила +1')
    } else if (className === 'Barbarian' && _player.classLvl.Barbarian === 3) {
        _player.stats.stm++;
        addToConsole('Выносливость +1');
    }
    let hpLvl = 0;
    if (className === 'Rogue') {
        hpLvl = 4;
    } else if (className === 'Warrior') {
        hpLvl = 5;
    } else if (className === 'Barbarian') {
        hpLvl = 6;
    }
    _player.maxHP += hpLvl;
    _player.hp = _player.maxHP;

    addToConsole(`Уровень повышен до ${_player.classLvl[className]}! Максимальное здоровье: ${_player.maxHP}`);
}

// геттеры
function getPlayer() {
    return _player;
}

function getLastBattle() {
    return _lastBattle;
}

function getWinStrik() {
    return _winStrik;
}

// сеттеры
function setLastBattle(battle) {
    _lastBattle = battle;
}

function incrementWinStrik() {
    _winStrik++;
}

function resetGame() {
    _player = null;
    _lastBattle = null;
    _winStrik = 0;
}

export {
    startStats, createRandomStats, createPerson, levelUp, getPlayer, getLastBattle,
    getWinStrik, setLastBattle, incrementWinStrik, resetGame};