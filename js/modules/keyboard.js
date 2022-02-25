'use strict';

const ENTER_EVENT = new Event('enter');

class WordleKeyboard extends HTMLElement {
    #keys;
    #addLetter;
    #removeLastLetter;

    constructor() {
        super();

        this.#keys = this.querySelectorAll('.key');

        this.#initListeners();
    }

    register(parameters) {
        this.#addLetter = parameters.addLetter;
        this.#removeLastLetter = parameters.removeLastLetter;
    }

    changeLetter(letter, state) {
        const keysArray = Array.from(this.#keys);
    
        const key = keysArray.find(key => key.textContent === letter);

        key?.classList.add(state);
    }

    clear() {
        this.#keys.forEach(key => {
            key.classList.remove('invalid');
            key.classList.remove('halfValid');
            key.classList.remove('valid');
        });
    }

    #handleKey(event) {
        const target = event.target;
    
        if (!target.classList.contains('key')) return;
        if (target.classList.contains('special')) return;

        this.#addLetter?.(target.textContent);
    }

    #handleEnter() {
        this.dispatchEvent(ENTER_EVENT);
    }

    #handleDelete() {
        this.#removeLastLetter?.();
    }

    #initListeners() {
        this.addEventListener('click', this.#handleKey.bind(this));
        this.querySelector('#enter').addEventListener('click', this.#handleEnter.bind(this));
        this.querySelector('#delete').addEventListener('click', this.#handleDelete.bind(this));
    }
}

customElements.define('wordle-keyboard', WordleKeyboard);