import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers'
import * as helpers from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ContractFactory, BaseContract, ContractTransactionResponse, parseEther } from 'ethers'
import { ethers } from 'hardhat'

describe('CycleNetworkToken Test', function () {
    let CycleNetworkToken: ContractFactory
    let cyc: BaseContract & { deploymentTransaction(): ContractTransactionResponse } & Omit<
            BaseContract,
            keyof BaseContract
        >
    let holder: HardhatEthersSigner
    let owner: HardhatEthersSigner
    let user: HardhatEthersSigner
    let allowedTimestamp: number
    let snapshot: helpers.SnapshotRestorer

    before(async function () {
        const signers = await ethers.getSigners()
        ;[, holder, owner, user] = signers

        allowedTimestamp = Math.floor(Date.now() / 1000) + 1000

        CycleNetworkToken = await ethers.getContractFactory('CycleNetworkToken')
        cyc = await CycleNetworkToken.deploy('T', 'T', '1000000000000000000000000000', holder, owner, allowedTimestamp)

        snapshot = await helpers.takeSnapshot()
    })

    beforeEach(async function () {
        await snapshot.restore()
    })

    it('w', async function () {
        expect(await cyc.getFunction('totalSupply')()).eq(parseEther('1000000000'))
        expect(await cyc.getFunction('owner')()).eq(owner)
        expect(await cyc.getFunction('transferAllowedTimestamp')()).eq(allowedTimestamp)
        expect(await cyc.getFunction('whitelist')(holder)).is.true
        expect(await cyc.getFunction('whitelist')(user)).is.false

        await expect(cyc.getFunction('setTransferAllowedTimestamp')(100)).to.be.revertedWith(
            'Ownable: caller is not the owner'
        )
        await expect(cyc.getFunction('addToWhitelist')(holder)).to.be.revertedWith('Ownable: caller is not the owner')
        await expect(cyc.getFunction('removeFromWhitelist')(holder)).to.be.revertedWith(
            'Ownable: caller is not the owner'
        )

        expect(await cyc.getFunction('balanceOf')(user)).eq(0n)
        await cyc.connect(holder).getFunction('transfer')(user, 100)
        expect(await cyc.getFunction('balanceOf')(user)).eq(100n)
        expect(await cyc.getFunction('balanceOf')(owner)).eq(0n)

        await expect(cyc.connect(user).getFunction('transfer')(owner, 5)).to.be.revertedWith('not allowed')

        await cyc.connect(owner).getFunction('addToWhitelist')(user)
        expect(await cyc.getFunction('whitelist')(user)).is.true

        await cyc.connect(user).getFunction('transfer')(owner, 5)
        expect(await cyc.getFunction('balanceOf')(user)).eq(95n)
        expect(await cyc.getFunction('balanceOf')(owner)).eq(5n)

        await cyc.connect(owner).getFunction('removeFromWhitelist')(user)
        expect(await cyc.getFunction('whitelist')(user)).is.false
        await expect(cyc.connect(user).getFunction('transfer')(owner, 5)).to.be.revertedWith('not allowed')
    })

    it('t', async function () {
        await cyc.connect(holder).getFunction('transfer')(user, 100)
        expect(await cyc.getFunction('balanceOf')(user)).eq(100n)
        expect(await cyc.getFunction('balanceOf')(owner)).eq(0n)

        await expect(cyc.connect(user).getFunction('transfer')(owner, 5)).to.be.revertedWith('not allowed')

        await helpers.time.increase(2000)
        await cyc.connect(user).getFunction('transfer')(owner, 5)
        expect(await cyc.getFunction('balanceOf')(user)).eq(95n)
        expect(await cyc.getFunction('balanceOf')(owner)).eq(5n)
    })
})
