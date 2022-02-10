'use strict';

const DEFAULT_LEVEL = 1;
const DEFAULT_EXP = 0;

class User {
    #storage;
    #level;
    #exp;

    #root;
    #levelElement;
    #expElement;
    #maxExpElement;

    constructor() {
        this.#storage = window.localStorage;

        this.#root = document.querySelector(':root');
        this.#levelElement = document.getElementById('level');
        this.#expElement = document.getElementById('exp');
        this.#maxExpElement = document.getElementById('maxExp');

        this.level = Number(this.#storage.getItem('level')) || DEFAULT_LEVEL;
        this.exp = Number(this.#storage.getItem('exp')) || DEFAULT_EXP;
    }

    #checkLevelUp() {
        const maxExp = this.#getMaxExp();

        if (this.exp <= maxExp) {
            return;
        }

        const remainingExp = this.exp - maxExp;

        this.#levelUp();

        this.exp = remainingExp;
    }

    #getMaxExp() {
        return 2 << (this.level + 2);
    }

    #levelUp() {
        this.level++;
        this.exp = 0;
    }
    
    get level() {
        return this.#level;
    }

    set level(lvl) {
        this.#level = lvl;

        this.#storage.setItem('level', lvl);

        this.#updateHeader();
    }

    get exp() {
        return this.#exp;
    }

    set exp(exp) {
        this.#exp = exp;

        this.#storage.setItem('exp', exp);

        this.#checkLevelUp();
        this.#updateHeader();
    }

    #updateHeader() {
        this.#levelElement.textContent = this.level;

        this.#expElement.textContent = this.exp;
        this.#maxExpElement.textContent = this.#getMaxExp();

        this.#root.style.setProperty('--experience', `${this.exp / this.#getMaxExp() * 100}%`);
    }
}

export default User;