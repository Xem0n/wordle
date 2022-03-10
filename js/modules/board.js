'use strict';

const MAX_LENGTH = 1;

class WordleBoard extends HTMLElement {
    #root;
    #board;
    #keyboard;

    constructor() {
        super();

        this.#root = document.querySelector(':root');

        this.#keyboard = document.querySelector('wordle-keyboard');
        this.#keyboard.register({
            addLetter: this.#addLetter.bind(this),
            removeLastLetter: this.#removeLastLetter.bind(this)
        });

        this.#board = [];

        this.#initListeners();
    }

    create(rows, elements) {
        this.#updateBoardSize(rows, elements);
        this.#board = [];

        for (let i = 0; i < rows; i++) {
            this.#board.push(this.#createRow(elements));
        }
    }

    #updateBoardSize(rows, columns) {
        this.#root.style.setProperty('--rows', rows);
        this.#root.style.setProperty('--columns', columns);
    }

    #createRow(elements) {
        const rowElement = document.createElement('div');
        rowElement.classList.add('row');
        this.append(rowElement);

        const row = [];

        for (let i = 0; i < elements; i++) {
            const element = this.#createElement();
            rowElement.append(element);

            row.push(element);
        }

        return row;
    }

    #createElement() {
        const div = document.createElement('div');
        div.classList.add('element');

        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = MAX_LENGTH;
        input.disabled = true;
        
        div.append(input);

        return div;
    }

    modifyRow(row, state) {
        this.#board[row].forEach(element => {
            const input = element.querySelector('input');

            input.disabled = state;
        });
    }

    getWord(row) {
        const initialWord = '';

        const word = this.#board[row].reduce(
            (previousValue, currentValue) => 
            previousValue + (currentValue.querySelector('input').value || ' '),
            initialWord
        );

        return word.toLowerCase();
    }

    showLetter(row, column, state, delay) {
        setTimeout(() => {
            const element = this.#board[row][column];
            element.classList.add(state);

            const letter = element.querySelector('input').value;
            this.#keyboard.changeLetter(letter, state);
        }, delay);
    }

    clear() {
        this.querySelectorAll('.element').forEach(element => {
            element.classList.remove('valid', 'halfValid', 'invalid');
        });

        this.querySelectorAll('input').forEach(element => {
            element.value = '';
            element.disabled = true;
        });

        this.#keyboard.clear();
    }

    cleanup() {
        this.querySelectorAll('*').forEach(element => element.remove());

        this.#board = [];
    }

    #addLetter(letter) {
        const input = this.#getAvailableInput();

        if (input) {
            input.value = letter;
        }
    }

    #removeLastLetter() {
        const input = this.#getLastFilledInput();

        if (input) {
            input.value = '';
        }
    }

    #getAvailableInput() {
        const inputs = this.querySelectorAll('input:not(:disabled)');

        return Array.from(inputs).find(element => 
            element.value.trim() === ''
        );
    }

    #getLastFilledInput() {
        const inputs = this.querySelectorAll('input:not(:disabled)');

        return Array.from(inputs).reverse().find(element => 
            element.value.trim() !== ''    
        );
    }

    #handleInput(event) {
        const input = event.target;

        if (input.value.length >= MAX_LENGTH) {
            this.#focusNextInput(input);
        }
    }

    #focusNextInput(currentInput) {
        const nextInput = currentInput.parentNode.nextElementSibling?.firstElementChild;

        if (nextInput) {
            nextInput.focus();
        }
    }

    #initListeners() {
        this.addEventListener('input', this.#handleInput.bind(this));
    }
}

customElements.define('wordle-board', WordleBoard);