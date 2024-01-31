import { getKeypairFromFile } from "@solana-developers/helpers";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, burn, createAccount, createMint, getAssociatedTokenAddress, getMint, getOrCreateAssociatedTokenAccount, mintTo, unpackMint } from "@solana/spl-token";
import { Connection, Keypair } from "@solana/web3.js";

let connection = new Connection("http://127.0.0.1:8899", "confirmed");

const keyPair = await getKeypairFromFile();

const mintkeyPair = Keypair.generate();

console.log(keyPair.publicKey.toString());
console.log(mintkeyPair.publicKey.toString());

let confirmOptions = {
    preflightCommitment: "confirmed",
    commitment: "confirmed",
};

const mint = await createMint(
    connection,
    keyPair,
    keyPair.publicKey,
    keyPair.publicKey,
    9,
    mintkeyPair,
    confirmOptions,
    TOKEN_2022_PROGRAM_ID,
    );

console.log("mint", mint);


const info = await connection.getAccountInfo(mintkeyPair.publicKey, "confirmed");
const unpackedMint =  unpackMint(mintkeyPair.publicKey, info, TOKEN_2022_PROGRAM_ID);

console.log("mintInfo", unpackedMint);
