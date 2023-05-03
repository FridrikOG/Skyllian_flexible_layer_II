const { Pool } = require('pg');
// this pool should be uncommented if you want to heroku database
// export const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });
// this pool should be uncommented if you want to use
// local database and change connection string accordingly
const pool = new Pool({

    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:PastPresentandFuture@localhost:5432/postgres',
    ssl: !!process.env.DATABASE_URL,
});
module.exports = pool;
