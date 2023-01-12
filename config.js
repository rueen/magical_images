const ENV = 'TEST';

const base = {
    
}
const config = {
    PROD: {
        baseURL: '',
        env_version: 'release', // release | develop | trial
        ...base
    },
    TEST: {
        baseURL: 'http://110.40.211.150:8818',
        env_version: 'trial', 
        ...base
    }
}

export default config[ENV];