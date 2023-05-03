class PayloadRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS payloads (id SERIAL PRIMARY KEY , name TEXT, type TEXT, data TEXT)`
        return this.dao.run(sql)
    }

    create(name, type, data) {
        return this.dao.run(
            'INSERT INTO payloads (name, type, data) VALUES (?, ?, ?)',
            [name, type, data])
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM payloads WHERE id = ?`,
            [id]
        )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM payloads WHERE id = ?`,
            [id])
    }

    getAll() {
        return this.dao.all(`SELECT * FROM payloads`)
    }
}

module.exports = PayloadRepository;