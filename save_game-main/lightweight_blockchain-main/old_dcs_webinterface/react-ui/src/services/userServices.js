const ENDPOINT = '/api/users';

const userServices = () => ({
    getAllUsers: () => fetch(ENDPOINT).then((d) => d.json()),
    addUser: (data) => fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((d) => d.json()),
    setUser: (data) => fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((d) => d.json()),
    setUserById: (data) => fetch(`${ENDPOINT}/${data}`).then((d) => d.json()),
    getAuthLevel: () => fetch(ENDPOINT).then((d) => d.json()),
    deleteUser: (id) => fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' }).then((d) => d.json()),
    //   editBoss: (data) => fetch(`${ENDPOINT}/${data.id}`, {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   }).then((d) => d.json()),
    //   deleteBoss: (id) => fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' }).then((d) => d.json()),
});

export default userServices();
