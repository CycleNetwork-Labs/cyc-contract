import assert from 'assert'
import { parseEther } from 'ethers'

import { type DeployFunction } from 'hardhat-deploy/types'

const contractName = 'CycleNetworkToken'

const deploy: DeployFunction = async (hre) => {
    const { getNamedAccounts, deployments } = hre

    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const { address } = await deploy(contractName, {
        from: deployer,
        args: [
            process.env.TOKEN_NAME!, 
            process.env.TOKEN_SYMBOL!, 
            process.env.INIT_SUPPLY!, 
            process.env.INIT_HOLDER!, 
            process.env.INIT_OWNER!, 
            process.env.TRANSFER_ALLOWED_TIMESTAMP!, 
        ],
        log: true,
        skipIfAlreadyDeployed: false,
    })

    console.log(`Deployed contract: ${contractName}, network: ${hre.network.name}, address: ${address}`)
}

deploy.tags = [contractName]

export default deploy
