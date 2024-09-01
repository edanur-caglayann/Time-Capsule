
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{ 
    account_info::{next_account_info, AccountInfo}, clock::Clock, entrypoint::ProgramResult, msg, program::invoke, program_error::ProgramError, pubkey::{Pubkey}, system_instruction::{self}, sysvar::Sysvar
    };
use crate::{instruction::RNGProgramInstruction, state::{Fund, User}, };
use crate::error::RNGProgramError::{ZamanError,AricmeticError};
pub struct Processor;
impl Processor {
    pub fn process(
      _program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
      ) -> ProgramResult {
        let instruction: RNGProgramInstruction = RNGProgramInstruction::unpack(instruction_data)?;
    
    
        match instruction { 
          RNGProgramInstruction::UserActions{data} => {
            Self::user_actions(_program_id,accounts,data)
          },
          RNGProgramInstruction::FundTransaction{data} => {
            Self::fund_transaction(_program_id,accounts,data)
          },
          RNGProgramInstruction::WithdrawFund=> {
            Self::withdraw_fund(_program_id,accounts)
          },
        }
      }


      pub fn user_actions(
        _program_id: &Pubkey,
        accounts: &[AccountInfo], 
        _actions1: User,
      ) -> ProgramResult {
        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();

        let user_account = next_account_info(accounts_iter)?; 
        let payer = next_account_info(accounts_iter)?; 
       
       
        if user_account.owner != _program_id{
          panic!()
        }
       
        if !payer.is_signer { 
          panic!()
        }

        let user_information = User {
          name:"Eda".to_string(),
          useraddress:payer.key.to_bytes()
     
       };

       user_information.serialize(&mut &mut user_account.data.borrow_mut()[..])?;
  
        Ok(())
      }
      
      
      pub fn fund_transaction(
        _program_id: &Pubkey, 
        accounts: &[AccountInfo], 
        actions2: Fund,
      ) -> ProgramResult {
        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();
      
        let user_account = next_account_info(accounts_iter)?; 
        let payer = next_account_info(accounts_iter)?; 
        let locked_fund_wallet_account = next_account_info(accounts_iter)?; 
    
        let control = Fund::try_from_slice(&locked_fund_wallet_account.data.borrow())?; 

       
        if !payer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        if control.isinit != 1 {
          msg!("Written to locked fund.")
        }
       
        let user_read = User::try_from_slice(&user_account.data.borrow())?;
        let payer_from_bytes = Pubkey:: new_from_array(user_read.useraddress);

        if &payer_from_bytes != payer.key {
          panic!()
        }
        
        let locked_fund_wallet_account_data = Fund{
          amount: actions2.amount,
          unlocktime: actions2.unlocktime,
          userowner: payer.key.to_bytes(),
          isinit: 1

        };

       
        **user_account.try_borrow_mut_lamports()? -= actions2.amount;
        **locked_fund_wallet_account.try_borrow_mut_lamports()? += actions2.amount;
        
        
        locked_fund_wallet_account_data.serialize(&mut &mut locked_fund_wallet_account.data.borrow_mut()[..])?;
    
        Ok(())
      }

     
      pub fn withdraw_fund(
        _program_id: &Pubkey,
        accounts: &[AccountInfo], 
      ) -> ProgramResult {
        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();
        
        let user_account: &AccountInfo<'_> = next_account_info(accounts_iter)?; 
        let locked_fund_wallet_account: &AccountInfo<'_> = next_account_info(accounts_iter)?;     
        
        if locked_fund_wallet_account.owner != _program_id {
            msg!("Locked fund wallet account is owned by wrong program");
            panic!()
        }
        
       
        let mut locked_fund_wallet_read = Fund::try_from_slice(&locked_fund_wallet_account.data.borrow())?;

        
        let clock = Clock::get()?; 
        let now = clock.unix_timestamp as u64;
        if now < locked_fund_wallet_read.unlocktime {
            msg!("The lock period has not expired yet");
            return Err((ZamanError.into()));
        }
    
        
        let fund_amount = locked_fund_wallet_read.amount;
        
       
        **locked_fund_wallet_account.try_borrow_mut_lamports()? -= fund_amount;
        **user_account.try_borrow_mut_lamports()? += fund_amount;
    
        
        locked_fund_wallet_read.amount = 0;
        locked_fund_wallet_read.serialize(&mut &mut locked_fund_wallet_account.data.borrow_mut()[..])?;
    
        Ok(())
    }
    
  
      
}