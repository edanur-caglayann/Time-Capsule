use borsh::{BorshDeserialize, BorshSerialize};
use borsh_derive::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct Kullanici{
    pub yas: u8,
    pub kullaniciadres:[u8;32],
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct Fon{
    pub isinit: u8 , 
    pub miktar:u64, //8byte 
    pub kilitacmazamani: u64, // UNIX timestamp 8byte
    pub kullaniciowner: [u8;32], 
}