const { Client } = require('pg');

const connectionString = "postgresql://postgres:Ashok@005@localhost:5432/hr_db";

async function showDb() {
    const client = new Client({
        connectionString: connectionString,
    });

    try {
        await client.connect();
        console.log("--- Connection Successful ---\n");

        console.log("1. Listing all tables:");
        const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.table(tablesRes.rows);

        console.log("\n2. Recent Users:");
        const usersRes = await client.query("SELECT id, email, name, status FROM users LIMIT 5");
        console.table(usersRes.rows);

        console.log("\n3. Current Active Time Entries:");
        const timeRes = await client.query(`
        SELECT u.name, t.clock_in, t.clock_type 
        FROM time_entries t 
        JOIN users u ON t.user_id = u.id 
        WHERE t.status = 'ACTIVE'
    `);
        console.table(timeRes.rows);

    } catch (err) {
        console.error("Error connecting to PostgreSQL:", err.message);
    } finally {
        await client.end();
    }
}

showDb();
