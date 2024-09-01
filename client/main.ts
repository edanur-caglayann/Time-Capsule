import {
    Connection,
    Keypair,
    PublicKey,
    TransactionMessage,
    VersionedTransaction,
    SystemProgram,
    TransactionInstruction,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
  
  } from "@solana/web3.js";
  
  
  import { baseDecode, deserialize, serialize } from "borsh";
  import { User, UserSchema, Fund, FundSchema, ReadSchema, Read, Transfer, TransferSchema} from "./models";

  
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const privatekey = [73,215,148,198,217,94,8,55,199,227,116,64,235,204,93,214,158,11,101,6,21,14,96,37,183,188,73,65,240,184,27,57,207,223,23,148,245,129,207,145,123,147,243,116,59,215,69,168,179,237,249,249,102,202,216,244,109,192,222,176,49,136,218,89]
 
  const payer = Keypair.fromSecretKey(Uint8Array.from(privatekey));
  const user = new PublicKey("J6J8rQ4aXkMxjXxjeSr6PKPc1tkeCkw45CzPLUnSXCPE");
  const fund = new PublicKey("BJtH5H4CiQRr1AkmsMUnxGkCoK85JmeUsDHmggxmeMc2");


  const time_capsule_program_id = new  PublicKey("DhMtAtMpeXdyKEZhVLrehxGFDWU2hH92TjqtvNx91Fky")

 const create_user = async () => {
  const user = new User();
  user.name = "eda",
  user.useraddress = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);


    const encoded = serialize(UserSchema, user);
    const concat = Uint8Array.of(0, ...encoded);

    const new_user_account = Keypair.generate()

    const new_user = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: new_user_account.publicKey,
      lamports: LAMPORTS_PER_SOL * 0.02,
      space: encoded.length,
      programId: time_capsule_program_id
    })

const ix = new TransactionInstruction({ 
    keys: [
      { isSigner: false, isWritable: true, pubkey: new_user_account.publicKey }, 
      { isSigner: true, isWritable: true, pubkey: payer.publicKey }, 
    ],

    data: Buffer.from(concat),
    programId: time_capsule_program_id
  })

  const message = new TransactionMessage({
    instructions: [new_user, ix],
    payerKey: payer.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash
  }).compileToV0Message();

  
  const tx = new VersionedTransaction(message);
   tx.sign([payer, new_user_account]);

  connection.sendTransaction(tx);


    console.log("New user account => " + new_user_account.publicKey.toString())

    const accountdataa = deserialize(UserSchema, User, Buffer.from(encoded));

  return new_user_account;    
 }

 const read_user = async () => {

  const user_acc_inf = await connection.getAccountInfo(user)

  const user_inf_deserialize = deserialize(UserSchema, User, user_acc_inf!.data);
  console.log("User name => " + user_inf_deserialize.name);
  console.log("User address => " + user_inf_deserialize.useraddress);
 }

 const create_locked_fund_wallet_account = async () => {

   const new_locked_fund_wallet_account = Keypair.generate();
   const space = 49; 
   const lamports = await connection.getMinimumBalanceForRentExemption(space);
  
   
   const fund_acc = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey : new_locked_fund_wallet_account.publicKey,
    lamports,
    space,
    programId: time_capsule_program_id
   })

  
  const tx = new Transaction().add(fund_acc);


  await connection.sendTransaction(tx, [payer, new_locked_fund_wallet_account], { skipPreflight: false, preflightCommitment: 'confirmed' });

  console.log("Locked fund wallet account created: ", new_locked_fund_wallet_account.publicKey.toString());

  return new_locked_fund_wallet_account;
 }

 const lockfon_read = async () => {

  const locked_account_info = await connection.getAccountInfo(fund)
  const locked_account_info_deserialize = deserialize(FundSchema, Fund, locked_account_info!.data);

  console.log("Locked account amount => " + locked_account_info_deserialize.amount);
  console.log("Locked account unlock time => " + locked_account_info_deserialize.unlocktime);
  console.log("Locked account written => " + locked_account_info_deserialize.isinit);
  console.log("Locked account address => " + locked_account_info_deserialize.userowner);

 }

const fund_transfer = async (amount: bigint) => 
{
  const fund_transfer = new Fund();
  fund_transfer.amount = amount;
  fund_transfer.unlocktime = BigInt(1723895986);


  const encoded = serialize(FundSchema,fund_transfer);
  const concat = Uint8Array.of(1, ...encoded);
  
  const ix = new TransactionInstruction({ 
    keys: [
      { isSigner: false, isWritable: true, pubkey: user}, 
      { isSigner: true, isWritable: true, pubkey: payer.publicKey }, 
      { isSigner: false, isWritable: true, pubkey: fund }, 
    ],

    data: Buffer.from(concat),
    programId: time_capsule_program_id
  })

  const transaction = new Transaction().add(ix);
  transaction.feePayer = payer.publicKey;

  const txhash = await connection.sendTransaction(transaction, [payer]);

  console.log(`Fund transfer information was written to the locked fund wallet. ${txhash}`);
}


const withdraw_fund = async () => {
  const ixx = new TransactionInstruction({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: false },
      { pubkey: fund, isSigner: false, isWritable: true },
    ],
    
    data: Buffer.from([2]),
    programId: time_capsule_program_id
  }) 


  const message = new TransactionMessage({
    instructions: [ixx],
    payerKey: payer.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash
  }).compileToV0Message();

  
  const tx = new VersionedTransaction(message);
   tx.sign([payer]);

  connection.sendTransaction(tx)
  console.log("Fund Withdrawal Transaction was made.")

  const number = new Read();
  number.amount = BigInt(123456);

  const encoded = serialize(ReadSchema,number);
  const deserializedData = deserialize(ReadSchema, Read, Buffer.from(encoded));
  console.log( deserializedData)
}

const read_fund_information = async () => {
  const accountInfo = await connection.getAccountInfo(fund);

  if (accountInfo === null) {
    console.log("Locked fund wallet account not found.");
    return;
  }

  const fund_information  = deserialize(FundSchema, Fund, accountInfo.data);
  console.log("Fund Amount:", fund_information.amount.toString());

  const unlocktime = Number(fund_information.unlocktime);
  console.log("Unlock time:", new Date(unlocktime * 1000).toLocaleString());
}
 //create_user()
//read_user()
//create_locked_fund_wallet_account()
// fund_transfer(BigInt(1000));
//lockfon_read()
// withdraw_fund()
read_fund_information()
