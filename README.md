# Private Key Generator

## Algorithm

```
seed = scrypt(password, N = 1048576, r = 8, p = 1, dkLen = 64, salt = "privkey-gen")
privKey = hmac-sha256(username, key = seed)
```
