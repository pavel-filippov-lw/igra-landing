---
name: igra-network
version: 1.0.0
description: Build and test on IGRA Network — EVM-compatible L2 on Kaspa. Connect to RPC, get iKAS from faucet, deploy contracts, stress-test the chain.
homepage: https://igralabs.com
metadata: {"network":"IGRA Galleon Test Mainnet","chainId":38837,"currency":"iKAS","rpc":"https://galleon.igralabs.com:8545","explorer":"https://explorer.galleon.igralabs.com"}
---

# IGRA Network

IGRA is a high-performance EVM-compatible blockchain built on Kaspa's BlockDAG proof-of-work. Sub-second block times, ~30s finality, full Ethereum tooling compatibility.

## Network Details

| Parameter | Value |
|-----------|-------|
| **Network Name** | IGRA Galleon Test Mainnet |
| **Chain ID** | 38837 (0x97B5) |
| **Currency** | iKAS (18 decimals) |
| **RPC** | `https://galleon.igralabs.com:8545` |
| **Explorer** | `https://explorer.galleon.igralabs.com` |
| **Block Time** | ~1 second |
| **Finality** | ~30 seconds |
| **EIP-1559** | Supported |
| **Gas Price** | ~1000 Gwei |
| **Docs** | `https://igra-labs.gitbook.io/igralabs-docs/` |

**Testnet also available:**

| Parameter | Value |
|-----------|-------|
| **Network Name** | IGRA Galleon Testnet |
| **Chain ID** | 38836 (0x97B4) |
| **RPC** | `https://galleon-testnet.igralabs.com:8545` |

## Important: Read This First

1. **HTTPS only** — plain HTTP connections are refused. Always use `https://`.
2. **Legacy transactions** — use type 0 transactions with explicit gas price. EIP-1559 defaults from ethers.js are too low and will fail.
3. **Fetch gas price** — always query the network for current gas price before sending transactions.
4. **Standard JSON-RPC** — all Ethereum JSON-RPC methods work. Compatible with ethers.js, web3.js, viem, and any EVM tooling.

---

## Connect to RPC

Verify the node is reachable:

```bash
curl -s -X POST https://galleon.igralabs.com:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

Check gas price:

```bash
curl -s -X POST https://galleon.igralabs.com:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}'
```

Check balance of any address:

```bash
curl -s -X POST https://galleon.igralabs.com:8545 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["0xADDRESS","latest"],"id":1}'
```

The hex result is in wei. Divide by 10^18 to get iKAS.

---

## Get iKAS from Faucet

The faucet uses EIP-191 signed-challenge authentication. You need a wallet (private key) to prove ownership before receiving tokens.

**Faucet URL:** `https://ikas-faucet-ecee9345b515.herokuapp.com`

**Limits:** 1 iKAS per request, 10 iKAS per day per address.

### Faucet API

**Check status:**
```bash
curl -s https://ikas-faucet-ecee9345b515.herokuapp.com/api/status
```

**Request challenge:**
```bash
curl -s -X POST https://ikas-faucet-ecee9345b515.herokuapp.com/api/challenge \
  -H "Content-Type: application/json" \
  -d '{"address": "0xYOUR_ADDRESS"}'
```

**Sign challenge and request drip:**
```bash
curl -s -X POST https://ikas-faucet-ecee9345b515.herokuapp.com/api/drip \
  -H "Content-Type: application/json" \
  -d '{"address":"0xYOUR_ADDRESS","signature":"0xSIGNATURE","challenge":"CHALLENGE_STRING"}'
```

### Complete Example (ethers.js v6)

Generate a wallet, get funded, check balance — all in one:

```javascript
const { Wallet, JsonRpcProvider } = require('ethers');
const FAUCET = 'https://ikas-faucet-ecee9345b515.herokuapp.com';
const RPC = 'https://galleon.igralabs.com:8545';

async function fundNewWallet() {
  // 1. Create wallet
  const wallet = Wallet.createRandom();
  console.log('Address:', wallet.address);
  console.log('Private Key:', wallet.privateKey);

  // 2. Request challenge
  const { challenge } = await fetch(FAUCET + '/api/challenge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: wallet.address })
  }).then(r => r.json());

  // 3. Sign and claim
  const signature = await wallet.signMessage(challenge);
  const drip = await fetch(FAUCET + '/api/drip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: wallet.address, signature, challenge })
  }).then(r => r.json());

  console.log('Funded:', drip.amount, '| TX:', drip.txHash);

  // 4. Verify balance
  const provider = new JsonRpcProvider(RPC, { name: 'igra', chainId: 38837 });
  const balance = await provider.getBalance(wallet.address);
  console.log('Balance:', Number(balance) / 1e18, 'iKAS');
}
```

---

## Send Transactions

The key pattern for all transactions on IGRA — fetch gas price and use legacy type:

```javascript
const { Wallet, JsonRpcProvider, parseEther } = require('ethers');

const provider = new JsonRpcProvider('https://galleon.igralabs.com:8545', {
  name: 'igra', chainId: 38837
});
const wallet = new Wallet('YOUR_PRIVATE_KEY', provider);

async function send(to, amountInIkas) {
  const gasPrice = (await provider.getFeeData()).gasPrice;
  const tx = await wallet.sendTransaction({
    to,
    value: parseEther(amountInIkas),
    type: 0,
    gasPrice,
  });
  const receipt = await tx.wait(1);
  console.log('TX:', tx.hash, '| Gas:', receipt.gasUsed.toString());
}
```

---

