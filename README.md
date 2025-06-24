 CycleNetwork Token Contract

### Usage

#### Install
```aidl
$ nvm use
$ npm install
```
#### Compile
```aidl
$ npx hardhat compile
```
#### Deploy
```aidl
$ npx hardhat lz:deploy
```
#### Verify
```
npx hardhat verify --network eth-mainnet 0x5845684b49aEf79A5c0F887f50401C247dca7AC6 --contract contracts/CycleNetworkOFT.sol:CycleNetworkOFT 'Cycle Network Token' 'CYC' '0x1a44076050125825900e736c501f859c50fE728c' '0x40b1f8A33831678092444093eaa2a2D48ecD56a1'

npx hardhat verify --network bsc-mainnet 0x5845684b49aEf79A5c0F887f50401C247dca7AC6 --contract contracts/CycleNetworkToken.sol:CycleNetworkToken 'Cycle Network Token' 'CYC' '0x1a44076050125825900e736c501f859c50fE728c' '0x40b1f8A33831678092444093eaa2a2D48ecD56a1' '0xf78c17f28B0764A253C9F0235cC3565e7eea3Ea9'
```