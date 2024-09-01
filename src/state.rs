use borsh::{BorshDeserialize, BorshSerialize};
use borsh_derive::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct User{
    pub name:String, 
    pub useraddress:[u8;32],
}

#[derive(BorshSerialize, BorshDeserialize, Debug, Clone, PartialEq)]
pub struct Fund{
    pub isinit: u8 ,
    pub amount:u64, //8byte
    pub unlocktime: u64, // UNIX timestamp 8byte
    pub userowner: [u8;32],
}