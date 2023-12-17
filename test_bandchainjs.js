// opera barely inside smart roof bargain among announce fitness useful media attitude
const { Client, Wallet, Obi, Message, Coin, Transaction, Fee } = require ('@bandprotocol/bandchain.js')

const grpcUrl = 'https://laozi-testnet6.bandchain.org/grpc-web' // ex.https://laozi-testnet6.bandchain.org/grpc-web
const client = new Client(grpcUrl)

async function makeRequest() {
  // Step 1: Import a private key for signing transaction
  const { PrivateKey } = Wallet
  const mnemonic = 'opera barely inside smart roof bargain among announce fitness useful media attitude'
  const privateKey = PrivateKey.fromMnemonic(mnemonic)
  const pubkey = privateKey.toPubkey()
  const sender = pubkey.toAddress().toAccBech32()
  console.log(sender)
  // Step 2.1: Prepare oracle request's properties
  const obi = new Obi('{symbols:[string],multiplier:u64}/{rates:[u64]}')
  const calldata = obi.encodeInput({ symbols: ['ETH'], multiplier: 100 })

  const oracleScriptId = 37
  const askCount = 4
  const minCount = 3
  const clientId = 'from_bandchain.js'

  let feeLimit = new Coin()
  feeLimit.setDenom('uband')
  feeLimit.setAmount('100000')

  const prepareGas = 100000
  const executeGas = 200000

  // Step 2.2: Create an oracle request message
  const requestMessage = new Message.MsgRequestData(
    oracleScriptId,
    calldata,
    askCount,
    minCount,
    clientId,
    sender,
    [feeLimit],
    prepareGas,
    executeGas
  )

  let feeCoin = new Coin()
  feeCoin.setDenom('uband')
  feeCoin.setAmount('50000')

  // Step 3.1: Construct a transaction
  const fee = new Fee()
  fee.setAmountList([feeCoin])
  fee.setGasLimit(1000000)

  const chainId = await client.getChainId()
  const txn = new Transaction()
  txn.withMessages(requestMessage)
  await txn.withSender(client, sender)
  txn.withChainId(chainId)
  txn.withFee(fee)
  txn.withMemo('')

  // Step 3.2: Sign the transaction using the private key
  const signDoc = txn.getSignDoc(pubkey)
  const signature = privateKey.sign(signDoc)

  const txRawBytes = txn.getTxData(signature, pubkey)

  // Step 4: Broadcast the transaction
  const sendTx = await client.sendTxBlockMode(txRawBytes)
  console.log(sendTx)
}

;(async () => {
  await makeRequest()
})()