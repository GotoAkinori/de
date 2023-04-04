import express from "express";
import * as commandFormat from "./command-format";
import * as commandForm from "./command-form";
import * as commandSchema from "./command-schema";

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
        res.send(await commandForm.commandLoad(req.params.format, req.params.id));
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/form/:format/remove/:id", async (req, res) => {
    try {
        res.send(await commandForm.commandRemove(req.params.format, req.params.id));
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/form/:format/list/:id", async (req, res) => {
    try {
        res.send(await commandForm.commandDataList(req.params.format));
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/form/:format/getAll", async (req, res) => {
    try {
        res.send(await commandForm.commandGetAllData(req.params.format));
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/schema/save/:name", async (req, res) => {
    try {
        await commandSchema.commandSave(req.params.name, req.body);
        res.send();
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/schema/load/:name", async (req, res) => {
    try {
        res.send(await commandSchema.commandLoad(req.params.name));
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + "/command/schema/list/", async (req, res) => {
    try {
        res.send(await commandSchema.commandList());
    } catch (ex) {
        res.sendStatus(500);
    }
});
application.use(conf.url + conf.staticUrl, express.static(conf.clientRoot));

application.listen(conf.port, () => {
    console.log("http(s)://(hostname):" + conf.port + conf.url);
});
