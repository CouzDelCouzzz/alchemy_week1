const secp = require("ethereum-cryptography/secp256k1")
const { keccak256 } = require("ethereum-cryptography/keccak")
const { utf8ToBytes } = require("ethereum-cryptography/utils")

// This script is used to sign a message with a private key from my local hardhat node
/**
 * This script is used to sign a message with a private key generated from the script server/scripts/generate.js.
 * @ RECIPIENT: the address to send the amount to
 * @ AMOUNT: the amount to send
 * @ privateKey: the privateKey that will be used to sign the message
 * @ publicKey: the publicKey associated to the privateKey
 */

const RECIPIENT =
    "048fa63a6e1ce4cf30c30af0f6f88a20dd5d21da0c2ad77b5139320ae57c1de00fdb230de2a44d0aa9a447a2681d0e6326317dc917b1db08fa9a8456a58a8ed6c0"
const AMOUNT = 10
const privateKey = "18bff94520d51ef360113b0699b4a8f24213c19e490de4035f2a704a580268ab"
const publicKey =
    "04fadbfb98d9326feb4b38fb7fb9b11e025aa62ae7847b92c0cb282ab864707d72f7f6179f6ece94184dbaad00aa16a094a38853c13d31ef0c0e9742d2cf201d89"

message = `Send ${AMOUNT} to ${RECIPIENT}`

async function signMessage() {
    // First we have to hash the message
    const bytesMsg = utf8ToBytes(message)
    const hashMsg = keccak256(bytesMsg)

    // Next we need to sign it -> HERE we pass the privateKey as param but it's very dangerous!
    // IRL the sender will sign the transaction and only send the signature
    const signedMsg = await secp.sign(hashMsg, privateKey, { recovered: true })
    const [signature, recoveryBit] = signedMsg

    // We need to output those variables as we need them to validate that the correct privatekey signed the message
    console.log(`Signature: ${signature}`)
    console.log(`Recovery bit: ${recoveryBit}`)
    console.log(`Value to be transfered: ${AMOUNT}`)
    console.log(`Address to send to (recipient): ${RECIPIENT}`)
}

module.exports = { signMessage }

signMessage()
