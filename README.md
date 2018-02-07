# Private Key Generator

## Usage

`node index.js input.txt output-folder`

## Input file format

`cat input.txt`
```
username1
username2
username3
...
```

## Algorithm

```
seed = scrypt(password, N = 1048576, r = 8, p = 1, dkLen = 64, salt = "privkey-gen")
privKey = hmac-sha256(username, key = seed)
```
