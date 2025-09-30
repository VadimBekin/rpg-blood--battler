import {
    rogue, warrior, barbarian, startBattleBtn, newWeapon,
    multiLevelBtn, multiLvlRogue, multiLvlBarbarian, multiLvlWarrior,
    addToConsole} from './class.js';
import {
    createPerson, levelUp, getPlayer, getLastBattle, getWinStrik, setLastBattle,} from './player.js';
import { startBattle, resetBattle } from './battle.js';

let classChosen = false;

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

//подбор оружия
newWeapon.addEventListener('click', () => {
    const player = getPlayer();
    const lastBattle = getLastBattle();

    if (!lastBattle || !lastBattle.monsterDrop) {
        addToConsole('Создайте персонажа!!');
        return;
    }

    let newLut = lastBattle.monsterDrop;
    player.weapon = newLut;
    addToConsole(`Вы подобрали оружие с монстра: ${newLut.name}.`);
});

//обработка результата боя
function resultBattle(victory, monster) {
    const player = getPlayer();
    const winStrik = getWinStrik();

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
        }

        setLastBattle({
            victory: true,
            monsterDrop: monster.drop
        });

        addToConsole(`Добыча с монстра: ${monster.drop.name}. Подобрать? Ваше текущее оружие: ${player.weapon.name}.`);
    } else {
        addToConsole('Игра окончена.');
        addToConsole('Создайте нового персонажа для начала новой игры.');
        resetBattle();
    }
    addToConsole('==============================================================');
}

function showBtnMulti() {
    multiLevelBtn.style.display = 'block';
}

function hideBtnMulti() {
    multiLevelBtn.style.display = 'none';
}

//обработка клавишь мультикласса
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

// Начало битвы
startBattleBtn.addEventListener('click', () => {
    const result = startBattle();
    if (result) {
        resultBattle(result.victory, result.monster);
    }
});

