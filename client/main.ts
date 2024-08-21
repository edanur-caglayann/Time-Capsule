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
  import bs58 from 'bs58'
  
  // Solana blockchain'inde hesap oluşturma ver veri okuma
  
  import { baseDecode, deserialize, serialize } from "borsh";
  import { Kullanici, KullaniciSchema, Fon, FonSchema, OkumaSchema, Okuma, Transfer, TransferSchema} from "./models";

 
  
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const privatekey = [73,215,148,198,217,94,8,55,199,227,116,64,235,204,93,214,158,11,101,6,21,14,96,37,183,188,73,65,240,184,27,57,207,223,23,148,245,129,207,145,123,147,243,116,59,215,69,168,179,237,249,249,102,202,216,244,109,192,222,176,49,136,218,89]
 
  const payer = Keypair.fromSecretKey(Uint8Array.from(privatekey));

  const time_capsule_program_id = new  PublicKey("DhMtAtMpeXdyKEZhVLrehxGFDWU2hH92TjqtvNx91Fky")

 const kullanici_olustur = async () => {
   const kullanici = new Kullanici();
   kullanici.yas = 22,
   kullanici.Kullaniciadres = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
     16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]);


    const encoded = serialize(KullaniciSchema, kullanici);
    const concat = Uint8Array.of(0, ...encoded);

    const yeni_kullanici_hesabi = Keypair.generate()


const ix = new TransactionInstruction({ 
    keys: [
      { isSigner: true, isWritable: true, pubkey: yeni_kullanici_hesabi.publicKey }, // Kullanıcı hesap bilgileri
      { isSigner: true, isWritable: true, pubkey: payer.publicKey },
      { isSigner: false, isWritable: false, pubkey: SystemProgram.programId }, // Kullanıcı cüzdan hesap bilgileri
       
    ],

    data: Buffer.from(concat),
    programId: time_capsule_program_id
  })

  const message = new TransactionMessage({
    instructions: [ix],
    payerKey: payer.publicKey,
    recentBlockhash: (await connection.getLatestBlockhash()).blockhash
  }).compileToV0Message();

  
  const tx = new VersionedTransaction(message);
   tx.sign([payer, yeni_kullanici_hesabi]);

  connection.sendTransaction(tx);


    console.log("Yeni kullanıcının hesabı => " + yeni_kullanici_hesabi.publicKey.toString())

    const accountdataa = deserialize(KullaniciSchema, Kullanici, Buffer.from(encoded));

  return yeni_kullanici_hesabi;    
 }

 const kullanici_oku = async () => {
  const kullanici_hesabi = new PublicKey("2LSMHpQuUfXmU7YyNJDz4os8R2rCYtUzeM9rJkcjtYr8");

  const kullanici_hesap_bilgisi = await connection.getAccountInfo(kullanici_hesabi)
 
  
  console.log(kullanici_hesap_bilgisi?.data.length)

  const kullanici_bilgi_deserialize = deserialize(KullaniciSchema, Kullanici, kullanici_hesap_bilgisi!.data);
  console.log("Kullanicinin yas => " + kullanici_bilgi_deserialize.yas);
  console.log("Kullanicinin adresi => " + kullanici_bilgi_deserialize.Kullaniciadres);
 }

 const kilitli_fon_cuzdab_hesabi_olustur = async () => {

  const kilitliFon = new Fon({
    isinit: 0, 
    miktar: 0,
    kilitacmazamani: 0, 
    kullaniciowner: payer.publicKey.toBytes() 
  })

   // Veriyi serialize edip, transaction'da kullanmak üzere Uint8Array olarak dönüştürelim
   const encoded = serialize(FonSchema, kilitliFon);
   const concat = Uint8Array.of(1, ...encoded);

   // Yeni Keypair oluşturalım
   const yeniKilitliFonCuzdanHesabi = Keypair.generate();
   
   // TransactionInstruction oluşturma
   const ix = new TransactionInstruction({
     keys: [
       {isSigner: true, isWritable: true, pubkey: payer.publicKey }, 
       { isSigner: true, isWritable: true, pubkey: yeniKilitliFonCuzdanHesabi.publicKey }, 
       { isSigner: false, isWritable: false, pubkey: SystemProgram.programId } 
     ],
     data: Buffer.from(concat),
     programId: time_capsule_program_id 
   });
 
   // TransactionMessage oluşturma
   const message = new TransactionMessage({
     instructions: [ix],
     payerKey: payer.publicKey,
     recentBlockhash: (await connection.getLatestBlockhash()).blockhash
   }).compileToV0Message();
 
   // Transaction oluşturma ve imzalama
   const tx = new VersionedTransaction(message);
   tx.sign([payer, yeniKilitliFonCuzdanHesabi]);
 
   // Transaction'ı gönderme
   await connection.sendTransaction(tx);
 
   console.log("Kilitli fon cüzdan hesabı oluşturuldu: " + yeniKilitliFonCuzdanHesabi.publicKey.toString());
 
   return yeniKilitliFonCuzdanHesabi;
 };
  
 
  const kilitlifon_oku = async () => {
  const yeni_kilitli_fon_cuzdan_hesabi = new PublicKey("CSmFBUMbcvvZWdVo8QNVKJY6mHU2JNXM14Pa1bqvX7BD");

  const kilitli_hesap_bilgisi = await connection.getAccountInfo(yeni_kilitli_fon_cuzdan_hesabi)

  const kilitli_hesap_bilgisi_deserialize = deserialize(FonSchema, Fon, kilitli_hesap_bilgisi!.data);

  console.log("Kilitli hesap miktar => " + kilitli_hesap_bilgisi_deserialize.miktar);
  console.log("Kilitli hesap kilit acma zamani => " + kilitli_hesap_bilgisi_deserialize.kilitacmazamani);
  console.log("Kilitli hesap yazildi => " + kilitli_hesap_bilgisi_deserialize.isinit);
  console.log("Kilitli hesap adres => " + kilitli_hesap_bilgisi_deserialize.kullaniciowner);

 }
