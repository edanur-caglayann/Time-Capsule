use crate::{error::RNGProgramError::InvalidInstruction, state::{Kullanici,Fon}, };
use borsh::BorshDeserialize;
use solana_program::{msg, program_error::ProgramError};

#[derive(Debug, PartialEq)]
pub enum RNGProgramInstruction { 
KullaniciIslemleri{data:Kullanici},
KilitliHesapIslemleri{data:Fon},
FonTransferIslemi{data:Fon},
FonCekmeIslemi,
}

impl RNGProgramInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
      msg!("Program call");
  
      let (tag, rest) = input.split_first().ok_or(InvalidInstruction)?;
      {msg!("{}", rest.len());
       msg!("{}", tag);
    }
       
      Ok(match tag {
        0=> Self::KullaniciIslemleri{
          data:Kullanici::try_from_slice(&rest)?
        },
        1=> Self::KilitliHesapIslemleri {
          data:Fon:: try_from_slice(&rest)?
        },
        2=> Self::FonTransferIslemi{
          data:Fon::try_from_slice(&rest)?
        },
        3=> Self::FonCekmeIslemi,
  
        _ => return Err(InvalidInstruction.into()),
      })
    }
  }
  
  