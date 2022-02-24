'use strict';

class WordleBoard extends HTMLElement {
    #root;
    #board;

    constructor() {
        super();

        this.#root = document.querySelector(':root');

        this.#board = [];
    }

    create(rows, elements) {
        this.#updateBoardSize(elements);
        this.#board = [];

        for (let i = 0; i < rows; i++) {
            this.#board.push(this.#createRow(elements));
        }
    }

    #updateBoardSize(size) {
        this.#root.style.setProperty('--columns', size);
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
        input.maxLength = '1';
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
            this.#board[row][column].classList.add(state);
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
    }

    cleanup() {
        this.querySelectorAll('*').forEach(element => element.remove());

        this.#board = [];
    }
}

customElements.define('wordle-board', WordleBoard);