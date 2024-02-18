import Image from "next/image"
import { useCallback, useState } from "react"
import { Button, HStack, VStack } from "@chakra-ui/react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { useGameState } from "@/contexts/GameStateProvider"
import { program } from "@/utils/anchor"
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js"
import { web3 } from "@coral-xyz/anchor"
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";

const MintNftButton = () => {
  const { publicKey, sendTransaction, wallet } = useWallet()
  const { connection } = useConnection()
  const { gameState, playerDataPDA } = useGameState()
  const [isLoadingMainWallet, showSpinner] = useState(false)

  const onMintNftClick = useCallback(async () => {
    if (!publicKey || !playerDataPDA) return

    showSpinner(true)

    try {

      const nftAuthority = await PublicKey.findProgramAddress(
        [Buffer.from("nft_authority")],
        program.programId
      );

      const mint = new Keypair();

      const destinationTokenAccount = getAssociatedTokenAddressSync(
        mint.publicKey,
        publicKey,
        false,
        TOKEN_2022_PROGRAM_ID,
      );

      const transaction = await program.methods
        .mintNft()
        .accounts({
          signer: publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_2022_PROGRAM_ID,
          tokenAccount: destinationTokenAccount,
          mint: mint.publicKey,
          rent: web3.SYSVAR_RENT_PUBKEY,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          nftAuthority: nftAuthority[0],
        })
        .signers([mint])
        .transaction();

      console.log("transaction", transaction);

      const txSig = await sendTransaction(transaction, connection,{
        signers: [mint],
        skipPreflight: true
      } );

      console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`)
      
    } catch (error: any) {
      console.log("error", `Minting failed! ${error?.message} ${error?.stack}`)
    } finally {
      showSpinner(false)
    }
  }, [publicKey, playerDataPDA, connection])

  return (
    <>
      {publicKey && gameState && (
        <VStack>
          <Image src="/Beaver.png" alt="Energy Icon" width={64} height={64} />
          <HStack>
            <Button
              isLoading={isLoadingMainWallet}
              onClick={onMintNftClick}
              width="175px"
            >
              Mint Nft
            </Button>
          </HStack>
        </VStack>
      )}
    </>
  )
}

export default MintNftButton
