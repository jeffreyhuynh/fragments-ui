// src/api.js

const apiUrl = process.env.API_URL || 'http://localhost:8080';

export async function getUserFragments(user) {
  console.log('requesting user fragments data...');
  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('received user fragments data', { data });
    return data;
  } catch (err) {
    console.error('unable to call GET /v1/fragments', { err });
    return {};
  }
}
