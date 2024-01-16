const { Client, Wallet, Message, Coin, Transaction, Fee } = require('@bandprotocol/bandchain.js')
const fs = require('fs')
const path = require('path')

const grpcURL = 'https://laozi-testnet6.bandchain.org/grpc-web'
const client = new Client(grpcURL)

// Setup the client
async function createOracleScript() {
    // Setup the wallet
    const { PrivateKey } = Wallet
    const mnemonic = 'opera barely inside smart roof bargain among announce fitness useful media attitude'
    const privateKey = PrivateKey.fromMnemonic(mnemonic)
    const publicKey = privateKey.toPubkey()
    const sender = publicKey.toAddress().toAccBech32()

    // Setup the transaction's properties
    const chainId = await client.getChainId()
    const execPath = path.resolve(__dirname, 'aura_price.wasm')
    const code = fs.readFileSync(execPath)

    let feeCoin = new Coin()
    feeCoin.setDenom('uband')
    feeCoin.setAmount('500000')

    const requestMessage = new Message.MsgCreateOracleScript(
        'AURA Price!', // oracle script name
        code, // oracle script code
        sender, // owner
        sender, // sender
        '', // description
        '{repeat:u64}/{response:string}', // schema
        'https://ipfs.io/ipfs/bafkreicunelr7emttgaxbc2kx76qyeuwkwro42lairhoaphfi7lw3sjg24' // source code url
    )

    // Construct the transaction
    const fee = new Fee()
    fee.setAmountList([feeCoin])
    fee.setGasLimit(500000)

    const txn = new Transaction()
    txn.withMessages(requestMessage)
    await txn.withSender(client, sender)
    txn.withChainId(chainId)
    txn.withFee(fee)
    txn.withMemo('')

    // Sign the transaction
    const signDoc = txn.getSignDoc(publicKey)
    const signature = privateKey.sign(signDoc)
    const txRawBytes = txn.getTxData(signature, publicKey)

    // Broadcast the transaction
    const sendTx = await client.sendTxBlockMode(txRawBytes)

    return sendTx
}

;(async () => {
    console.log(await createOracleScript())
})()



// {
//     height: 13947999,
//     txhash: '179ABD8179DF262579DDEF2A83C4005B842A975CC40841CF16D55C692536CDA3',
//     codespace: '',
//     code: 0,
//     data: '0A220A202F6F7261636C652E76312E4D73674372656174654F7261636C65536372697074',
//     rawLog: '[{"events":[{"type":"create_oracle_script","attributes":[{"key":"id","value":"472"}]},{"type":"message","attributes":[{"key":"action","value":"/oracle.v1.MsgCreateOracleScript"}]}]}]',
//     logsList: [ { msgIndex: 0, log: '', eventsList: [Array] } ],
//     info: '',
//     gasWanted: 500000,
//     gasUsed: 459570,
//     tx: undefined,
//     timestamp: '',
//     eventsList: [
//       { type: 'coin_spent', attributesList: [Array] },
//       { type: 'coin_received', attributesList: [Array] },
//       { type: 'transfer', attributesList: [Array] },
//       { type: 'message', attributesList: [Array] },
//       { type: 'tx', attributesList: [Array] },
//       { type: 'tx', attributesList: [Array] },
//       { type: 'tx', attributesList: [Array] },
//       { type: 'message', attributesList: [Array] },
//       { type: 'create_oracle_script', attributesList: [Array] }
//     ]
//   }