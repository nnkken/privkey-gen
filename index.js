const scrypt = require("scrypt");
const fs = require("fs");
const params = require("./params.json");
const { getPassword, usernameToAccount } = require("./utils.js");

function readUsernames(path) {
    return fs.readFileSync(path, "utf-8")
        .split("\n")
        .filter(s => s.length > 0);
}

function writeOutputFile(unameAddrList, path) {
    const timestamp = Date.now();
    unameAddrList.forEach((unameAddr) => {
        const displayName = unameAddr[0];
        const wallet = unameAddr[1];
        const json = JSON.stringify({ timestamp, displayName, wallet });
        const dirPath = `${path}/${displayName}`;
        const jsonPath = `${dirPath}/${displayName}.json`;
        console.log(`Writing ${jsonPath}`);
        fs.mkdirSync(dirPath);
        fs.writeFileSync(jsonPath, json);
    });
}

async function main() {
    try {
        const inputPath = process.argv[2];
        const outputPath = process.argv[3];
        if (!inputPath || !outputPath) {
            console.error(`Usage: ${process.argv[0]} ${process.argv[1]} [username list file] [output folder]`);
            process.exit(1);
        }
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }
        const password = await getPassword();
        const { N, r, p, dkLen, salt } = params;
        const seed = scrypt.hashSync(password, { N, r, p }, dkLen, salt);
        const usernames = readUsernames(inputPath);
        const unameAddrList = usernames.map((uname) => {
            const acc = usernameToAccount(uname, seed);
            return [uname, acc.address];
        });
        writeOutputFile(unameAddrList, outputPath);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();

