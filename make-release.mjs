import archiver from "archiver";
import fs from "fs";
import path from "path";
import url from "url";

(async () => {
    const date = new Date();
    const datetimeString = `Y${date.getUTCFullYear()}M${date.getUTCMonth() + 1}D${date.getUTCDate()}H${date.getUTCHours()}M${date.getUTCMinutes()}S${date.getUTCMinutes()}`;
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const filename = path.join(__dirname, "release", `OOODE-${datetimeString}.zip`);

    const archive = archiver.create("zip", {
        zlib: { level: 9 }
    });
    const output = fs.createWriteStream(filename);

    try {
        archive.pipe(output);

        // Output Result
        output.on('close', function () {
            console.log(archive.pointer() + " total bytes");
            console.log("archiver has been finalized and the output file descriptor has closed.");
        });

        output.on('end', function () {
            console.log("Data has been drained");
        });

        archive.on('warning', function (err) {
            console.log("Warning[" + err.code + "]: " + err.message);
        });

        archive.on('error', function (err) {
            console.log("Error[" + err.code + "]: " + err.message);
            throw err;
        });

        archive.glob("client/css/**/*.*", { cwd: __dirname });
        archive.glob("client/html/**/*.*", { cwd: __dirname });
        archive.glob("client/image/**/*.*", { cwd: __dirname });
        archive.glob("client/js/**/*.js", { cwd: __dirname });
        archive.glob("config/**/*.*", { cwd: __dirname });
        archive.glob("server/js/**/*.js", { cwd: __dirname });
        archive.glob("package.json", { cwd: __dirname });
        archive.glob("setup.bat", { cwd: __dirname });
        archive.glob("start.bat", { cwd: __dirname });

        archive.finalize();
    } catch (ex) {
        console.log(ex);
    }
})();
