use crate::{error::RNGProgramError::InvalidInstruction, state::{User,Fund}, };
use borsh::BorshDeserialize;
use solana_program::{msg, program_error::ProgramError};

#[derive(Debug, PartialEq)]
pub enum RNGProgramInstruction { 
UserActions{data:User},
FundTransaction{data:Fund},
WithdrawFund
,
}

impl RNGProgramInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
      msg!("Program call");
  
      let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
      {msg!("{}", rest.len());
       msg!("{}", tag);
    }
       
      Ok(match tag {
        0=> Self::UserActions{
          data:User::try_from_slice(&rest)?
        },
        1=> Self::FundTransaction{
          data:Fund::try_from_slice(&rest)?
        },
        2=> Self::WithdrawFund
        ,
  
        _ => return Err(InvalidInstruction.into()),
      })
    }
  }
 
  