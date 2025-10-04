import { GameState } from './GameState.js';
import { WeaponFactory } from './Weapon.js';
import { MonsterFactory } from './Monster.js';
import { Battle } from './Battle.js';
import { Console } from './Console.js';

class Game {
    constructor() {
        //создание игровых объектов
        this.weapons = WeaponFactory.createWeapons();
        this.monsters = MonsterFactory.createMonsters(this.weapons);
        this.classes = {
            Rogue: { name: 'Разбойник', startHP: 4, startWeapon: this.weapons.Dagger },
            Warrior: { name: 'Воин', startHP: 5, startWeapon: this.weapons.Sword },
            Barbarian: { name: 'Варвар', startHP: 6, startWeapon: this.weapons.Club }
        };
        //создание игры, вывод сообщения, текущий противник
        this.gameState = new GameState();
        this.console = new Console(document.querySelector('.console-output'));
        this.currentMonster = null;
        this.isBattleInProgress = false; // флаг для отслеживания состояния боя

        this.initializeElements(); //селекторы
        this.bindEvents(); //обработчик событий
    }
    //кнопки интерфейс
    initializeElements() {
        this.rogueBtn = document.querySelector('.rogue');
        this.warriorBtn = document.querySelector('.warrior');
        this.barbarianBtn = document.querySelector('.barbarian');
        this.startBattleBtn = document.querySelector('#start-battle');
        this.multiLevelBtn = document.querySelector('.level-up-btn');
        this.multiLvlRogue = document.querySelector('.level-up-rogue');
        this.multiLvlWarrior = document.querySelector('.level-up-warrior');
        this.multiLvlBarbarian = document.querySelector('.level-up-barbarian');
    }
    //обработчики событий по кнопкам
    bindEvents() {
        this.rogueBtn.addEventListener('click', () => this.createCharacter('Rogue'));
        this.warriorBtn.addEventListener('click', () => this.createCharacter('Warrior'));
        this.barbarianBtn.addEventListener('click', () => this.createCharacter('Barbarian'));
        this.startBattleBtn.addEventListener('click', () => this.startBattle());
        this.multiLvlRogue.addEventListener('click', () => this.levelUp('Rogue'));
        this.multiLvlWarrior.addEventListener('click', () => this.levelUp('Warrior'));
        this.multiLvlBarbarian.addEventListener('click', () => this.levelUp('Barbarian'));
    }
    //создание персонажа
    createCharacter(className) {
        const classConfig = this.classes[className];
        const player = this.gameState.createCharacter(
            className,
            classConfig.startHP,
            classConfig.startWeapon
        );
        //выводим в консоль
        this.console.clear();
        this.console.addMessage(`Создан новый персонаж: ${classConfig.name}`);
        this.console.addMessage(`Уровень: ${player.level}`);
        this.console.addMessage(`Здоровье: ${player.hp}/${player.maxHp}`);
        this.console.addMessage(`Характеристики: Сила ${player.stats.str}, Ловкость ${player.stats.agl}, Выносливость ${player.stats.stm}`);
        this.console.addMessage(`Оружие: ${player.weapon.name} (урон: ${player.weapon.dmg}, тип: ${player.weapon.type})`);
        this.console.addMessage('==============================================================');

        // сбрасываем состояние боя при создании нового персонажа
        this.isBattleInProgress = false;
        this.multiLevelBtn.style.display = 'none';
    }

