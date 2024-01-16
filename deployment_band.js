const { Client, Wallet, Message, Coin, Transaction, Fee } = require('@bandprotocol/bandchain.js')
const fs = require('fs')
const path = require('path')

// Setup the client
const grpcURL = 'https://laozi-testnet6.bandchain.org/grpc-web'
const client = new Client(grpcURL)

async function createDataSource() {
    // Setup the wallet
    const { PrivateKey } = Wallet
    const mnemonic = 'opera barely inside smart roof bargain among announce fitness useful media attitude'
    const privateKey = PrivateKey.fromMnemonic(mnemonic)
    const publicKey = privateKey.toPubkey()
    const sender = publicKey.toAddress().toAccBech32()

    // Setup the transaction's properties
    const chainId = await client.getChainId()
    const execPath = path.resolve(__dirname, 'gold_price.py')
    const file = fs.readFileSync(execPath, 'utf8')
    const executable = Buffer.from(file).toString('base64')

    let feeCoin = new Coin()
    feeCoin.setDenom('uband')
    feeCoin.setAmount('50000')

    const requestMessage = new Message.MsgCreateDataSource(
    'AURA Price!', // Data source name
    executable, // Data source executable
    sender, // Treasury address
    sender, // Owner address
    sender, // Sender address
    [feeCoin], // Fee
    '' // Data source description
    )

  // Construct the transaction
    const fee = new Fee()
    fee.setAmountList([feeCoin])
    fee.setGasLimit(80000)

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
    console.log(await createDataSource())
})()


// {
//     height: 13820459,
//     txhash: '328160CDAF51DEBAB16B6ABF4C5181F37074FDC47E4900318B53AEE8AF26BB36',
//     codespace: '',
//     code: 0,
//     data: '0A200A1E2F6F7261636C652E76312E4D736743726561746544617461536F75726365',
//     rawLog: '[{"events":[{"type":"create_data_source","attributes":[{"key":"id","value":"719"}]},{"type":"message","attributes":[{"key":"action","value":"/oracle.v1.MsgCreateDataSource"}]}]}]',
//     logsList: [ { msgIndex: 0, log: '', eventsList: [Array] } ],
//     info: '',
//     gasWanted: 80000,
//     gasUsed: 70479,
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
//       { type: 'create_data_source', attributesList: [Array] }
//     ]
//   }


// {
//   height: 13972908,
//   txhash: '5FED1BA518F617E55C2105929E0D513AB92C0F6A4A7758B5D1791A988F5F93CE',
//   codespace: '',
//   code: 0,
//   data: '0A200A1E2F6F7261636C652E76312E4D736743726561746544617461536F75726365',
//   rawLog: '[{"events":[{"type":"create_data_source","attributes":[{"key":"id","value":"730"}]},{"type":"message","attributes":[{"key":"action","value":"/oracle.v1.MsgCreateDataSource"}]}]}]',
//   logsList: [ { msgIndex: 0, log: '', eventsList: [Array] } ],
//   info: '',
//   gasWanted: 80000,
//   gasUsed: 73354,
//   tx: undefined,
//   timestamp: '',
//   eventsList: [
//     { type: 'coin_spent', attributesList: [Array] },
//     { type: 'coin_received', attributesList: [Array] },
//     { type: 'transfer', attributesList: [Array] },
//     { type: 'message', attributesList: [Array] },
//     { type: 'tx', attributesList: [Array] },
//     { type: 'tx', attributesList: [Array] },
//     { type: 'tx', attributesList: [Array] },
//     { type: 'message', attributesList: [Array] },
//     { type: 'create_data_source', attributesList: [Array] }
//   ]
// }