let rogue = document.querySelector('.rogue');
let warrior = document.querySelector('.warrior');
let barbarian = document.querySelector('.barbarian');
let consoleOutput = document.querySelector('.console-output');
let startBattleBtn = document.querySelector('#start-battle');
let newWeapon = document.querySelector('.new-weapon');
let multiLevelBtn = document.querySelector('.level-up-btn');
let multiLvlRogue = document.querySelector('.level-up-rogue');
let multiLvlWarrior = document.querySelector('.level-up-warrior');
let multiLvlBarbarian = document.querySelector('.level-up-barbarian');

//оружие
class Weapons {
    constructor() {
        this.Dagger = {name: 'Кинжал', dmg: 2, type: 'Колющий'};
        this.Sword = {name: 'Меч', dmg: 3, type: 'Рубящий'};
        this.Club = {name: 'Дубина', dmg: 3, type: 'Дробящий'};
        this.Axe = {name: 'Топор', dmg: 4, type: 'Рубящий'};
        this.Spear = {name: 'Копье', dmg: 3, type: 'Колющий'};
        this.LegendarySword = {name: 'Легендарный Меч', dmg: 10, type: 'Рубящий'};
    }
}
let weaponsInstance = new Weapons();

//классы персонажей
class Classes {
    constructor() {
        this.Rogue = {name: 'Разбойник', startHP: 4, startWeapon: weaponsInstance.Dagger};
        this.Warrior = {name: 'Воин', startHP: 5, startWeapon: weaponsInstance.Sword};
        this.Barbarian = {name: 'Варвар', startHP: 6, startWeapon: weaponsInstance.Club};
    }
}
let classInstance = new Classes();

//монстры
class Monsters {
    constructor() {
        this.Goblin = {name: 'Гоблин', hp: 5, dmg: 2, str: 1, agl: 1, stm: 1, special: null, drop: weaponsInstance.Dagger};
        this.Skeleton = {name: 'Скелет', hp: 10, dmg: 2, str: 2, agl: 2, stm: 1, special: 'Получает вдвое больше урона, если его бьют дробящим оружием.', drop: weaponsInstance.Club};
        this.Slime = {name: 'Слайм', hp: 8, dmg: 1, str: 3, agl: 1, stm: 2, special: 'Рубящее оружие не наносит ему урона (но урон от силы и прочих особенностей, даже "порыва к действию" воина, работает).', drop: weaponsInstance.Spear};
        this.Ghost = {name: 'Призрак', hp: 6, dmg: 3, str: 1, agl: 3, stm: 1, special: 'Есть способность "скрытая атака", как у разбойника 1-го уровня.', drop: weaponsInstance.Sword};
        this.Golem = {name: 'Голем', hp: 10, dmg: 1, str: 3, agl: 1, stm: 3, special: 'Есть способность "каменная кожа", как у Варвара 2-го уровня.', drop: weaponsInstance.Axe};
        this.Dragon = {name: 'Дракон', hp: 20, dmg: 4, str: 3, agl: 3, stm: 3, special: 'Каждый 3-й ход дышит огнём, нанося дополнительно 3 урона.', drop: weaponsInstance.LegendarySword};
    }
}
let monstersInstance = new Monsters();

//выводим сообщения в консоль
function addToConsole(message) {
    let messageEl = document.createElement('div');
    messageEl.textContent = `${message}`;
    consoleOutput.appendChild(messageEl);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

export {
    rogue, warrior, barbarian, consoleOutput, startBattleBtn, newWeapon,
    multiLevelBtn, multiLvlRogue, multiLvlBarbarian, multiLvlWarrior,
    weaponsInstance, classInstance, monstersInstance,
    addToConsole};