## Deploy Smart Contracts

Any Solidity contract that works on Ethereum works on IGRA. Use ethers.js ContractFactory:

```javascript
const { Wallet, JsonRpcProvider, ContractFactory } = require('ethers');

const provider = new JsonRpcProvider('https://galleon.igralabs.com:8545', {
  name: 'igra', chainId: 38837
});
const wallet = new Wallet('YOUR_PRIVATE_KEY', provider);

async function deploy(abi, bytecode, constructorArgs) {
  const gasPrice = (await provider.getFeeData()).gasPrice;
  const factory = new ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy(...constructorArgs, { gasPrice, type: 0 });
  console.log('Deploy TX:', contract.deploymentTransaction().hash);
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log('Contract:', address);
  console.log('Explorer:', 'https://explorer.galleon.igralabs.com/address/' + address);
  return address;
}
```

### Pre-compiled Test ERC-20

A ready-to-deploy ERC-20 token contract is available. Constructor takes `(string name, string symbol, uint256 initialSupply)` — mints `initialSupply * 10^18` to deployer.

```bash
curl -s https://ikas-faucet-ecee9345b515.herokuapp.com/contracts/TestToken.json -o TestToken.json
```

Deploy it:
```javascript
const artifact = require('./TestToken.json');
await deploy(artifact.abi, artifact.bytecode, ['MyToken', 'MTK', 1000000]);
```

---

## Stress Test the Network

Once you have a funded wallet and a deployed ERC-20, send batch transactions to measure throughput:

```javascript
const { Wallet, JsonRpcProvider, Contract, parseEther } = require('ethers');

const provider = new JsonRpcProvider('https://galleon.igralabs.com:8545', {
  name: 'igra', chainId: 38837
});
const wallet = new Wallet('YOUR_PRIVATE_KEY', provider);
const artifact = require('./TestToken.json');
const token = new Contract('CONTRACT_ADDRESS', artifact.abi, wallet);

async function stressTest(count) {
  const gasPrice = (await provider.getFeeData()).gasPrice;
  let ok = 0, fail = 0, totalGas = 0n;
  const start = Date.now();

  for (let i = 0; i < count; i++) {
    try {
      const tx = await token.transfer(
        Wallet.createRandom().address,
        parseEther('1'),
        { gasPrice, type: 0 }
      );
      const r = await tx.wait(1);
      totalGas += r.gasUsed;
      ok++;
    } catch {
      fail++;
    }
  }

  const elapsed = (Date.now() - start) / 1000;
  console.log(`Done: ${ok} success, ${fail} failed`);
  console.log(`Time: ${elapsed.toFixed(1)}s (${(elapsed/ok).toFixed(2)}s/tx)`);
  console.log(`Gas: ${totalGas} total, ${ok > 0 ? totalGas/BigInt(ok) : 0} avg/tx`);
}
```

### What to Measure

- **Throughput** — transactions per second the network handles
- **Latency** — time from submission to confirmation
- **Gas usage** — cost per operation type (transfer, deploy, contract call)
- **Finality** — time until transaction is considered irreversible (~30s)
- **Concurrent load** — run multiple wallets in parallel for higher throughput

### Parallel Stress Test

For higher throughput, fund multiple wallets and send concurrently:

```javascript
async function parallelStress(walletCount, txPerWallet) {
  // Fund walletCount wallets from faucet, then run stressTest
  // on each wallet concurrently with Promise.all
  const wallets = [];
  for (let i = 0; i < walletCount; i++) {
    const w = Wallet.createRandom().connect(provider);
    // ... fund each wallet via faucet ...
    wallets.push(w);
  }
  await Promise.all(wallets.map(w => stressTest(txPerWallet)));
}
```

---

## Tools & Compatibility

IGRA supports the standard Ethereum ecosystem:

| Tool | Works? | Notes |
|------|--------|-------|
| **ethers.js v6** | Yes | Use `type: 0` + explicit `gasPrice` |
| **web3.js** | Yes | Same gas price considerations |
| **viem** | Yes | Set `type: 'legacy'` in transactions |
| **Hardhat** | Yes | Configure custom network in `hardhat.config.js` |
| **Foundry/Forge** | Yes | Use `--legacy` flag for transactions |
| **MetaMask** | Yes | Add custom network with RPC and Chain ID |
| **Blockscout** | Yes | Explorer at `explorer.galleon.igralabs.com` |
| **OpenZeppelin** | Yes | All standard contracts work |

### Hardhat Config Example

```javascript
module.exports = {
  networks: {
    igra: {
      url: "https://galleon.igralabs.com:8545",
      chainId: 38837,
      accounts: ["0xYOUR_PRIVATE_KEY"],
    }
  }
};
```

### Foundry Example

```bash
forge create --rpc-url https://galleon.igralabs.com:8545 \
  --chain-id 38837 \
  --private-key YOUR_PRIVATE_KEY \
  --legacy \
  src/MyContract.sol:MyContract
```

---

## Resources

| Resource | URL |
|----------|-----|
| **IGRA Website** | `https://igralabs.com` |
| **Documentation** | `https://igra-labs.gitbook.io/igralabs-docs/` |
| **Explorer** | `https://explorer.galleon.igralabs.com` |
| **Faucet** | `https://ikas-faucet-ecee9345b515.herokuapp.com` |
| **Faucet Source** | `https://github.com/emdin/ikas-faucet` |
| **Test ERC-20 Artifact** | `https://ikas-faucet-ecee9345b515.herokuapp.com/contracts/TestToken.json` |