const API_URL = 'http://localhost:8080';

const getGreeting = () => {
    return fetch(API_URL + '/hello', {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    });
}

const HelloWorldService = {
    getGreeting,
}

export default HelloWorldService