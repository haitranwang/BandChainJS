const { Client } = require('@bandprotocol/bandchain.js')
// Step 1
const grpcUrl = 'https://laozi-testnet6.bandchain.org/grpc-web' // ex.https://laozi-testnet6.bandchain.org/grpc-web
const client = new Client(grpcUrl)

// Step 2
const minCount = 3
const askCount = 4
const pairs = ['BTC/USD', 'ETH/USD'];

(async () => {
    console.log(JSON.stringify(await client.getReferenceData(pairs, minCount, askCount)))
})()