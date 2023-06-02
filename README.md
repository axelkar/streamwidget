# streamwidget

## Developing

```bash
npm i

npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Push to server

```bash
npm install
npm run build
rsync --rsync-path="sudo rsync" -r build/ itmestarit.fi:/usr/share/streamwidget
```
