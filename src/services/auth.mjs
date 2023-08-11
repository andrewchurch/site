import GoTrue from 'gotrue-js';

let auth = false;
const identityApiUrl = 'https://andrewthewebguy.com/.netlify/identity';

function getAuth() {
    if (!auth) {
        auth = new GoTrue({
            APIUrl: identityApiUrl,
            audience: '',
            setCookie: false,
        });
    }

    return auth;
}

export function loginUser(username, password, onSuccess, onFailure) {
    const auth = getAuth();
    const rememberMe = true;

    auth
        .login(username, password, rememberMe)
        .then(onSuccess)
        .catch(onFailure);
}