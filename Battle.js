export class Battle {
    //попадания
    static hitBox(attAgl, defAgl) {
        const random = Math.floor(Math.random() * (attAgl + defAgl)) + 1;
        return random > defAgl;
    }
    //расчёт урона монстрам
    static calculatePlayerDamage(player, turn, monster, addMessage) {
        let damage = player.weapon.dmg + player.stats.str;

        // способности классов
        if (player.classLvl.Rogue >= 1 && player.stats.agl > monster.agl) {
            damage += 1;
            addMessage('Скрытая атака: +1 урона');
        }
        if (player.classLvl.Rogue >= 3) {
            const poisonDmg = Math.max(0, turn - 1);
            if (poisonDmg > 0) {
                damage += poisonDmg;
                addMessage(`Яд +${poisonDmg} урона!`);
            }
        }
        if (player.classLvl.Warrior >= 1 && turn === 1) {
            damage += player.weapon.dmg;
            addMessage('Порыв к действию: двойной урон оружием в первый ход');
        }
        if (player.classLvl.Barbarian >= 1) {
            if (turn <= 3) {
                damage += 2;
                addMessage('Ярость: +2 к урону');
            } else {
                damage -= 1;
                addMessage('Ярость: -1 к урону');
            }
        }

        // защита монстров
        if (monster.name === 'Скелет' && player.weapon.type === 'Дробящий') {
            damage *= 2;
            addMessage('Скелет получает двойной урон от дробящего оружия');
        }
        if (monster.name === 'Слайм' && player.weapon.type === 'Рубящий') {
            damage = player.stats.str;
            addMessage('Рубящее оружие не наносит урона Слайму');
        }
        if (monster.name === 'Голем') {
            damage -= monster.stm;
            addMessage(`Каменная кожа голема снижает урон на ${monster.stm}`);
        }

        return Math.max(0, damage);
    }
    //расчёт урона монстра по персонажу
    static calculateMonsterDamage(monster, turn, player, addMessage) {
        let damage = monster.dmg + monster.str;

        if (monster.name === 'Призрак' && monster.agl > player.stats.agl) {
            damage += 1;
            addMessage('Скрытая атака призрака: +1 урона');
        }
        if (monster.name === 'Дракон' && turn % 3 === 0) {
            damage += 3;
            addMessage('Дыхание дракона: +3 урона');
        }
        if (player.classLvl.Warrior >= 2 && player.stats.str > monster.str) {
            damage -= 3;
            addMessage('Щит воина: -3 урона');
        }
        if (player.classLvl.Barbarian >= 2) {
            damage -= player.stats.stm;
            addMessage(`Каменная кожа варвара: -${player.stats.stm} урона`);
        }

        return Math.max(0, damage);
    }
}