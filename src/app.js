// src/app.js

import { Auth, getUser } from './auth';

async function init() {
    const userSection = document.querySelector('#user');
    const loginBtn = document.querySelector('#login');
    const logoutBtn = document.querySelector('#logout');

    loginBtn.onclick = () => {
        Auth.federatedSignIn();
    };

    logoutBtn.onclick = () => {
        Auth.signOut();
    };

    const user = await getUser();
    if (!user) {
        logoutBtn.disabled = true;
        return;
    }

    console.log ({ user });
    userSection.hidden = false;
    userSection.querySelector('.username').innerText = user.username;
    loginBtn.disabled = true;
}

addEventListener('DOMContentLoaded', init);