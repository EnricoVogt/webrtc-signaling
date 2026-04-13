import express from 'express'
import { ExpressPeerServer } from 'peer'
import { sdk } from './sdk.js'

const ory = sdk.frontend;
const app = express();
const server = app.listen(3000);

const peers = new Map();

const peerServer = ExpressPeerServer(server, {
    path: "/",
});

peerServer.use((req, res, next) => {
    console.log('Cookies:', req.cookies) // ✅ cookies available here
    next()
})

app.use("/peer-server", peerServer);

app.get("/peers", async (req, res) => {
    try {
        const { data } = await ory.toSession()
        res.send(data);
        console.log("Logged in user:", data.identity)
    } catch (err) {
        console.log("Not logged in")
        res.status(401)
        return res.send();
    }
    const ids = [];
    for (const [key, value] of peers) {
        ids.push(key);
    }
    res.send(ids);
});


peerServer.on("connection", (client) => {
    peers.set(client.getId(), client)
    console.log("Connected:", client.getId());
});

peerServer.on("disconnect", (client) => {
    peers.delete(client.getId())
    console.log("Client disconnected:", client.getId());
});