
spl-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb create-token --transfer-fee 50 5000

spl-token create-account 2ExjgRJDbKAPNan3TdHBpFGU6J5LAH4VwVJgGJtF3Zis

solana-keygen new -o destination.json
spl-token create-account 2ExjgRJDbKAPNan3TdHBpFGU6J5LAH4VwVJgGJtF3Zis destination.json

spl-token mint 2ExjgRJDbKAPNan3TdHBpFGU6J5LAH4VwVJgGJtF3Zis 1000000000


spl-token transfer --expected-fee 0.000005 2ExjgRJDbKAPNan3TdHBpFGU6J5LAH4VwVJgGJtF3Zis 1000000 destination.json


spl-token withdraw-withheld-tokens VSjT7P8Zxy4CWqbxPaQKmn8dBCjBnJGzRt5NhGC2Cw4 7ZaMo52gmxk4HtiDKxtiNWUYASgThXuepbZHdFjgz5ro

spl-token makehappy 2ExjgRJDbKAPNan3TdHBpFGU6J5LAH4VwVJgGJtF3Zis 100



