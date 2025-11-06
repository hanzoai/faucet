# Hanzo Network Faucet

Modern faucet for distributing test tokens on Hanzo Network - The AI Compute L1 blockchain.

Hanzo Network is a Layer 1 blockchain designed for AI compute workloads, featuring:
- **Proof of AI (PoAI)** consensus mechanism
- **Hamiltonian Market Maker (HMM)** for AI compute pricing
- **Native $AI token** for transactions and compute payments
- **EVM compatibility** for seamless DApp integration

This faucet supports both Hanzo Network Mainnet (Chain ID: 36963) and Testnet (Chain ID: 36962).

## Features

- 🚀 Modern Next.js 16 + React 19 frontend
- 🔐 RainbowKit wallet integration with wagmi v2 and viem v2
- 🤖 Google reCAPTCHA v3 verification
- ⚡ Rate limiting per address and global
- 🎨 Beautiful UI with Tailwind CSS 4
- 📱 Responsive design for all devices

## TL;DR

Get free test tokens for Hanzo Network:

* Request test AI tokens for Hanzo Testnet or Mainnet
* Connect your wallet with RainbowKit or enter an address manually
* Protected by rate limiting and captcha verification

## Network Configuration

The faucet is configured for Hanzo Network chains in `config.json`. The following parameters define each network:

```json
{
    "ID": "string",
    "NAME": "string",
    "TOKEN": "string",
    "RPC": "string",
    "CHAINID": "number",
    "EXPLORER": "string",
    "IMAGE": "string",
    "MAX_PRIORITY_FEE": "string",
    "MAX_FEE": "string",
    "DRIP_AMOUNT": "number",
    "RATELIMIT": {
        "MAX_LIMIT": "number",
        "WINDOW_SIZE": "number"
    }
}
```

* **ID** - Unique identifier (e.g., `HANZO_TESTNET`, `HANZO_MAINNET`)
* **NAME** - Display name shown in the UI
* **TOKEN** - Native token symbol (AI for Hanzo Network)
* **RPC** - RPC endpoint URL
* **CHAINID** - EVM chain ID (36962 for testnet, 36963 for mainnet)
* **EXPLORER** - Block explorer base URL
* **IMAGE** - Logo image URL
* **MAX_PRIORITY_FEE** - Maximum priority fee in wei (EIP-1559)
* **MAX_FEE** - Maximum total fee in wei
* **DRIP_AMOUNT** - Tokens to send per request
* **DECIMALS** - Token decimals (18 for AI)
* **RECALIBRATE** - Nonce recalibration interval in seconds
* **RATELIMIT** - Request limits (MAX_LIMIT per WINDOW_SIZE minutes)

Configuration is in `config.json` at the repository root.

## Building and Deploying

### Requirements

