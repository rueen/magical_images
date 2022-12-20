const ENV = 'TEST';

const base = {
    platform: 50
}
const config = {
    PROD: {
        baseURL: '',
        ...base
    },
    TEST: {
        baseURL: 'http://127.0.0.1:8000/',
        ...base
    }
}

export default config[ENV];