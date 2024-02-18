import { getKeypairFromFile } from "@solana-developers/helpers";
import { TOKEN_2022_PROGRAM_ID, burn, createAccount, createMint, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";
import { Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";

let connection = new Connection("http://127.0.0.1:8899", "confirmed");

const keyPair = await getKeypairFromFile();

const targetKeypais = Keypair.generate();

const account = await connection.getAccountInfo(keyPair.publicKey);
console.log("account", account);


/* static_assertions::const_assert_eq!(
  STORE_META_OVERHEAD,
  std::mem::size_of::<StoredMeta>() + std::mem::size_of::<AccountMeta>() + std::mem::size_of::<Hash>()
); */ 

// Stored meta: write_version_obsolete: 8, data_len: 8, pubkey: 32 = 48
// Accountmeta: lamports: 8 rent_epoch:8 exec_flag: 1 owner_key: 32 = 56
// Hash: 32 = 32
// 48 + 56 + 32 = 136



const lamports = 8;
const slot = 8;
const rentEpoch = 8;
const executable = 1;
const owner = 32;
const key = 32;
const dataHash = 32;
const extraSpaceICantDefine = 15;

const size = executable + owner + slot + lamports + rentEpoch + dataHash + extraSpaceICantDefine + key;

// 8 /* lamports */ + 8 /* slot */ + 8 /* rent_epoch */ + 1 /* exec_flag */ + 32 /* owner_key */ + 32 /* pubkey */; = 89 ( 39 missing)

// = 128 
const defaultAccount = await connection.getMinimumBalanceForRentExemption(0);
const extraRent = await connection.getMinimumBalanceForRentExemption(size);

// 890880 is the minimum rent for a system account

console.log(`size ${size} rent ${extraRent} rent difference ${extraRent - (defaultAccount * 2)}`);

  // Create a new transaction that contains the new system program

const rent128 = await connection.getMinimumBalanceForRentExemption(128);
console.log("rent128", rent128 / 2);
const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keyPair.publicKey,
      toPubkey: targetKeypais.publicKey,
      lamports: (rent128 / 2)  ,
    }),
  );

  // Sign transaction, broadcast, and confirm
  const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [keyPair],
  );

console.log("sig", signature);


