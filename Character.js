//приватные поля
export class Character {
    #hp;
    #maxHp;
    #weapon;
    #stats;
    #classLvl;
    #level;
    #countWins;

    constructor(className, startHp, startWeapon, stats) {
        this.className = className;
        this.#maxHp = startHp + stats.stm;
        this.#hp = this.#maxHp;
        this.#weapon = startWeapon;
        this.#stats = { ...stats };
        this.#classLvl = { [className]: 1 };
        this.#level = 1;
        this.#countWins = 0;
    }
    // геттеры и сеттеры для доступа к приватным полям
    get hp() { return this.#hp; }
    set hp(value) { this.#hp = Math.max(0, value); }    // здоровье не может быть меньше 0

    get maxHp() { return this.#maxHp; }
    get weapon() { return this.#weapon; }
    set weapon(value) { this.#weapon = value; }
    get stats() { return { ...this.#stats }; }
    get classLvl() { return { ...this.#classLvl }; }
    get level() { return this.#level; }
    get countWins() { return this.#countWins; }
    //повышаем уровень
    levelUp(className) {
        if (this.#level >= 3) return;

        this.#level++;
        this.#classLvl[className] = (this.#classLvl[className] || 0) + 1;
        // применяем бонусы характеристик за уровень
        const bonusStats = this.getLevelUpBonus(className, this.#classLvl[className]);
        Object.keys(bonusStats).forEach(stat => {
            if (this.#stats[stat]) this.#stats[stat] += bonusStats[stat];
        });
        // добавляем бонус к здоровью за уровень
        const hpBonus = this.getHpBonus(className);
        this.#maxHp += hpBonus;
        this.#hp = this.#maxHp;
    }
    // бонусы характеристик за уровни классов
    getLevelUpBonus(className, level) {
        const bonuses = {
            Rogue: { 2: { agl: 1 } },
            Warrior: { 3: { str: 1 } },
            Barbarian: { 3: { stm: 1 } }
        };
        return bonuses[className]?.[level] || {};
    }
    // бонус здоровья за уровень класса
    getHpBonus(className) {
        const hpMap = { Rogue: 4, Warrior: 5, Barbarian: 6 };
        return hpMap[className] || 0;
    }
    //счётчик побед
    incrementWins() {
        this.#countWins++};
    //восстанавливает здоровье
    restoreHealth() {
        this.#hp = this.#maxHp}
}