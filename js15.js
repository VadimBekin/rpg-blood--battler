let rogue = document.querySelector('.rogue');
let warrior = document.querySelector('.warrior');
let barbarian = document.querySelector('.barbarian');
let consoleOutput = document.querySelector('.console-output');
let startBattleBtn = document.querySelector('.start-button');
let newWeapon = document.querySelector('.new-weapon');
let multiLevelBtn = document.querySelector('.level-up-btn');
let multiLvlRogue = document.querySelector('.level-up-rogue');
let multiLvlWarrior = document.querySelector('.level-up-warrior');
let multiLvlBarbarian = document.querySelector('.level-up-barbarian');

//оружие
class Weapons {
    constructor(Dagger, Sword, Club, Axe, Spear, LegendarySword) {
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
    constructor(Rogue, Warrior, Barbarian) {
        this.Rogue = {name: 'Разбойник', startHP: 4, startWeapon: weaponsInstance.Dagger};
        this.Warrior = {name: 'Воин', startHP: 5, startWeapon: weaponsInstance.Sword};
        this.Barbarian = {name: 'Варвар', startHP: 6, startWeapon: weaponsInstance.Club};
    }
}
let classInstance = new Classes();

//монстры
class Monsters {
    constructor(Goblin, Skeleton, Slime, Ghost, Golem, Dragon) {
        this.Goblin = {name: 'Гоблин', hp: 5, dmg: 2, str: 1, agl: 1, stm: 1, special: null, drop: weaponsInstance.Dagger};
        this.Skeleton = {name: 'Скелет', hp: 10, dmg: 2, str: 2, agl: 2, stm: 1, special: 'Получает вдвое больше урона, если его бьют дробящим оружием.', drop: weaponsInstance.Club};
        this.Slime = {name: 'Слайм', hp: 8, dmg: 1, str: 3, agl: 1, stm: 2, special: 'Рубящее оружие не наносит ему урона (но урон от силы и прочих особенностей, даже "порыва к действию" воина, работает).', drop: weaponsInstance.Spear};
        this.Ghost = {name: 'Призрак', hp: 6, dmg: 3, str: 1, agl: 3, stm: 1, special: 'Есть способность "скрытая атака", как у разбойника 1-го уровня.', drop: weaponsInstance.Sword};
        this.Golem = {name: 'Голем', hp: 10, dmg: 1, str: 3, agl: 1, stm: 3, special: 'Есть способность "каменная кожа", как у Варвара 2-го уровня.', drop: weaponsInstance.Axe};
        this.Dragon = {name: 'Дракон', hp: 20, dmg: 4, str: 3, agl: 3, stm: 3, special: 'Каждый 3-й ход дышит огнём, нанося дополнительно 3 урона.', drop: weaponsInstance.LegendarySword};
    }
}
let monstersInstance = new Monsters();

//стартовые статы персонажа при создании
function startStats(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + 1;
}
function createRandomStats() {
    return {str: startStats(1, 3), agl: startStats(1, 3), stm: startStats(1, 3)};
}



//создание персонажа
let player = null;
let lastBattle = null;
let winStrik = 0;

function createPerson(classKey) {
    let stats = createRandomStats();
    let personClass = classInstance[classKey];
    player = {
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
    lastBattle = null;
    winStrik = 0;
    addToConsole('Создан новый персонаж!')
    addToConsole(`Класс: ${player.className}`)
    addToConsole(`Уровень: ${player.level}`)
    addToConsole(`Здоровье: ${player.hp}/${player.maxHP}`)
    addToConsole(`Характеристики: Сила ${player.stats.str}, Ловкость ${player.stats.agl}, Выносливость ${player.stats.stm}`);
    addToConsole(`Оружие: ${player.weapon.name} (урон: ${player.weapon.dmg}, тип урона: ${player.weapon.type})`)
    addToConsole('==============================================================')
}

//обработчики событий для кнопок класса
rogue.addEventListener('click', () => {
    createPerson('Rogue');
});

warrior.addEventListener('click', () => {
    createPerson('Warrior');
});

barbarian.addEventListener('click', () => {
    createPerson('Barbarian');
});


//выводим сообщения в консоль
function addToConsole(message) {
    let messageEl = document.createElement('div');
    messageEl.textContent = `${message}`;
    consoleOutput.appendChild(messageEl);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

//реализация боя
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

//бой
function startBattle() {
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
                winStrik++;
                player.countWins++;
                resultBattle(true, monster);
                break;
            }

            turnMonster(turn, monster);
            if (player.hp <= 0) {
                addToConsole(`Вы проиграли ${monster.name}!`);
                resultBattle(false, monster);
                break;
            }
        } else {
            turnMonster(turn, monster);
            if (player.hp <= 0) {
                addToConsole(`Вы проиграли ${monster.name}!`);
                resultBattle(false, monster);
                break;
            }

            turnPlayer(turn, monster);
            if (monster.hp <= 0) {
                addToConsole(`Вы победили ${monster.name}!`);
                winStrik++;
                player.countWins++;
                resultBattle(true, monster);
                break;

            }
        }
        addToConsole('-------------------------------------');
        turn++;
    }
}

