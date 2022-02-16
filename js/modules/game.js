'use strict';

const KEY_ENTER = 'Enter';
const DELAY = 550;

class Game {
    #user;
    #board;
    #tries;
    #letters;
    #currentRow;
    #dictionary;
    #started;
    #secretWord;
    #notification;

    constructor(user) {
        return (async () => {
            this.#user = user;

            this.#board = document.querySelector('wordle-board');
            this.#notification = document.querySelector('wordle-notification');

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
        if (!this.#started || event.key !== KEY_ENTER) return;

        this.#checkWord();
    }

    #checkWord() {
        const word = this.#board.getWord(this.#currentRow);
    
        if (!this.#dictionary[this.#letters].includes(word)) return;

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

        this.#notification.update({
            won: true,
            rounds: this.#currentRow + 1,
            exp: 0
        });
        this.#showNotification();
    }

    #lose() {
        this.#board.modifyRow(this.#currentRow, true);

        this.#notification.update({
            won: false,
            secretWord: this.#secretWord
        });
        this.#showNotification();
    }

    #showNotification() {
        const delay = this.#letters * DELAY;

        setTimeout(() => {
            this.#notification.show();
        }, delay);
    }

    #handleHideNotification() {
        this.#board.clear();
    }

    #initListeners() {
        document.addEventListener('keydown', this.#keyDownHandler.bind(this));
        this.#notification.addEventListener('hide', this.#handleHideNotification.bind(this));
    }
}

export default Game;