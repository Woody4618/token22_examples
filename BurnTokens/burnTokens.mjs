import { getKeypairFromFile } from "@solana-developers/helpers";
import { TOKEN_2022_PROGRAM_ID, burn, createAccount, createMint, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
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

const tokenAccount = await createAccount(
    connection, 
    keyPair, 
    mintkeyPair.publicKey, 
    keyPair.publicKey, 
    undefined, 
    confirmOptions, 
    TOKEN_2022_PROGRAM_ID);

    console.log("tokenAccount", tokenAccount);

    const assotiatedTokenAccount = await getAssociatedTokenAddress
    (
        mintkeyPair.publicKey, 
        keyPair.publicKey,
        false,
        TOKEN_2022_PROGRAM_ID
    );        

    console.log("assotiatedTokenAccount", assotiatedTokenAccount);

const sig = await mintTo(
    connection,
    keyPair,
    mintkeyPair.publicKey,
    tokenAccount,
    keyPair.publicKey,
    5000000000,
    undefined,
    undefined,
    TOKEN_2022_PROGRAM_ID
);

console.log("sig", sig);

var x = 5;
var interval = 1000;

for (var i = 0; i < x; i++) {
    setTimeout(async function () {
        const burnSig = await burn(
            connection,
            keyPair,
            tokenAccount,
            mintkeyPair.publicKey,
            keyPair.publicKey,
            1000000000,
            undefined,
            undefined,
            TOKEN_2022_PROGRAM_ID
            );
        
        console.log("burnSig", burnSig);
    }, i * interval)
}
