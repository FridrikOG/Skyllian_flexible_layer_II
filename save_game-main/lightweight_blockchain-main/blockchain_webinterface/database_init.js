const test_data = require('./server/test_data')
const Promise = require('bluebird')
const AppDAO = require('./dao')
const PayloadRepository = require('./payload_repository');
const WriterRepository = require('./writer_repository');
const BlockRepository = require('./block_repository');

function DatabaseInit() {
    const dao = new AppDAO('./database.sqlite3')
    const writer_repo = new WriterRepository(dao)

    writer_repo.createTable()
        .then(() => {
            return Promise.all(test_data.WRITERS.writers.map((writer) => {
                const { ip, port, public_key, ver_exp } = writer;
                return writer_repo.create(ip, port, public_key, ver_exp);
            }))
        })
    const payload_repo = new PayloadRepository(dao)
    payload_repo.createTable()
        .then(() => {
            return Promise.all(test_data.PAYLOADS.payloads.map((payload) => {
                const { name, type, data } = payload
                return payload_repo.create(name, type, JSON.stringify(data))
            }))
        })
    const block_repo = new BlockRepository(dao)
    block_repo.createTable()
        .then(() => {
            return Promise.all(test_data.BLOCKS.blocks.map((block) => {
                const { winner_number, previous_hash, writer_signature, writer_id, coordinator_id, payload } = block
                return block_repo.create(winner_number, previous_hash, writer_signature, writer_id, coordinator_id, JSON.stringify(payload))
            }))
        })

    // payload_repo.createTable()
    //     .then(() => {
    //         return Promise.all(test_data.PAYLOADS.payloads.map((payload) => {
    //             const { name, type, data } = payload
    //             return payload_repo.create(name, type, JSON.stringify(data))
    //         }))
    //     })
    //     .then(() => payload_repo.getAll())
    //     .then((payloads) => {
    //         console.log('\nRetrieved payloads in database')
    //         return new Promise((resolve, reject) => {
    //             payloads.forEach((payload) => {
    //                 console.log(`payload id = ${payload.id}`)
    //                 console.log(`payload name = ${payload.name}`)
    //                 console.log(`payload type = ${payload.type}`)
    //                 console.log(`payload data = ${payload.data}`)
    //             })
    //         })
    //         resolve('success')
    //     })
    //     .catch((err) => {
    //         console.log('Error: ')
    //         console.log(JSON.stringify(err))
    //     })
}

DatabaseInit()