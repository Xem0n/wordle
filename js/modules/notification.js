'use strict';

const HIDE_EVENT = new Event('hide');

class WordleNotification extends HTMLDivElement {
    #won;
    #lost;
    #rounds;
    #exp;
    #word;

    constructor() {
        super();

        this.#won = this.querySelector('.won');
        this.#lost = this.querySelector('.lost');
        this.#rounds = this.querySelector('.rounds');
        this.#exp = this.querySelector('.exp');
        this.#word = this.querySelector('.word');

        this.#initListeners();
    }

    show() {
        this.classList.add('show');
    }

    hide() {
        this.classList.remove('show');

        this.dispatchEvent(HIDE_EVENT);
    }

    /*
    Data Interface
    won: boolean
    secretWord?: string
    rounds?: number
    exp?: number
    */
    update(data) {
        if (data.won) {
            this.#won.classList.add('show');
            this.#lost.classList.remove('show');
        } else {
            this.#lost.classList.add('show');
            this.#won.classList.remove('show');
        }
    }

    #handleClose() {
        this.hide();
    }

    #initListeners() {
        const closeButton = this.querySelector('.close');

        closeButton.addEventListener('click', this.#handleClose.bind(this));
    }
}

customElements.define('wordle-notification', WordleNotification, { extends: 'div' });