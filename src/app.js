// src/app.js

import { getUserFragments } from './api';
import { Auth, getUser } from './auth';

async function init() {
  const apiUrl = process.env.API_URL || 'http://localhost:8080';
  const userSection = document.querySelector('#user');
  const welcomeSection = document.querySelector('#welcome');
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
  let fragmentData = await getUserFragments(user);

  console.log({ user });
  userSection.hidden = false;
  welcomeSection.hidden = false;
  welcomeSection.querySelector('.username').innerText = user.username;
  document.getElementById('currentFragments').innerText = JSON.stringify(fragmentData, null, 4);
  loginBtn.disabled = true;

  document.getElementById('getFragments').addEventListener('click', () => {
    const url = apiUrl + '/v1/fragments';
    fetch(url, {
      method: 'GET',
      headers: user.authorizationHeaders(),
    })
      .then((res) => res.text())
      .then((data) => {
        console.log('GET ' + url + ': response: ' + data);
        document.getElementById('currentFragments').innerText = JSON.stringify(
          JSON.parse(data),
          null,
          4
        );
      });
  });

  document.getElementById('getExpanded').addEventListener('click', () => {
    const url = apiUrl + '/v1/fragments?expand=1';
    fetch(url, {
      method: 'GET',
      headers: user.authorizationHeaders(),
    })
      .then((res) => res.text())
      .then((data) => {
        console.log('GET ' + url + ': response: ' + data);
        document.getElementById('currentFragments').innerText = JSON.stringify(
          JSON.parse(data),
          null,
          4
        );
      });
  });

  // consider adding error handling to support 415/invalid type
  document.getElementById('post').addEventListener('click', () => {
    const data = document.getElementById('postText').value;
    const fragmentType = document.getElementById('fragmentType').value;
    const url = apiUrl + '/v1/fragments/';
    fetch(url, {
      method: 'POST',
      headers: user.authorizationHeaders(fragmentType),
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('POST ' + url + ': response: ' + JSON.stringify(data, null, 4));
        document.getElementById('postResponse').innerText = JSON.stringify(data, null, 4);
        document.getElementById('responseLink').value = url + data.fragment.id;
      });
  });

  // consider ensuring that this field cannot be empty (it returns a fragments list otherwise)
  document.getElementById('get').addEventListener('click', () => {
    let url = document.getElementById('getText').value;
    if (!RegExp(/(https?:\/\/)/).test(url)) {
      // matches start of a link
      url = apiUrl + '/v1/fragments/' + url; // received id, reconstruct into link for http request
    }
    fetch(url, {
      method: 'GET',
      headers: user.authorizationHeaders(),
    })
      .then((res) => res.text())
      .then((data) => {
        console.log('GET ' + url + ': response: ' + data);
        document.getElementById('getResponse').value = data;
      });
  });

  document.getElementById('getLink').addEventListener('click', () => {
    let url = document.getElementById('responseLink').value;
    fetch(url, {
      method: 'GET',
      headers: user.authorizationHeaders(),
    })
      .then((res) => res.text())
      .then((data) => {
        console.log('GET ' + url + ': response: ' + data);
        document.getElementById('getResponse').value = data;
      });
  });
}

addEventListener('DOMContentLoaded', init);
