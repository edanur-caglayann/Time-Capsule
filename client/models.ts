
import { serialize, deserialize, Schema } from "borsh";

export class Kullanici { 
  isim: string = "";
  Kullaniciadres: Uint8Array = new Uint8Array(32);

  constructor(fields: { isim: string; Kullaniciadres: Uint8Array } | undefined = undefined) {
    if (fields) {
      this.isim = fields.isim;
      this.Kullaniciadres = fields.Kullaniciadres;
    }
  }
}

export const KullaniciSchema = new Map([
  [Kullanici, {
    kind: "struct",
    fields: [
      ["isim", "string"],
      ["Kullaniciadres", ["u8", 32]],
    ]
  }]
]);


export class Fon {
  isinit: number =0;
  miktar: bigint;
  kilitacmazamani: bigint;
  kullaniciowner:Uint8Array = new Uint8Array(32);
  


  constructor(fields: { isinit:number; miktar: bigint; kilitacmazamani: bigint; kullaniciowner: Uint8Array; } | undefined = undefined) {
    if (fields) {
      this.isinit = fields.isinit;
      this.miktar = fields.miktar;
      this.kilitacmazamani = fields.kilitacmazamani;
      this.kullaniciowner = fields.kullaniciowner;
     
    } else {
      this.miktar = BigInt(0);
      this.kilitacmazamani = BigInt(0);
      
    }
  }
}

export const FonSchema = new Map([
  [Fon, {
    kind: 'struct',
    fields: [
      ['isinit', 'u8'],
      ['miktar', 'u64'],
      ['kilitacmazamani', 'u64'],
      ["kullaniciowner", ["u8", 32]],
    ],
  }],
]);

export class Okuma {
  miktar: bigint = BigInt(0);

  constructor(fields: { miktar: bigint; } | undefined = undefined) {
    if (fields) {
      this.miktar = fields.miktar;
      
    } 
  }
}

export const OkumaSchema = new Map([
  [Okuma, {
    kind: 'struct',
    fields: [
      ['miktar', 'u64'],
    ],
  }],
]);


export class Transfer {
  miktar: bigint = BigInt(0);
  kilitacmazamani: bigint = BigInt(0);

  constructor(fields: { miktar: bigint; kilitacmazamani: bigint } | undefined = undefined) {
    if (fields) {
      this.miktar = fields.miktar;
      this.kilitacmazamani = fields.kilitacmazamani;
    } 
  }
}

export const TransferSchema = new Map([
  [Transfer, {
    kind: 'struct',
    fields: [
      ['miktar', 'u64'],
      ['kilitacmazamani', 'u64'],
    ],
  }],
]);

    /*
  BigInt, JavaScript'te 2^53-1'den büyük 
  tamsayıları temsil etmek için kullanılan bir veri türüdür.
  Number veri türünün(2^53-1 aralığı) sınır aralığını aşan daha büyük
  tamsayılar için BigInt kullanılır.
    */
  
  