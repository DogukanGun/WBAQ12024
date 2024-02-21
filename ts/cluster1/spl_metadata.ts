import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
    createMetadataAccountV3,
    CreateMetadataAccountV3InstructionAccounts,
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { PublicKey } from "@solana/web3.js";

// Define our Mint address
const mint = new PublicKey("9r5f5ozAoPLkitiefE2wsbQmjM7WpndDVnmQ9cjycBMh")


// Add the Token Metadata Program
const token_metadata_program_id = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// Create PDA for token metadata
const metadata_seeds = [
    Buffer.from("metadata"),
    token_metadata_program_id.toBuffer(),
    mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(
    metadata_seeds,
    token_metadata_program_id
);


// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: publicKey(mint.toString()),
            mintAuthority:signer,
            payer: signer,
            updateAuthority: keypair.publicKey,
            metadata: publicKey(metadata_pda.toString()),
        }

        let data: DataV2Args = {
            name: "Dogukan NFT",
            symbol: "NFT",
            uri: "",
            sellerFeeBasisPoints: 0,
            collection: null,
            uses: null,
            creators: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data: data,
            isMutable: true,
            collectionDetails: null,
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi).then(r => r.signature.toString());
        console.log(result);
    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();