'use strict';

class Game {
    #root;
    #boardElement;
    #board;
    #dictionary;

    constructor() {
        return (async () => {
            this.#root = document.querySelector(':root');

            this.#boardElement = document.querySelector('.board');
            this.#board = [];

            this.#dictionary = await this.#loadDictionary();

            return this;
        })();
    }

    async #loadDictionary() {
        const response = await fetch('./js/dictionary.json');
        const json = await response.json();

        return json;
    }

    createBoard(rows, elements) {
        this.#updateBoardSize(elements);
        this.#board = [];

        for (let i = 0; i < rows; i++) {
            this.#board.push(this.#createRow(elements));
        }
    }

    #updateBoardSize(columns) {
        this.#root.style.setProperty('--columns', columns);
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

    cleanup() {
        document.querySelectorAll('.board *').forEach(element => element.remove());

        this.#board = [];
    }
}

export default Game;