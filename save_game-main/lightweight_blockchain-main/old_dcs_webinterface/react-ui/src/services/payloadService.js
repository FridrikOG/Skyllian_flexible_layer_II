const ENDPOINT = '/api/payloads';

const payloadServices = () => ({
    getAllPayloads: (data) => fetch(`${ENDPOINT}/${data.id}`).then((d) => d.json()),
    addPayload: (data) => fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((d) => d.json()),
    //   editBoss: (data) => fetch(`${ENDPOINT}/${data.id}`, {
    //     method: 'PATCH',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data),
    //   }).then((d) => d.json()),
    //   deleteBoss: (id) => fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' }).then((d) => d.json()),
});

export default payloadServices();
