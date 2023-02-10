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

To package apps for the local platform:

```bash
npm run package
```

That will build binaries for whatever system you run that command from (if you are on a Mac it will produce a .dmg file, etc)

## Documentation

Visit [Chartr Architecture Overview](./docs/architecture.md) to get an idea how the app was structured, of course there's lots more to it but hopefully this will help answer some of your questions.

## Contributing

All work on the Chartr Business portal app happens directly on [GitHub](https://github.com/AerovekCommunity/chartr-electron-react). Both core team members and external contributors send pull requests which go through the same review process.

If you are interested in contributing directly to the code base, the first thing you should do is read our [Litepaper](https://github.com/AerovekCommunity/litepaper) to get an understanding of what Chartr is and how it's supposed to work. 

## **Submitting Code Changes**
1. Create an issue describing the bugfix or feature you plan to work on, or if one exists already that you want to work on just assign yourself to it.
2. Create a branch off of `main` and name it something that describes the issue. First make sure your main branch is up to date
    ```
    git checkout main
    git pull
    git checkout -b your-branch-name
    ```
3. Do the work in that branch and commit and push to remote when ready
    ```
    git add . 
    git commit -m "your commit notes"
    git push origin your-branch-name
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

