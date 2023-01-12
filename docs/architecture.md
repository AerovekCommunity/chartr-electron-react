
## IMPORTANT
<i>[Jan 2023]</i> Until production ready, all blockchain calls and wallet operations (sending/receiving) should be done on Devnet, especially because the smart contract that stores the account data is only on Devnet. 

## Overview

Chartr Business is a desktop application written using the [Electron](https://www.electronjs.org/) technology along with [ReactJS](https://reactjs.org/) and [MaterialUI](https://mui.com/material-ui/getting-started/overview/)


## Core Functions
<ul>
    <li>Creating a wallet</li>
    <li>Creating a Chartr Business account on the blockchain</li>
    <li>Sending and receiving AERO and EGLD</li>
    <li>Adding pilot records to your account</li>
    <li>Adding aircraft records to your account</li>
    <li>Creating flight packages to advertise (this is essentially what the Chartr mobile app will see when searching for flights)</li>
</ul>


## Project Structure

The project structure is typical of any React application so I’m not going to go into it in detail. Whoever is reading this and wants to contribute should be an experienced React/TypeScript developer. If you have never heard of Electron, read up on it before contributing because there are critical differences between this technology and writing a web app that runs in your standard browser. File I/O is one of the main differences.

## View Hierarchy

Parent views are under the renderer folder, and nested views are under the views folder. Start at the [Login](../src/renderer/Login.tsx) page and go from there to make sense of the flow. Pay attention to props passed to each view!

## Logging In

Logging in is achieved the same way as accessing your [Elrond web wallet](https://wallet.multiversx.com/). You drag and drop your keyfile and enter the password you used when creating your wallet. 

After logging in, your password is passed down via props and used when signing transactions. This allows the app to sign transactions behind the scenes without the user having to intervene. 

## Post Login
After successfully logging in, a userSettings.json file is created and written to local storage. This contains things like the path to the wallet keyfile and wallet address for later use.

The [Login](../src/renderer/Login.tsx) page tries to retrieve an account associated with the user's wallet address. If that fails then we set some props to inform other views whether to show the Create Account or the Account sidebar buttons. Also, if an account was created but that transaction hasn't finished, we store an <i>accountPending</i> flag in userSettings that will be used to show a message. Once the transaction finishes the Account sidebar item will show up and clicking that opens the main account screen with the Profile and other tabs.

[HomeContainer](../src/renderer/HomeContainer.tsx) is responsible for the side navigation display and functionality, and responsible for loading the correct component when a side menu item is selected.

[HomeDetailView](../src/views/HomeDetailView.tsx) is responsible for displaying the content associated with the menu item selected. 

## Creating / Retrieving Account
### Creating an Account
Since the account is associated with a wallet address, a wallet must be created or imported before users can create an account. The app ultimately makes a smart contract call to save the account on the blockchain. 

### Retrieving Account
If a user has created an account, the account is retrieved after login as described above and is saved to memory and passed via props to views that need to reference it, instead of having to always query the chain for it (See the [IChartrAccount](../src/interfaces.ts) interface for the account object structure).  

### Saving Changes to Account
Basically any time you need to add something to the account, such as an aircraft, pilot, or flights object, you need to modify the existing account object without affecting the other data. This is because you can’t edit or delete anything from a smart contract, you have to save a new version of the entire object. This is important to note because if you tried to create a new object on the client side you risk losing data, it’s better to retrieve the entire account then modify only the bare minimum needed, then save back that entire original object with the additional changes to it.

### Smart Contract
Currently the smart contract is only on Devnet, so another one will need to be created on Mainnet when production ready. The smart contract expects a certain structure which you can reference from the existing code.

## Data Grids
For displaying grids of data, we are using [AG Grid](https://ag-grid.com/react-data-grid/getting-started/)

At this point we are using the free version which is good enough to get by, but if you wanted to do something like a master/detail (for example, expanding a pilot row to see all pilot details in a custom view). The free version does not support [master/detail](https://ag-grid.com/react-data-grid/master-detail/)

### ErdJS
This app uses the following packages to interact with the Elrond blockchain and create wallets and sign transactions and all that good stuff…

- [ErdJS](https://github.com/ElrondNetwork/elrond-sdk-erdjs)
- [ErdJS Network Providers](https://github.com/ElrondNetwork/elrond-sdk-erdjs-network-providers)
- [ErdJS Wallet Core](https://github.com/ElrondNetwork/elrond-sdk-erdjs-walletcore)

### File I/O
You can’t read or write to a file from a React component for security reasons. In order to do this you need to go through something called a [contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge). See the [preload](../src/main/preload.ts) file for direction, as well as the [main](../src/main/main.ts) file as they work together.

### Building and Deployment
```
npm install
npm start
```

That will run the app in development mode with the browser dev tools attached. The error page you see is normal for dev mode, just click the close button to dismiss it.

There are several npm scripts for building but they need to be improved. See resource links below on how to correctly build for different platforms, and how to sign your application for distribution.

```
npm run package
```

That will create a binary for whatever platform you are running that script from (i.e. a dmg for Mac)

## Security Considerations
[READ THIS!!](https://www.electronjs.org/docs/latest/tutorial/security)

## Resources
https://kilianvalkhof.com/2019/electron/notarizing-your-electron-application/

https://www.electron.build/code-signing
