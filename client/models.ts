
import { serialize, deserialize, Schema } from "borsh";

export class User { 
  name: string = "";
  useraddress: Uint8Array = new Uint8Array(32);

  constructor(fields: { name: string; useraddress: Uint8Array } | undefined = undefined) {
    if (fields) {
      this.name = fields.name;
      this.useraddress = fields.useraddress;
    }
  }
}

export const UserSchema = new Map([
  [User, {
    kind: "struct",
    fields: [
      ["name", "string"],
      ["useraddress", ["u8", 32]],
    ]
  }]
]);


export class Fund {
  isinit: number =0;
  amount: bigint;
  unlocktime: bigint;
  userowner:Uint8Array = new Uint8Array(32);
  


  constructor(fields: { isinit:number; amount: bigint; unlocktime: bigint; userowner: Uint8Array; } | undefined = undefined) {
    if (fields) {
      this.isinit = fields.isinit;
      this.amount = fields.amount;
      this.unlocktime = fields.unlocktime;
      this.userowner = fields.userowner;
     
    } else {
      this.amount = BigInt(0);
      this.unlocktime = BigInt(0);
      
    }
  }
}

export const FundSchema = new Map([
  [Fund, {
    kind: 'struct',
    fields: [
      ['isinit', 'u8'],
      ['amount', 'u64'],
      ['unlocktime', 'u64'],
      ["userowner", ["u8", 32]],
    ],
  }],
]);

export class Read {
  amount: bigint = BigInt(0);

  constructor(fields: { amount: bigint; } | undefined = undefined) {
    if (fields) {
      this.amount = fields.amount;
      
    } 
  }
}

export const ReadSchema = new Map([
  [Read, {
    kind: 'struct',
    fields: [
      ['amount', 'u64'],
    ],
  }],
]);


export class Transfer {
  amount: bigint = BigInt(0);
  unlocktime: bigint = BigInt(0);

  constructor(fields: { amount: bigint; unlocktime: bigint } | undefined = undefined) {
    if (fields) {
      this.amount = fields.amount;
      this.unlocktime = fields.unlocktime;
    } 
  }
}

export const TransferSchema = new Map([
  [Transfer, {
    kind: 'struct',
    fields: [
      ['amount', 'u64'],
      ['unlocktime', 'u64'],
    ],
  }],
]);

  