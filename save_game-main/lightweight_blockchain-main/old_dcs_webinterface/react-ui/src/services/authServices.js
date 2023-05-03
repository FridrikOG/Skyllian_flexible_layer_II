const ENDPOINT = '/api/auth';

const authServices = () => ({
    getAuthLevel: () => fetch(ENDPOINT).then((d) => d.json()),
    deleteAuthLevel: () => fetch(ENDPOINT, { method: 'DELETE' }),
});

export default authServices();
