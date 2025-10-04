//объекты для оружия
export class Weapon {
    constructor(name, dmg, type) {
        this.name = name;
        this.dmg = dmg;
        this.type = type;
    }
}
//оружие
export class WeaponFactory {
    static createWeapons() {
        return {
            Dagger: new Weapon('Кинжал', 2, 'Колющий'),
            Sword: new Weapon('Меч', 3, 'Рубящий'),
            Club: new Weapon('Дубина', 3, 'Дробящий'),
            Axe: new Weapon('Топор', 4, 'Рубящий'),
            Spear: new Weapon('Копье', 3, 'Колющий'),
            LegendarySword: new Weapon('Легендарный Меч', 10, 'Рубящий')
        };
    }
}