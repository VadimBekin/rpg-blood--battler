import { Character } from './Character.js';

export class GameState {
    #player = null;
    #winStreak = 0;
    //создание персонажа
    createCharacter(className, startHp, startWeapon) {
        const stats = this.#generateRandomStats();
        this.#player = new Character(className, startHp, startWeapon, stats);
        return this.#player;
    }
    //генерируем статы персонажу
    #generateRandomStats() {
        const randomStat = () => Math.floor(Math.random() * 3) + 1;
        return {
            str: randomStat(),
            agl: randomStat(),
            stm: randomStat()
        };
    }
    //состояние игрока
    get player() {
        return this.#player;};
    //серия побед
    get winStreak() {
        return this.#winStreak;};
    //увеличиваем серию побед
    incrementWinStreak() {
        this.#winStreak++;};
    //обнуляем песонажа и серию побед
    reset() {
        this.#player = null;
        this.#winStreak = 0;
    };
}