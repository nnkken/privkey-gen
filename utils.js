/* global Promise */

const account = require("ethjs-account");
const crypto = require("crypto");
const read = require("read");

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

function usernameToAccount(uname, seed) {
    const hmac = crypto.createHmac("sha256", seed);
    hmac.update(uname);
    const privKey = hmac.digest("hex");
    return account.privateToAccount(privKey);
}

module.exports = { readAsync, getPassword, usernameToAccount };