function turnPlayer(turn, monster) {
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
    if (hitBox(monster.agl, player.stats.agl)) {
        let damage = monsterDmg(turn, monster);
        player.hp -= damage;
        addToConsole(`${monster.name} нанёс вам ${damage} урона!`);
    } else {
        addToConsole(`${monster.name} промахнулся!`);
    }
    addToConsole(`Ваше здоровье: ${Math.max(0, player.hp)}`);
}

//подбор оружия
newWeapon.addEventListener('click', () => {
    let newLut = lastBattle.monsterDrop;
    player.weapon = newLut;
    addToConsole(`Вы подобрали оружие с монстра: ${newLut.name}.`);
    if (player.level <= 3) {
        const mainClass = getMainClass();
        if (mainClass) {
            levelUp(mainClass);
        } else {
            addToConsole('Класс не выбран — невозможно повысить уровень.');
        }
    }
})
function getMainClass() {
    for (let cls in player.classLvl) {
        if (player.classLvl[cls] > 0) return cls;
    }
    return null;
}

//обработка результата боя
function resultBattle(victory, monster) {
    if (victory) {
        player.hp = player.maxHP;
        if (winStrik >= 5) {
            addToConsole('Поздравляю! Вы победили в кровавой битве!');
            addToConsole('Создайте нового персонажа для начала новой игры.');
            resetBattle();
            return;
        }
        if (player.level < 3) {
            addToConsole('Выберите класс для повышения:');
            classChosen = false;
            showBtnMulti();
            //добавить выбор класса-------------------------------------------------------------------------------
        }
        lastBattle = {
            victory: true,
            monsterDrop: monster.drop
        }
        addToConsole(`Добыча с монстра: ${monster.drop.name}. Подобрать? Ваше текущее оружие: ${player.weapon.name}.`);
    } else {
        addToConsole('Игра окончена.')
        addToConsole('Создайте нового персонажа для начала новой игры.')
        resetBattle()
    }
    addToConsole('==============================================================')
}
//сброс игры
function resetBattle() {
    player = null;
    lastBattle = null;
    winStrik = 0;
    hideBtnMulti();
}


//повышаем лвл
function levelUp(className) {
    player.level++;
    player.classLvl[className] = (player.classLvl[className] || 0) + 1;

    if (className === 'Rogue' && player.classLvl.Rogue === 2) {
        player.stats.agl++;
        addToConsole('Ловкость +1');
    } else if (className === 'Warrior' && player.classLvl.Warrior === 3) {
        player.stats.str++;
        addToConsole('Сила +1')
    } else if (className === 'Barbarian' && player.classLvl.Barbarian === 3) {
        player.stats.stm++;
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
    player.maxHP += hpLvl;
    player.hp = player.maxHP;

    addToConsole(`Уровень повышен до ${player.classLvl[className]}! Максимальное здоровье: ${player.maxHP}`);

}

startBattleBtn.addEventListener('click', startBattle);

//обработка клавишь мульткласса
let classChosen = false;
function showBtnMulti() {
    multiLevelBtn.style.display = 'block';
}
function hideBtnMulti() {
    multiLevelBtn.style.display = 'none';
}
multiLvlRogue.addEventListener('click', () => {
    if (!classChosen) {
        levelUp('Rogue');
        classChosen = true;
        hideBtnMulti();
    }
});
multiLvlWarrior.addEventListener('click', () => {
    if (!classChosen) {
        levelUp('Warrior');
        classChosen = true;
        hideBtnMulti();
    }
});
multiLvlBarbarian.addEventListener('click', () => {
    if (!classChosen) {
        levelUp('Barbarian');
        classChosen = true;
        hideBtnMulti();
    }
});
function showClassLvl() {
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