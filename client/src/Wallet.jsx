import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1';
import {toHex} from 'ethereum-cryptography/utils'

function Wallet({ address, setAddress, balance, setBalance, signature, setSignature, recoveryBit, setRecoveryBit }) {
  async function onChange(evt) {
    // const privateKey = evt.target.value;
    // setPrivateKey(privateKey);
    // const address = toHex(secp.getPublicKey(privateKey))

    const address = evt.target.value;
    setAddress(address)
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }
  async function onChangeSign(evt){
    const signature = evt.target.value;
    setSignature(signature)
  }
  async function onChangeRecovery(evt){
    const recoveryBit = evt.target.value;
    setRecoveryBit(recoveryBit)
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Public Key 
        <input placeholder="Type in a public key, for example: 0x1" value={address} onChange={onChange}></input>
      </label>

      <label>
        Signature 
        <input placeholder="Signature, for example: 0x1" value={signature} onChange={onChangeSign}></input>
      </label>
      <label>
        Recovery Bit 
        <input placeholder="Recovery bit of the signature" value={recoveryBit} onChange={onChangeRecovery}></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
