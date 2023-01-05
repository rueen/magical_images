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
        baseURL: 'http://110.40.211.150:8818',
        ...base
    }
}

export default config[ENV];