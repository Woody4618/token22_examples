import {
    Connection,
    Keypair,
    SystemProgram,
    Transaction,
    clusterApiUrl,
    sendAndConfirmTransaction,
    TransactionInstruction,
    PublicKey,
  } from "@solana/web3.js";
  import {
    ExtensionType,
    TOKEN_2022_PROGRAM_ID,
    createEnableRequiredMemoTransfersInstruction,
    createInitializeAccountInstruction,
    createMint,
    disableRequiredMemoTransfers,
    enableRequiredMemoTransfers,
    getAccountLen,
    createAccount,
    mintTo,
    createTransferInstruction,
    getAssociatedTokenAddressSync,
    getOrCreateAssociatedTokenAccount,
  } from "@solana/spl-token";
  import { getKeypairFromFile } from "@solana-developers/helpers";

  async function main() {


  // Playground wallet
  const payer = await getKeypairFromFile();
  
  // Connection to devnet cluster
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  
  // Transaction to send
let transaction;
  // Transaction signature returned from sent transaction
  let transactionSignature;

  // Authority that can mint new tokens
const mintAuthority = payer.publicKey;

// Decimals for Mint Account
const decimals = 2;

let mintKeypair = Keypair.generate();

// Create Mint Account
const mint = await createMint(
  connection,
  payer, // Payer of the transaction and initialization fees
  mintAuthority, // Mint Authority
  null, // Optional Freeze Authority
  decimals, // Decimals of Mint
  mintKeypair, // Optional keypair
  undefined, // Options for confirming the transaction
  TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
);

console.log("Mint Account:", mintKeypair.publicKey.toBase58());

// Random keypair to use as owner of Token Account
const tokenAccountKeypair = Keypair.generate();
// Address for Token Account
const tokenAccount = tokenAccountKeypair.publicKey;

// Size of Token Account with extension
const accountLen = getAccountLen([ExtensionType.MemoTransfer]);
// Minimum lamports required for Token Account
const lamports = await connection.getMinimumBalanceForRentExemption(accountLen);

// Instruction to invoke System Program to create new account
const createAccountInstruction = SystemProgram.createAccount({
    fromPubkey: payer.publicKey, // Account that will transfer lamports to created account
    newAccountPubkey: tokenAccount, // Address of the account to create
    space: accountLen, // Amount of bytes to allocate to the created account
    lamports, // Amount of lamports transferred to created account
    programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
  });

  // Instruction to initialize Token Account data
const initializeAccountInstruction = createInitializeAccountInstruction(
    tokenAccount, // Token Account Address
    mint, // Mint Account
    payer.publicKey, // Token Account Owner
    TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  );

  // Instruction to initialize the MemoTransfer Extension
const enableRequiredMemoTransfersInstruction =
createEnableRequiredMemoTransfersInstruction(
  tokenAccount, // Token Account address
  payer.publicKey, // Token Account Owner
  undefined, // Additional signers
  TOKEN_2022_PROGRAM_ID, // Token Program ID
);

// Add instructions to new transaction
transaction = new Transaction().add(
    createAccountInstruction,
    initializeAccountInstruction,
    enableRequiredMemoTransfersInstruction,
  );
  
  // Send transaction
  transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer, tokenAccountKeypair], // Signers
  );
  
  console.log(
    "\nCreate Token Account:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  ); 

  // Create Token Account for Playground wallet
const sourceTokenAccount = await createAccount(
    connection,
    payer, // Payer to create Token Account
    mint, // Mint Account address
    payer.publicKey, // Token Account owner
    undefined, // Optional keypair, default to Associated Token Account
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  );

  // Mint tokens to sourceTokenAccount
transactionSignature = await mintTo(
    connection,
    payer, // Transaction fee payer
    mint, // Mint Account address
    sourceTokenAccount, // Mint to
    mintAuthority, // Mint Authority address
    200, // Amount
    undefined, // Additional signers
    undefined, // Confirmation options
    TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  );
  
  console.log(
    "\nMint Tokens:",
    `https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`,
  );

  // Instruction to transfer tokens
const transferInstruction = createTransferInstruction(
    sourceTokenAccount, // Source Token Account
    tokenAccount, // Destination Token Account
    payer.publicKey, // Source Token Account owner
    100, // Amount
    undefined, // Additional signers
    TOKEN_2022_PROGRAM_ID, // Token Extension Program ID
  );    

  // Message for the memo
const message = "Hello, Solana";
// Instruction to add memo
const memoInstruction = new TransactionInstruction({
  keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
  data: Buffer.from(message, "utf-8"),
  programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
});

try {
    // Attempt to transfer without memo
    transaction = new Transaction().add(memoInstruction);
    transaction.add(transferInstruction);
  
    // Send transaction
    await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer], // Signers
    );
  } catch (error) {
    console.log("\nExpect Error:", error);
  }

}

main();