<p align="center">
<img width="600" src="./assets/readme.assets/chartr_business_logo.png?raw=true" alt="Chartr Business logo">
</p>

## What is Chartr Business?
<h3>
<i>Chartr Business</i> is designed to be used by charter companies to configure their Chartr account. Their account should include all relevant data necessary to advertise their business and available flights to users of the Chartr mobile app.
</h3>
<br />

## Building and Running
<p>
  This started out as a fork of the <a href="https://github.com/electron-react-boilerplate/electron-react-boilerplate">Electron React Boilerplate</a> project and built from that foundation, so check out their docs as well.
</p>

<br>

### Prerequisites
- This has only yet (at least at the time of this writing) been tested and developed on a Mac
- Install NodeJs and NPM. You need to have at least [NodeJs](https://nodejs.org/en/download/) version 18.2.0 installed


### Running the App

Start the app in the `dev` environment:

```bash
npm install
npm start
```

### Packaging for Production

#### **Code Signing steps for Mac version**
1. Open Keychain Access app on our Mac and select "Request a certificate from a certificate authority" and save it somewhere
2. Go to your Apple developer account and create a new certificate of type "Developer ID Application". Download it
  and install it into your keychain
3. Create a new provisioning profile of the same type and choose the certificate you created in step 2
4. Download the profile and double click to install it on your machine
5. Create an API key to authenticate with Apple - go to App Store Connect and choose Users and Access, Keys tab, and create an API key
  with App Manager level access. Download the key and store it in a safe place. Write down the *API Key Id* and the *Issuer Id*
6. Create a new folder called *private_keys* at the root of this project (DO NOT COMMIT THIS TO SOURCE CONTROL!!!!)
7. In Keychain Access, expand the certificate you installed in step 2, then right click and choose "Export 2 items" and save the file
  inside the *private_keys* folder you just created, name it **chartr-business-privatekey.p12"**
8. Copy the *AuthKey_<keyid>.p8* file into the *private_keys* folder.
8. Create two env variables on your computer wherever you export your variables (ie .zshrc or whatever)
  - `export CSC_LINK="$HOME/source/repos/chartr-electron-react/private_keys/chartr-business-privatekey.p12"`
  - `export CSC_KEY_PASSWORD="<password created in step 7 when exporting the p12>"`
10. In the [notarize.js](./.erb/scripts/notarize.js) file, change the following properties by adding your API key details you gathered in step 5

  ```
    await notarize({
      tool: 'notarytool',
      appBundleId: build.appId,
      appPath: `${appOutDir}/${appName}.app`,
      appleApiKey: './private_keys/AuthKey_<your-apikey-id>.p8',
      appleApiKeyId: '<your-apikey-id>',
      appleApiIssuer: '<your-issuer-id>'
    });
  ```


To package apps for the local platform:

```bash
npm run package
```

To package apps for universal Mac for example, add a few extra arguments to the npm script in package.js
`"package": "ts-node ./.erb/scripts/clean.js dist && npm run build && electron-builder build --macos --universal",`

The *release/build* folder will have the built apps for the target platform.

See https://github.com/electron/notarize

See https://www.electron.build/cli

## Documentation

Visit [Chartr Architecture Overview](./docs/architecture.md) to get an idea how the app was structured, of course there's lots more to it but hopefully this will help answer some of your questions.

## Contributing

All work on the Chartr Business portal app happens directly on [GitHub](https://github.com/AerovekCommunity/chartr-electron-react). Both core team members and external contributors send pull requests which go through the same review process.

If you are interested in contributing directly to the code base, the first thing you should do is read our [Litepaper](https://github.com/AerovekCommunity/litepaper) to get an understanding of what Chartr is and how it's supposed to work. 

## **Submitting Code Changes**
1. Create an issue describing the bugfix or feature you plan to work on, or if one exists already that you want to work on just assign yourself to it.
2. Create a development branch on the issue page
3. Checkout the branch locally
  ```
  git fetch origin
  git checkout 1-my-first-issue
  ```
3. Do the work in that branch and commit and push to remote when ready
    ```
    git add . 
    git commit -m "your commit notes"
    git push origin 1-my-first-issue
    ```
4. Create a pull request from your branch into main and ask a core contributor to review it
5. Once the pull request is approved you can merge your branch into main

You can also join our Telegram and Discord channels and ask questions there. 

## Community
### Telegram

Please join the [Aerovek Aviation](https://t.me/aerovekviation) channel on Telegram where you can ask general questions, voice ideas, or just chat with the community.

Join the [AeroDao](https://t.me/AeroDao) Telegram channel to ask development related questions about this project or the mobile projects. You can tag [Jay](https://t.me/prolowfile) if you are really stuck on something or something in the code isn't clear.

### Discord
To chat with other community members, please join the [Aerovek Discord Server](https://discord.gg/PfwEt3YUKM) 

### Code of Conduct
Our [Code of Conduct](CODE_OF_CONDUCT.md) applies to all Aerovek community channels

