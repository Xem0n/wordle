'use strict';

import Board from './board.js';

const KEY_ENTER = 'Enter';
const DELAY = 550;

class Game {
    #board;
    #tries;
    #letters;
    #currentRow;
    #dictionary;
    #started;
    #secretWord;

    constructor() {
        return (async () => {
            this.#board = new Board();

            this.#dictionary = await this.#loadDictionary();

            this.#started = false;

            this.#initListeners();

            return this;
        })();
    }

    async #loadDictionary() {
        const response = await fetch('./js/dictionary.json');
        const json = await response.json();

        return json;
    }

    create(rows, columns) {
        this.#board.create(rows, columns);
        
        this.#tries = rows;
        this.#letters = columns;
    }

    start() {
        this.#started = true;
        this.#secretWord = this.#getRandomWord(this.#letters);
        this.#currentRow = 0;

        this.#board.modifyRow(0, false);
    }

    #getRandomWord(length) {
        const random = Math.floor(Math.random() * this.#dictionary[length].length);

        return this.#dictionary[length][random];
    }

    #keyDownHandler(event) {
        if (!this.#started || event.key !== KEY_ENTER) {
            return;
        }

        this.#checkWord();
    }

    #checkWord() {
        const word = this.#board.getWord(this.#currentRow);
    
        if (!this.#dictionary[this.#letters].includes(word)) {
            return;
        }

        for (let i = 0; i < word.length; i++) {
            const userLetter = word[i];
            const secretLetter = this.#secretWord[i];

            const delay = i * DELAY;
            let state;

            if (userLetter === secretLetter) {
                state = 'valid';
            } else if (this.#secretWord.includes(userLetter)) {
                state = 'halfValid';
            } else {
                state = 'invalid';
            }

            this.#board.showLetter(this.#currentRow, i, state, delay);
        }

        if (word === this.#secretWord) {
            this.#win();
        } else if (this.#isLastTry()) {
            this.#lose();
        } else {
            this.#nextRow();
        }
    }

    #isLastTry() {
        return this.#currentRow + 1 === this.#tries;
    }

    #nextRow() {
        this.#board.modifyRow(this.#currentRow, true);
        this.#board.modifyRow(++this.#currentRow, false);
    }

    #win() {
        this.#board.modifyRow(this.#currentRow, true);
    }

    #lose() {
        this.#board.modifyRow(this.#currentRow, true);
    }

    #initListeners() {
        document.addEventListener('keydown', this.#keyDownHandler.bind(this));
    }
}

export default Game;