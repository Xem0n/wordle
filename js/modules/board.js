'use strict';

class Board {
    #root;
    #board;
    #boardElement;

    constructor() {
        this.#root = document.querySelector(':root');

        this.#board = [];
        this.#boardElement = document.querySelector('.board');
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
        this.#boardElement.append(rowElement);

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
        let word = '';

        this.#board[row].forEach(element => {
            const input = element.querySelector('input');

            word += input.value || ' ';
        });

        return word;
    }

    showLetter(row, column, state, delay) {
        setTimeout(() => {
            this.#board[row][column].classList.add(state);
        }, delay);
    }

    cleanup() {
        document.querySelectorAll('.board *').forEach(element => element.remove());

        this.#board = [];
    }
}

export default Board;