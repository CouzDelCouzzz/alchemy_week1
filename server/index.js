const express = require("express")
const app = express()
const cors = require("cors")
const port = 3042
const secp = require("ethereum-cryptography/secp256k1")
const { toHex } = require("ethereum-cryptography/utils")
const { utf8ToBytes } = require("ethereum-cryptography/utils")
const { keccak256 } = require("ethereum-cryptography/keccak")

app.use(cors())
app.use(express.json())

const balances = {
    "048fa63a6e1ce4cf30c30af0f6f88a20dd5d21da0c2ad77b5139320ae57c1de00fdb230de2a44d0aa9a447a2681d0e6326317dc917b1db08fa9a8456a58a8ed6c0": 100,
    "04d63104daaa46b9f21bbaba9cca68e45a0597a2285ebd3ca65b178a313dec7b107229aadf17ae3a3e5a8625ff429a8ef4723b002124ef3e688ddf2e3d1519a3c5": 50,
    "04fadbfb98d9326feb4b38fb7fb9b11e025aa62ae7847b92c0cb282ab864707d72f7f6179f6ece94184dbaad00aa16a094a38853c13d31ef0c0e9742d2cf201d89": 75,
}

app.get("/balance/:address", (req, res) => {
    const { address } = req.params
    const balance = balances[address] || 0
    res.send({ balance })
})

app.post("/send", (req, res) => {
    const { sender, recipient, amount, signature, recoveryBit } = req.body

    setInitialBalance(sender)
    setInitialBalance(recipient)

    // Will hash the messge
    const message = `Send ${amount} to ${recipient}`
    const bytesMsg = utf8ToBytes(message)
    const hashMsg = keccak256(bytesMsg)

    // Transform the signature into the right format
    let signatureToIntArray
    let recoveryBitNumber
    let publicKey

    try {
        var signatureToArray = signature.replace(" ", "").split(",")
        signatureToIntArray = Uint8Array.from(signatureToArray)
        recoveryBitNumber = parseInt(recoveryBit, 10)

        publicKey = secp.recoverPublicKey(hashMsg, signatureToIntArray, recoveryBitNumber)
    } catch (error) {
        res.status(400).send({
            message: "Please enter the signature and the recovery bit in the correct format.",
        })
    }

    if (sender != toHex(publicKey)) {
        res.status(400).send({ message: "The signature provided doesn't match" })
    }
    if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" })
    } else {
        balances[sender] -= amount
        balances[recipient] += amount
        res.send({ balance: balances[sender] })
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
})

function setInitialBalance(address) {
    if (!balances[address]) {
        balances[address] = 0
    }
}
