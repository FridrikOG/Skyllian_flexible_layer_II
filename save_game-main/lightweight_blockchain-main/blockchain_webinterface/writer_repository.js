class WriterRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS writers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        port INTEGER,
        public_key TEXT,
        ver_exp INTEGER)`
        return this.dao.run(sql)
    }

    create(ip, port, public_key, ver_exp) {
        return this.dao.run(
            'INSERT INTO writers (ip, port, public_key, ver_exp) VALUES (?, ?, ?, ?)',
            [ip, port, public_key, ver_exp])
    }

    delete(id) {
        return this.dao.run(
            `DELETE FROM writers WHERE id = ?`,
            [id]
        )
    }

    getById(id) {
        return this.dao.get(
            `SELECT * FROM writers WHERE id = ?`,
            [id])
    }

    getAll() {
        return this.dao.all(`SELECT * FROM writers`)
    }
}

module.exports = WriterRepository;