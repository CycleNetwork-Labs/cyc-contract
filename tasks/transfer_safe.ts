import { task } from 'hardhat/config'
import { getNetworkNameForEid, types } from '@layerzerolabs/devtools-evm-hardhat'
import { EndpointId } from '@layerzerolabs/lz-definitions'
import { addressToBytes32 } from '@layerzerolabs/lz-v2-utilities'
import { Options } from '@layerzerolabs/lz-v2-utilities'
import { BigNumberish, BytesLike } from 'ethers'
import { formatEther } from 'ethers/lib/utils'

interface Args {
    amount: string
    to: string
    toEid: EndpointId
}

interface SendParam {
    dstEid: EndpointId // Destination endpoint ID, represented as a number.
    to: BytesLike // Recipient address, represented as bytes.
    amountLD: BigNumberish // Amount to send in local decimals.
    minAmountLD: BigNumberish // Minimum amount to send in local decimals.
    extraOptions: BytesLike // Additional options supplied by the caller to be used in the LayerZero message.
    composeMsg: BytesLike // The composed message for the send() operation.
    oftCmd: BytesLike // The OFT command to be executed, unused in default OFT implementations.
}

// send tokens from a contract on one network to another
task('lz:oft:safesend', 'Sends tokens from either OFT or OFTAdapter')
    .addParam('to', 'contract address on network B', undefined, types.string)
    .addParam('toEid', 'destination endpoint ID', undefined, types.eid)
    .addParam('amount', 'amount to transfer in token decimals', undefined, types.string)
    .setAction(async (taskArgs: Args, { ethers, deployments, network }) => {
        const toAddress = taskArgs.to
        const eidB = taskArgs.toEid

        console.log(`eidB ${eidB}`)
        
        // Get the contract factories
        const oftDeployment = await deployments.get(network.name == 'bsc-mainnet' ? 'CycleNetworkToken' : 'CycleNetworkOFT')

        console.log(`${network.name} ${oftDeployment.address}`)
        
        const [signer] = await ethers.getSigners()

        // Create contract instances
        const oftContract = new ethers.Contract(oftDeployment.address, oftDeployment.abi, signer)
        // const oftContract = ethers.getContractAt()

        const decimals = await oftContract.decimals()
        console.log(`decimals ${decimals}`)

        const amount = ethers.utils.parseUnits(taskArgs.amount, decimals)
        let options = Options.newOptions().addExecutorLzReceiveOption(65000, 0).toBytes()

        // Now you can interact with the correct contract
        const oft = oftContract

        const sendParam: SendParam = {
            dstEid: eidB,
            to: addressToBytes32(toAddress),
            amountLD: amount,
            minAmountLD: amount,
            extraOptions: options,
            composeMsg: ethers.utils.arrayify('0x'), // Assuming no composed message
            oftCmd: ethers.utils.arrayify('0x'), // Assuming no OFT command is needed
        }
        // Get the quote for the send operation
        const feeQuote = await oft.quoteSend(sendParam, false)
        const nativeFee = feeQuote.nativeFee

       

        console.log(`sending ${taskArgs.amount} token(s) to network ${getNetworkNameForEid(eidB)} (${eidB}), fee ${formatEther(nativeFee)}\n`)

        console.log(`    _sendParam: ["${sendParam.dstEid}","${ethers.utils.hexlify(sendParam.to)}","${sendParam.amountLD}","${sendParam.minAmountLD}","${ethers.utils.hexlify(sendParam.extraOptions)}","${ethers.utils.hexlify(sendParam.composeMsg)}","${ethers.utils.hexlify(sendParam.oftCmd)}"]`)
        console.log(`     BNB Value: ${formatEther(nativeFee)}`)
        console.log(`          _fee: ["${nativeFee}",0] // same with BNB Value`)
        console.log(`_refundAddress: ${toAddress}\n`)
    })
