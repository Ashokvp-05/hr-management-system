const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:4000/api';
const FRONTEND_URL = 'http://localhost:3000';

// Test Configuration
const ITERATIONS = 50; // Number of requests per endpoint
const CONCURRENT_REQUESTS = 5;

const results = {
    endpoints: {},
    summary: {}
};

async function measureEndpoint(name, url, method = 'GET', data = null) {
    const times = [];
    let successCount = 0;

    console.log(`\nTesting ${name} (${url})...`);

    const performRequest = async () => {
        const start = performance.now();
        try {
            const options = {
                method,
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (data && (method === 'POST' || method === 'PUT')) {
                options.body = JSON.stringify(data);
            }

            const response = await fetch(url, options);

            // Consume body to ensure full request completion
            try {
                await response.text();
            } catch (e) {
                // ignore
            }

            const end = performance.now();
            times.push(end - start);
            successCount++;
        } catch (e) {
            // console.error(e.message);
        }
    };

    // Execute in batches
    for (let i = 0; i < ITERATIONS; i += CONCURRENT_REQUESTS) {
        const batch = [];
        // Determine batch size for this iteration
        const batchSize = Math.min(CONCURRENT_REQUESTS, ITERATIONS - i);

        for (let j = 0; j < batchSize; j++) {
            batch.push(performRequest());
        }
        await Promise.all(batch);
    }

    if (times.length === 0) {
        console.log("  No successful requests.");
        return;
    }

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    results.endpoints[name] = {
        avg: avg.toFixed(2) + 'ms',
        min: min.toFixed(2) + 'ms',
        max: max.toFixed(2) + 'ms',
        successRate: ((successCount / ITERATIONS) * 100).toFixed(1) + '%'
    };

    console.log(`  Avg: ${avg.toFixed(2)}ms | Min: ${min.toFixed(2)}ms | Max: ${max.toFixed(2)}ms`);
}

async function runTests() {
    console.log("🚀 Starting Performance Benchmark (using fetch)...\n");

    // 1. Health Check (Basic Overhead)
    await measureEndpoint('API Health', `${BASE_URL}`);

    // 2. Static Content (Should be Cached)
    await measureEndpoint('Holidays (Cached)', `${BASE_URL}/holidays`);

    // 3. Auth Check (Database Query)
    await measureEndpoint('Login (Auth)', `${BASE_URL}/auth/login`, 'POST', {
        email: 'admin@hrms.com',
        password: 'wrongpassword' // Expected 401, but measures round trip
    });

    // 4. Frontend Home Load (SSR)
    await measureEndpoint('Frontend Home', FRONTEND_URL);

    // 5. Frontend Login Page
    await measureEndpoint('Frontend Login', `${FRONTEND_URL}/login`);

    // Reporting
    console.log("\n\n📊 TEST RESULTS SUMMARY");
    console.log("==================================================");
    console.table(results.endpoints);
    console.log("==================================================");

    const allTimes = Object.values(results.endpoints).map(e => parseFloat(e.avg));
    const globalAvg = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;

    console.log(`\n🌟 Global Average Response Time: ${globalAvg.toFixed(2)}ms`);
    console.log(`⚡ Performance Status: ${globalAvg < 200 ? 'EXCELLENT' : globalAvg < 500 ? 'GOOD' : 'NEEDS IMPROVEMENT'}`);
}

runTests();
