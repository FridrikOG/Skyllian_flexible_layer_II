class BlockRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
          CREATE TABLE IF NOT EXISTS blocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            winner_number INTEGER,
            previous_hash TEXT,
            writer_id INTEGER,
            coordinator_id INTEGER,
            payload TEXT)`
        return this.dao.run(sql)
    }

    create(winner_number, previous_hash, writer_id, coordinator_id, payload) {
        return this.dao.run(
            'INSERT INTO blocks (winner_number, previous_hash, writer_id, coordinator_id, payload) VALUES (?, ?, ?, ?, ?)',
            [winner_number, previous_hash, writer_id, coordinator_id, payload])
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM blocks WHERE id = ?`,
            [id]
        )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM blocks WHERE id = ?`,
            [id])
    }

    getAll() {
        return this.dao.all(`SELECT * FROM blocks`)
    }
}

module.exports = BlockRepository;