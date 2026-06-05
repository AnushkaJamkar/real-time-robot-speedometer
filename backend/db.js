const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'speedometer_db',
  password: 'anushka',
  port: 5432,
});

module.exports = pool;