/* global Promise */

const read = require("read");
const scrypt = require("scrypt");
const account = require("ethjs-account");
const fs = require("fs");
const crypto = require("crypto");

function readAsync(options) {
    return new Promise((resolve, reject) => {
        read(options, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

async function getPassword() {
    const p1 = await readAsync({ prompt: "Please enter your password: ", silent: true });
    const p2 = await readAsync({ prompt: "Enter your password again: ", silent: true });
    if (p1 !== p2) {
        throw "Password does not match";
    }
    return p1;
}

async function main() {
    try {
        const path = process.argv[2];
        if (!path) {
            throw "No input file given";
        }
        const password = await getPassword();
        const seed = scrypt.hashSync(password, { N: 262144, r: 8, p: 1 }, 64, "");
        const usernames = fs.readFileSync(path, "utf-8").split("\n").filter(s => s);
        usernames.forEach((uname) => {
            const hmac = crypto.createHmac("sha256", seed);
            hmac.update(uname);
            const privKey = hmac.digest("hex");
            const acc = account.privateToAccount(privKey);
            console.log(`${uname}\t${acc.address}`);
        });
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();