const fon_transferi = async (miktar: number) => 
{
  const fon_islemi = new Fon();
  fon_islemi.miktar = miktar;
  fon_islemi.kilitacmazamani = 123;

  const yeni_kilitli_fon_cuzdan_hesabi = new PublicKey("CSmFBUMbcvvZWdVo8QNVKJY6mHU2JNXM14Pa1bqvX7BD");
  const kullanici_hesabi =  new PublicKey("2LSMHpQuUfXmU7YyNJDz4os8R2rCYtUzeM9rJkcjtYr8");

  const encoded = serialize(FonSchema,fon_islemi);
  const concat = Uint8Array.of(2, ...encoded);
  
  const ix = new TransactionInstruction({ 
    keys: [
      { isSigner: false, isWritable: true, pubkey: kullanici_hesabi}, 
      { isSigner: true, isWritable: true, pubkey: payer.publicKey }, 
      { isSigner: false, isWritable: true, pubkey: yeni_kilitli_fon_cuzdan_hesabi }, 
    ],

    data: Buffer.from(concat),
    programId: time_capsule_program_id
  })

  const transaction = new Transaction().add(ix);
  transaction.feePayer = payer.publicKey;

  const txhash = await connection.sendTransaction(transaction, [payer]);

  console.log(`Fon transferi bilgileri kilitli fon cüzdanına yazıldı.`);
}

const fon_cekme = async () => {
  const yeni_kilitli_fon_cuzdan_hesabi = new PublicKey("CSmFBUMbcvvZWdVo8QNVKJY6mHU2JNXM14Pa1bqvX7BD");

  const ixx = new TransactionInstruction({
    keys: [
      { pubkey: payer.publicKey, isSigner: true, isWritable: false },
      { pubkey: yeni_kilitli_fon_cuzdan_hesabi, isSigner: false, isWritable: true },
    ],
    
    data: Buffer.from([3]),
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
  console.log("Fon Çekme İşlemi yapıldı.")

  const sayi = new Okuma();
  sayi.miktar = BigInt(123456);

  const encoded = serialize(OkumaSchema,sayi);
  const deserializedData = deserialize(OkumaSchema, Okuma, Buffer.from(encoded));
  
}

const fon_bilgilerini_goster = async () => {
  const yeni_kilitli_fon_cuzdan_hesabi = new PublicKey("A38dN9JVSN5HHLKJyngp8wQP4K1PqS5NWqCuF7vs113f");

  // Kilitli fon cüzdanının verilerini blockchainden alırım
  const accountInfo = await connection.getAccountInfo(yeni_kilitli_fon_cuzdan_hesabi);

  if (accountInfo === null) {
    console.log("Kilitli fon cüzdan hesabı bulunamadı.");
    return;
  }

  const fonBilgileri = deserialize(FonSchema, Fon, accountInfo.data);

  console.log("Fon Miktarı:", fonBilgileri.miktar.toString());

  const kilitAcmaZamani = Number(fonBilgileri.kilitacmazamani);
  console.log("Kilit Açma Zamanı:", new Date(kilitAcmaZamani * 1000).toLocaleString());
}
 //kullanici_olustur()
 //kullanici_oku()
 //kilitli_fon_cuzdab_hesabi_olustur()
 //fon_transferi(100);
 //kilitlifon_oku()
 //fon_cekme()
 // fon_bilgilerini_goster()
