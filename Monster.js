//объекты для монстров
export class Monster {
    constructor(name, hp, dmg, str, agl, stm, special, drop) {
        this.name = name;
        this.hp = hp;
        this.dmg = dmg;
        this.str = str;
        this.agl = agl;
        this.stm = stm;
        this.special = special;
        this.drop = drop;
    }
}
//монстры
export class MonsterFactory {
    static createMonsters(weapons) {
        return {
            Goblin: new Monster('Гоблин', 5, 2, 1, 1, 1, null, weapons.Dagger),
            Skeleton: new Monster('Скелет', 10, 2, 2, 2, 1,
                'Получает вдвое больше урона от дробящего оружия', weapons.Club),
            Slime: new Monster('Слайм', 8, 1, 3, 1, 2,
                'Рубящее оружие не наносит урона', weapons.Spear),
            Ghost: new Monster('Призрак', 6, 3, 1, 3, 1,
                'Скрытая атака при превосходстве в ловкости', weapons.Sword),
            Golem: new Monster('Голем', 10, 1, 3, 1, 3,
                'Каменная кожа снижает урон', weapons.Axe),
            Dragon: new Monster('Дракон', 20, 4, 3, 3, 3,
                'Дыхание огня каждый 3-й ход', weapons.LegendarySword)
        };
    }
}