    startBattle() {
        // если бой уже идет, не начинаем новый
        if (this.isBattleInProgress) {
            return;
        }

        const player = this.gameState.player;
        if (!player) {
            this.console.addMessage('Создайте персонажа!');
            return;
        }

        this.isBattleInProgress = true;
        this.currentMonster = this.getRandomMonster();
        this.console.addMessage(`Кровавая битва с ${this.currentMonster.name}`);
        this.console.addMessage(`Здоровье ${this.currentMonster.name}: ${this.currentMonster.hp}`);
        this.console.addMessage(`Ваше здоровье: ${player.hp}`);
        this.showClassLevels();
        this.console.addMessage('==============================================================');

        this.executeBattle(player, this.currentMonster);
    }
    //генерируем рандомного монстра
    getRandomMonster() {
        const monsterKeys = Object.keys(this.monsters);
        const randomKey = monsterKeys[Math.floor(Math.random() * monsterKeys.length)];
        return { ...this.monsters[randomKey] };
    }
    //запускаем основной цикл игры
    executeBattle(player, monster) {
        let turn = 1;
        const playerTurn = player.stats.agl >= monster.agl; //кто первый ходит игрок или монстр

        this.console.addMessage(playerTurn ? 'Первый ход за вами!' : `Первый ход за ${monster.name}!`);

        const battleLoop = () => {
            // проверяем, не закончился ли бой
            if (player.hp <= 0 || monster.hp <= 0) {
                if (player.hp <= 0) {
                    this.handleDefeat(monster);
                } else {
                    this.handleVictory(player, monster);
                }
                return;
            }

            this.console.addMessage(`Ход ${turn}:`);
            //поочередные ходы
            if (playerTurn) {
                this.playerTurn(player, turn, monster);
                if (monster.hp <= 0) {
                    this.handleVictory(player, monster);
                    return;
                }
                this.monsterTurn(monster, turn, player);
                if (player.hp <= 0) {
                    this.handleDefeat(monster);
                    return;
                }
            } else {
                this.monsterTurn(monster, turn, player);
                if (player.hp <= 0) {
                    this.handleDefeat(monster);
                    return;
                }
                this.playerTurn(player, turn, monster);
                if (monster.hp <= 0) {
                    this.handleVictory(player, monster);
                    return;
                }
            }

            this.console.addMessage('-------------------------------------');
            turn++;
            setTimeout(battleLoop, 1000);
        };

        battleLoop();
    }
    //ход игрока
    playerTurn(player, turn, monster) {
        if (Battle.hitBox(player.stats.agl, monster.agl)) {
            const damage = Battle.calculatePlayerDamage(
                player,
                turn,
                monster,
                (msg) => this.console.addMessage(msg)
            );
            monster.hp -= damage;
            this.console.addMessage(`Вы нанесли ${damage} урона!`);
        } else {
            this.console.addMessage('Вы промахнулись!');
        }
        this.console.addMessage(`Здоровье ${monster.name}: ${Math.max(0, monster.hp)}`);
    }
    //ход монстра
    monsterTurn(monster, turn, player) {
        if (Battle.hitBox(monster.agl, player.stats.agl)) {
            const damage = Battle.calculateMonsterDamage(
                monster,
                turn,
                player,
                (msg) => this.console.addMessage(msg)
            );
            player.hp -= damage;
            this.console.addMessage(`${monster.name} нанес вам ${damage} урона!`);
        } else {
            this.console.addMessage(`${monster.name} промахнулся!`);
        }
        this.console.addMessage(`Ваше здоровье: ${Math.max(0, player.hp)}`);
    }

    handleVictory(player, monster) {
        this.isBattleInProgress = false;
        this.console.addMessage(`Вы победили ${monster.name}!`);
        player.incrementWins();
        this.gameState.incrementWinStreak();

        // восстановление здоровья после боя
        player.restoreHealth();

        // предложение заменить оружие
        this.offerWeapon(monster.drop);

        // проверка на 5 побед подряд
        if (this.gameState.winStreak >= 5) {
            this.console.addMessage('ПОЗДРАВЛЯЕМ! Вы выиграли игру, одержав 5 побед подряд!');
            this.gameState.reset();
            return;
        }

        // предложение повысить уровень если не максимальный
        if (player.level < 3) {
            this.multiLevelBtn.style.display = 'block';
            this.console.addMessage('Доступно повышение уровня!');
        }
    }

    handleDefeat(monster) {
        this.isBattleInProgress = false;
        this.console.addMessage(`Вы проиграли ${monster.name}!`);
        this.console.addMessage('==============================================================');
        this.console.addMessage('СОЗДАЙТЕ НОВОГО ПЕРСОНАЖА!');
        this.console.addMessage('==============================================================');
        this.gameState.reset(); //сбрасываем состояние игры
        this.multiLevelBtn.style.display = 'none'; //скрываем кнопки мультикласса
    }
    //дроп с монстра
    offerWeapon(newWeapon) {
        const player = this.gameState.player;
        this.console.addMessage(`Вам выпало: ${newWeapon.name} (урон: ${newWeapon.dmg}, тип: ${newWeapon.type})`);
        this.console.addMessage('Хотите заменить оружие?');

        // создаем временные кнопки для выбора
        const takeBtn = document.createElement('button');
        takeBtn.textContent = 'Взять новое оружие';
        takeBtn.onclick = () => {
            player.weapon = newWeapon;
            this.console.addMessage(`Вы взяли ${newWeapon.name}!`);
            takeBtn.remove();
            leaveBtn.remove();
        };

        const leaveBtn = document.createElement('button');
        leaveBtn.textContent = 'Оставить текущее оружие';
        leaveBtn.onclick = () => {
            this.console.addMessage('Вы оставили текущее оружие.');
            takeBtn.remove();
            leaveBtn.remove();
        };

        this.console.output.appendChild(takeBtn);
        this.console.output.appendChild(leaveBtn);
    }
    //информация по мультиклассу
    showClassLevels() {
        const player = this.gameState.player;
        const classNames = { Rogue: 'Разбойник', Warrior: 'Воин', Barbarian: 'Варвар' };
        const levels = Object.entries(player.classLvl)
            .map(([cls, lvl]) => `${classNames[cls] || cls}: ${lvl} ур.`)
            .join(', ');
        this.console.addMessage(`Ваши классы: ${levels}`);
    }
    //повышение уровня
    levelUp(className) {
        const player = this.gameState.player;
        player.levelUp(className);
        this.console.addMessage(`Уровень ${this.classes[className].name} повышен!`);
        this.multiLevelBtn.style.display = 'none';

        if (player.level >= 3) {
            this.console.addMessage('Вы достигли максимального уровня!');
        }
    }
}

// запуск игры
new Game();