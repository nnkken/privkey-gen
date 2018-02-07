const scrypt = require("scrypt");
const params = require("./params.json");
const { readAsync, usernameToAccount } = require("./utils.js");

async function main() {
    try {
        const password = await readAsync({ prompt: "Please enter your password: ", silent: true });
        const { N, r, p, dkLen, salt } = params;
        const seed = scrypt.hashSync(password, { N, r, p }, dkLen, salt);
        const uname = await readAsync({ prompt: "Please enter username: " });
        const acc = usernameToAccount(uname, seed);
        // TODO: output private key more securely
        console.log(acc.privateKey);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main();

