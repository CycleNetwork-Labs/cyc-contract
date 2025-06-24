// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
import '@nomicfoundation/hardhat-verify'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

import './tasks/transfer'
import './tasks/transfer_safe'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    paths: {
        cache: 'cache/hardhat',
    },
    solidity: {
        compilers: [
            {
                version: '0.8.22',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        'optimism-testnet': {
            eid: EndpointId.OPTSEP_V2_TESTNET,
            url: process.env.RPC_URL_OP_SEPOLIA || 'https://optimism-sepolia.gateway.tenderly.co',
            accounts,
        },
        'avalanche-testnet': {
            eid: EndpointId.AVALANCHE_V2_TESTNET,
            url: process.env.RPC_URL_FUJI || 'https://avalanche-fuji.drpc.org',
            accounts,
        },
        'arbitrum-testnet': {
            eid: EndpointId.ARBSEP_V2_TESTNET,
            url: process.env.RPC_URL_ARB_SEPOLIA || 'https://arbitrum-sepolia.gateway.tenderly.co',
            accounts,
        },
        'bsc-mainnet': {
            eid: EndpointId.BSC_V2_MAINNET,
            url: process.env.RPC_URL_BSC_MAINNET || 'https://bsc-dataseed.bnbchain.org',
            accounts,
        },
        'arbitrum-mainnet': {
            eid: EndpointId.ARBITRUM_V2_MAINNET,
            url: process.env.RPC_URL_ARB_MAINNET || 'https://arb1.arbitrum.io/rpc',
            accounts,
        },
        'bera-mainnet': {
            eid: EndpointId.BERA_V2_MAINNET,
            url: process.env.RPC_URL_BERA_MAINNET || 'https://berachain.drpc.org',
            accounts,
        },
        'eth-mainnet': {
            eid: EndpointId.ETHEREUM_V2_MAINNET,
            url: process.env.RPC_URL_BERA_MAINNET || 'https://mainnet.infura.io/v3/1989ae0ef1a64a64a06e7e926d65bc54',
            accounts,
        },
        hardhat: {
            // Need this for testing because TestHelperOz5.sol is exceeding the compiled contract size limit
            allowUnlimitedContractSize: true,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.ETHERSCAN_API_KEY!,
            bsc: process.env.BSCSCAN_API_KEY!,
        },
    },
}

export default config
