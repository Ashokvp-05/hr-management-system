const { Client } = require('pg');

async function testConnection(host, password) {
    const url = `postgresql://postgres:${encodeURIComponent(password)}@${host}:5432/hr_db`;
    console.log(`Testing: ${host} with encoded password...`);
    const client = new Client({ connectionString: url });
    try {
        await client.connect();
        console.log(`✅ Success with ${host}`);
        await client.end();
        return true;
    } catch (err) {
        console.log(`❌ Failed with ${host}: ${err.message}`);
        return false;
    }
}

async function run() {
    const pass = "Ashok@005";
    await testConnection('localhost', pass);
    await testConnection('127.0.0.1', pass);
    await testConnection('::1', pass);
}

run();
