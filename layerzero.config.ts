import { EndpointId } from '@layerzerolabs/lz-definitions'
import { ExecutorOptionType } from '@layerzerolabs/lz-v2-utilities'
import { TwoWayConfig, generateConnectionsConfig } from '@layerzerolabs/metadata-tools'
import { OAppEnforcedOption } from '@layerzerolabs/toolbox-hardhat'

import type { OmniPointHardhat } from '@layerzerolabs/toolbox-hardhat'

const bscContract: OmniPointHardhat = {
    eid: EndpointId.BSC_V2_MAINNET,
    contractName: 'CycleNetworkToken',
}

const ethContract: OmniPointHardhat = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'CycleNetworkOFT',
}

// const beraContract: OmniPointHardhat = {
//     eid: EndpointId.BERA_V2_MAINNET,
//     contractName: 'CycleNetworkOFT',
// }

// const arbitrumContract: OmniPointHardhat = {
//     eid: EndpointId.ARBITRUM_V2_MAINNET,
//     contractName: 'CycleNetworkOFT',
// }

// To connect all the above chains to each other, we need the following pathways:
// Optimism <-> Avalanche
// Optimism <-> Arbitrum
// Avalanche <-> Arbitrum

// For this example's simplicity, we will use the same enforced options values for sending to all chains
// For production, you should ensure `gas` is set to the correct value through profiling the gas usage of calling OFT._lzReceive(...) on the destination chain
// To learn more, read https://docs.layerzero.network/v2/concepts/applications/oapp-standard#execution-options-and-enforced-settings
// https://docs.layerzero.network/v2/developers/evm/create-lz-oapp/configuring-pathways#adding-enforcedoptionss
const EVM_ENFORCED_OPTIONS: OAppEnforcedOption[] = [
    {
        msgType: 1,
        optionType: ExecutorOptionType.LZ_RECEIVE,
        gas: 80000,
        value: 0,
    },
]

// With the config generator, pathways declared are automatically bidirectional
// i.e. if you declare A,B there's no need to declare B,A
const pathways: TwoWayConfig[] = [
    [
        bscContract, // Chain A contract
        ethContract, // Chain B contract
        [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
        [20, 15], // [A to B confirmations, B to A confirmations]
        [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain B enforcedOptions, Chain A enforcedOptions
    ],
    // [
    //     bscContract, // Chain A contract
    //     arbitrumContract, // Chain C contract
    //     [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
    //     [1, 1], // [A to B confirmations, B to A confirmations]
    //     [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain C enforcedOptions, Chain A enforcedOptions
    // ],
    // [
    //     beraContract, // Chain B contract
    //     arbitrumContract, // Chain C contract
    //     [['LayerZero Labs'], []], // [ requiredDVN[], [ optionalDVN[], threshold ] ]
    //     [1, 1], // [A to B confirmations, B to A confirmations]
    //     [EVM_ENFORCED_OPTIONS, EVM_ENFORCED_OPTIONS], // Chain C enforcedOptions, Chain B enforcedOptions
    // ],
]

export default async function () {
    // Generate the connections config based on the pathways
    const connections = await generateConnectionsConfig(pathways)
    return {
        contracts: [{ contract: bscContract }, { contract: ethContract }],
        connections,
    }
}
