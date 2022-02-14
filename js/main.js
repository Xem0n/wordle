'use strict';

import User from './modules/user.js';
import Game from './modules/game.js';

const board = document.querySelector('.board');
const loading = document.querySelector('.loading');

const showLoading = () => {
    board.classList.add('hide');
    loading.classList.remove('hide');
};

const hideLoading = () => {
    board.classList.remove('hide');
    loading.classList.add('hide');
};

(async () => {
    showLoading();

    const user = new User();

    const game = await new Game();
    game.create(6, 5);
    game.start();

    hideLoading();
})();