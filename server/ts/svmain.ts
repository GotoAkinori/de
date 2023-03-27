import express from "express";
import * as commandFormat from "./command-format";
import * as commandForm from "./command-form";
const conf = require("../../config/server.json");

let application = express();

application.use(express.json());
application.use(express.text());
application.use(express.urlencoded({ extended: true }));
application.use(conf.url + "/command/format/save/:format", async (req, res) => {
    try {
        await commandFormat.commandSave(req.params.format, req.body);
        res.send();
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/format/load/:format", async (req, res) => {
    try {
        res.send(await commandFormat.commandLoad(req.params.format));
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/format/list/", async (req, res) => {
    try {
        res.send(await commandFormat.commandList());
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/form/:format/create/", async (req, res) => {
    try {
        res.send(await commandForm.commandCreate(req.params.format, req.body));
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/form/:format/load/:id", async (req, res) => {
    try {
        res.send(await commandForm.commandLoad(req.params.format, req.params.id, req.body));
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + conf.staticUrl, express.static(conf.clientRoot));

application.listen(conf.port, () => {
    console.log("http(s)://(hostname):" + conf.port + conf.url);
});