* [Node.js](https://nodejs.org/en) >= 17.0
* [pnpm](https://pnpm.io/) >= 8.0.0 (preferred package manager)
* [Google's ReCaptcha](https://www.google.com/recaptcha/intro/v3.html) v3 keys
* Wallet with AI tokens on Hanzo Network

### Installation

```bash
git clone https://github.com/hanzoai/faucet
cd faucet
pnpm install
```

### Frontend Configuration

The frontend is built with Next.js 16 and uses environment variables for configuration. Create `app/.env.local`:

```bash
# API endpoint (defaults to http://localhost:8000 in development)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Google ReCaptcha v3 Site Key (public key)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
```

The frontend runs on port 3000 by default and communicates with the backend API on port 8000.

### Server-Side Configurations

On the server side, we need to configure 2 files - `.env` for secret keys and `config.json` for chain and API's rate limiting configurations.

#### Setup Environment Variables

Create a `.env` file in the repository root with your private keys and ReCaptcha secret:

```env
# Wallet private key with AI tokens (required)
PK="your_private_key_here"

# Chain-specific keys (optional - PK is used as fallback)
HANZO_TESTNET="your_testnet_private_key"
HANZO_MAINNET="your_mainnet_private_key"

# Google ReCaptcha Secret (required)
CAPTCHA_SECRET="your_recaptcha_v3_secret_key"

# Optional: Server port (defaults to 8000)
PORT=8000
```

Generate a new wallet:
```bash
pnpm generate
```

#### Chain Configuration

Hanzo Network chains are pre-configured in `config.json`:

```json
"evmchains": [
    {
        "ID": "HANZO_TESTNET",
        "NAME": "Hanzo Network Testnet",
        "TOKEN": "AI",
        "RPC": "https://rpc-testnet.hanzo.network",
        "CHAINID": 36962,
        "EXPLORER": "https://explorer-testnet.hanzo.network",
        "IMAGE": "https://hanzo.ai/logo.png",
        "MAX_PRIORITY_FEE": "2000000000",
        "MAX_FEE": "100000000000",
        "DRIP_AMOUNT": 10,
        "DECIMALS": 18,
        "RECALIBRATE": 30,
        "RATELIMIT": {
            "MAX_LIMIT": 1,
            "WINDOW_SIZE": 1440
        }
    },
    {
        "ID": "HANZO_MAINNET",
        "NAME": "Hanzo Network Mainnet",
        "TOKEN": "AI",
        "RPC": "https://rpc.hanzo.network",
        "CHAINID": 36963,
        "EXPLORER": "https://explorer.hanzo.network",
        "IMAGE": "https://hanzo.ai/logo.png",
        "MAX_PRIORITY_FEE": "2000000000",
        "MAX_FEE": "100000000000",
        "DRIP_AMOUNT": 1,
        "DECIMALS": 18,
        "RECALIBRATE": 30,
        "RATELIMIT": {
            "MAX_LIMIT": 1,
            "WINDOW_SIZE": 2880
        }
    }
]
```

**Configuration Details:**
- Testnet: 10 AI tokens per request, 1 request per 24 hours
- Mainnet: 1 AI token per request, 1 request per 48 hours
- All fees specified in wei (10^-18 AI)
- Rate limits prevent abuse while allowing legitimate testing

### API Endpoints

This server will expose the following APIs

#### Health API

The `/health` API will always return a response with a `200` status code. This endpoint can be used to know the health of the server.

```bash
curl http://localhost:8000/health
```

Response

```bash
Server healthy
```

#### Get Faucet Address

This API will be used for fetching the faucet address.

```bash
curl http://localhost:8000/api/faucetAddress?chain=C
```

It will give the following response

```bash
0x3EA53fA26b41885cB9149B62f0b7c0BAf76C78D4
```

#### Get Faucet Balance

This API will be used for fetching the faucet address.

```bash
curl http://localhost:8000/api/getBalance?chain=C
```

It will give the following response

```bash
14282900936
```

#### Send Token

This API endpoint will handle token requests from users. It will return the transaction hash as a receipt of the faucet drip.

```bash
curl -d '{
        "address": "0x3EA53fA26b41885cB9149B62f0b7c0BAf76C78D4"
        "chain": "C"
}' -H 'Content-Type: application/json' http://localhost:8000/api/sendToken
```

Send token API requires a Captcha response token that is generated using the Captcha site key on the client-side. Since we can't generate and pass this token while making a curl request, we have to disable the captcha verification for testing purposes. You can find the steps to disable it in the next sections. The response is shown below

```bash
{
    "message": "Transaction successful on LUX EVM!",
    "txHash": "0x3d1f1c3facf59c5cd7d6937b3b727d047a1e664f52834daf20b0555e89fc8317"
}
```

### Rate Limiters (Important)

The rate limiters are applied on the global (all endpoints) as well as on the `/api/sendToken` API. These can be configured from the `config.json` file. Rate limiting parameters for chains are passed in the chain configuration as shown above.

```json
"GLOBAL_RL": {
    "ID": "GLOBAL",
    "RATELIMIT": {
        "REVERSE_PROXIES": 4,
        "MAX_LIMIT": 40,
        "WINDOW_SIZE": 1,
        "PATH": "/",
        "SKIP_FAILED_REQUESTS": false
    }
}
```

There could be multiple proxies between the server and the client. The server will see the IP address of the adjacent proxy connected with the server, and this may not be the client's actual IP.

The IPs of all the proxies that the request has hopped through are stuffed inside the header **x-forwarded-for** array. But the proxies in between can easily manipulate these headers to bypass rate limiters. So, we cannot trust all the proxies and hence all the IPs inside the header.

The proxies that are set up by the owner of the server (reverse-proxies) are the trusted proxies on which we can rely and know that they have stuffed the actual IP of the requesters in between. Any proxy that is not set up by the server, should be considered an untrusted proxy. So, we can jump to the IP address added by the last proxy that we trust. The number of jumps that we want can be configured in the `config.json` file inside the `GLOBAL_RL` object.

![](https://raw.githubusercontent.com/luxdefi/docs/master/static/img/faucet-5.png)



#### Clients Behind Same Proxy

Consider the below diagram. The server is set up with 2 reverse proxies. If the client is behind proxies, then we cannot get the client's actual IP, and instead will consider the proxy's IP as the client's IP. And if some other client is behind the same proxy, then those clients will be considered as a single entity and might get rate-limited faster.

![](https://raw.githubusercontent.com/luxdefi/docs/master/static/img/faucet-6.png)


Therefore it is advised to the users, to avoid using any proxy for accessing applications that have critical rate limits, like this faucet.

#### Wrong Number of Reverse Proxies

So, if you want to deploy this faucet, and have some reverse proxies in between, then you should configure this inside the `GLOBAL_RL` key of the `config.json` file. If this is not configured properly, then the users might get rate-limited very frequently, since the server-side proxy's IP addresses are being viewed as the client's IP. You can verify this in the code [here](https://github.com/luxdefi/faucet/blob/23eb300635b64130bc9ce10d9e894f0a0b3d81ea/middlewares/rateLimiter.ts#L25).

```json
"GLOBAL_RL": {
    "ID": "GLOBAL",
    "RATELIMIT": {
        "REVERSE_PROXIES": 4,
        ...
```

![](https://raw.githubusercontent.com/luxdefi/docs/master/static/img/faucet-7.png)


It is also quite common to have Cloudflare as the last reverse proxy or the exposed server. Cloudflare provides a header **cf-connecting-ip** which is the IP of the client that requested the faucet and hence Cloudflare. We are using this as default.

### Captcha Verification

Captcha is required to prove the user is a human and not a bot. For this purpose, we will use [Google's Recaptcha](https://www.google.com/recaptcha/intro/v3.html). The server side will require `CAPTCHA_SECRET` that should not be exposed. You can set the threshold score to pass the captcha test by the users [here](https://github.com/luxdefi/faucet/blob/23eb300635b64130bc9ce10d9e894f0a0b3d81ea/middlewares/verifyCaptcha.ts#L20).

You can disable these Captcha verifications and rate limiters for testing the purpose, by tweaking in the `server.ts` file.

### Disabling Rate Limiters

Comment or remove these 2 lines from the `server.ts` file

```javascript
new RateLimiter(app, [GLOBAL_RL]);
new RateLimiter(app, evmchains);
```

### Disabling Captcha Verification

Remove the  `captcha.middleware` from `sendToken` API.

### Development Workflow

#### Start Backend (Port 8000)
```bash
pnpm dev
```

#### Start Frontend (Port 3000)
```bash
pnpm dev:app
```

#### Start Both Concurrently
```bash
pnpm dev:all
```

#### Build for Production
```bash
pnpm build
```

#### Start Production Server
```bash
pnpm start
```

The frontend will be available at http://localhost:3000 and the backend API at http://localhost:8000.

### Setting up with Docker

Follow the steps to run this application in a Docker container.

#### Build Docker Image

Docker images can be served as the built versions of our application, that can be used to deploy on Docker container.

```bash
docker build . -t faucet-image
```

#### Starting Application inside Docker Container

Now we can create any number of containers using the above `faucet` image. We also have to supply the `.env` file or the environment variables with the secret keys to create the container. Once the container is created, these variables and configurations will be persisted and can be easily started or stopped with a single command.

```bash
docker run -p 3000:8000 --name faucet-container --env-file ../.env faucet-image
```

The server will run on port 8000, and our Docker will also expose this port for the outer world to interact. We have exposed this port in the `Dockerfile`. But we cannot directly interact with the container port, so we had to bind this container port to our host port. For the host port, we have chosen 3000. This flag `-p 3000:8000` achieves the same.

This will start our faucet application in a Docker container at port 3000 (port 8000 on the container). You can interact with the application by visiting http://localhost:3000 in your browser.

#### Stopping the Container

You can easily stop the container using the following command

```bash
docker stop faucet-container
```

#### Restarting the Container

To restart the container, use the following command

```bash
docker start faucet-container
```

## Using the Faucet

### 1. Visit the Faucet

Navigate to the faucet URL (e.g., http://localhost:3000 for local development).

### 2. Connect Wallet (Optional)

Click "Connect Wallet" in the top-right to connect via RainbowKit. Supports MetaMask, WalletConnect, and other popular wallets.

### 3. Select Network

Choose either:
- **Hanzo Network Testnet** (36962) - Get 10 AI tokens
- **Hanzo Network Mainnet** (36963) - Get 1 AI token

### 4. Enter Address

- If wallet connected: Tokens automatically sent to connected address
- If no wallet: Manually enter destination address

### 5. Request Tokens

Click "Request Tokens" button. The transaction will:
- Verify ReCaptcha
- Check rate limits
- Send tokens to your address
- Return transaction hash with explorer link

### 6. Add Network to Wallet

Click "Add Network to Wallet" button to automatically configure Hanzo Network in MetaMask or other Web3 wallets.

## Troubleshooting

### Common Errors

**Too many requests. Please try again after X minutes**
- Rate limiting is active. Each address is limited to:
  - Testnet: 1 request per 24 hours
  - Mainnet: 1 request per 48 hours
- If you're seeing this on first request, you may be behind a shared proxy/VPN

**Captcha verification failed! Try refreshing**
- Using Google ReCaptcha v3 (score-based, no puzzle)
- Minimum score: 0.3 required
- Solutions: Refresh page, disable ad-blockers, turn off VPN
- See [ReCaptcha troubleshooting guide](https://2captcha.com/blog/google-doesnt-accept-recaptcha-answers)

**Internal RPC error! Please try after sometime**
- RPC node experiencing issues
- Health check runs every 30 seconds (configurable)
- Usually temporary - wait and retry

**Network error. Please try again**
- Check internet connection
- Verify API endpoint is accessible
- Try again in a few moments
- If persistent, check backend logs

**Transaction pending on explorer**
- Transaction hash is pre-computed
- Explorer may take time to index
- Hanzo Network transactions are fast but indexing can lag
- Wait 30-60 seconds before reporting issues

### Support

For additional help:
- GitHub Issues: https://github.com/hanzoai/faucet/issues
- Hanzo Network: https://hanzo.ai
- Documentation: https://docs.hanzo.ai
