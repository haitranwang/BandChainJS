const { Client, Wallet, Message, Coin, Transaction, Fee } = require('@bandprotocol/bandchain.js')
const fs = require('fs')
const path = require('path')

const grpcURL = 'https://laozi-testnet6.bandchain.org/grpc-web'
const client = new Client(grpcURL)

// Setup the client
async function requestMessageDataFromBandChain() {
    // Setup the wallet
    const { PrivateKey } = Wallet
    const mnemonic = 'opera barely inside smart roof bargain among announce fitness useful media attitude'
    const privateKey = PrivateKey.fromMnemonic(mnemonic)
    const publicKey = privateKey.toPubkey()
    const sender = publicKey.toAddress().toAccBech32()

    // Setup the transaction's properties
    const chainId = await client.getChainId()
    const oracleScriptID = 472
    const calldata = '{"repeat": 1}'
    const askCount = 2
    const minCount = 1
    const feeLimit = 500000
    const clientId = 'from_bandchain.js'

    console.log(chainId)
    console.log(oracleScriptID)
    console.log(calldata)
    console.log(askCount)
    console.log(minCount)
    console.log(feeLimit)
    console.log(sender)

    const requestMessage = new Message.MsgRequestData(
        oracleScriptID, // oracle script id
        calldata, // calldata
        askCount, // ask count
        minCount, // min count
        sender, // sender
        feeLimit // fee limit
    )

    // Construct the transaction
    const fee = new Fee()
    fee.setAmountList([])
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
    console.log(await requestMessageDataFromBandChain())
})()