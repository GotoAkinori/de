import express from "express";
import * as commandFormat from "./command-format";
const conf = require("../../config/server.json");

let application = express();

application.use(express.json());
application.use(express.urlencoded({ extended: true }));
application.use(conf.url + "/command/:type/:action/:format", async (req, res) => {
    try {
        let result: any;
        switch (req.params.type) {
            case "format": {
                result = await commandFormat.command(req.params.action, req.params.format, req.body);
            } break;
        }
        res.send(result);
    } catch (ex) {
        res.sendStatus(500);
        res.setHeader("Content-Type", "application/json");
        res.send({
            message: ex
        });
    }
});
application.use(conf.url, express.static(conf.clientRoot));

application.listen(conf.port, () => {
    console.log("http(s)://(hostname):" + conf.port + conf.url);
});
