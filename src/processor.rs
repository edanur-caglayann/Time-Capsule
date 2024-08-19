
use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{ 
    account_info::{next_account_info, AccountInfo}, clock::Clock, entrypoint::ProgramResult, msg, program::invoke, program_error::ProgramError, pubkey::{Pubkey}, system_instruction::{self}, sysvar::Sysvar
    };
use crate::{instruction::RNGProgramInstruction, state::{Fon, Kullanici}, };
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
          RNGProgramInstruction::KullaniciIslemleri{data} => {
            Self::kullanici_islemleri(_program_id,accounts,data)
          },
          RNGProgramInstruction::FonTransferIslemi{data} => {
            Self::fon_transfer(_program_id,accounts,data)
          },
          RNGProgramInstruction::FonCekmeIslemi => {
            Self::fon_cekme(_program_id,accounts)
          },
          

        
        }
      }


      pub fn kullanici_islemleri(
        _program_id: &Pubkey,
        accounts: &[AccountInfo], 
        _islemler1: Kullanici,
      ) -> ProgramResult {
        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();

        let kullanici_hesap = next_account_info(accounts_iter)?; // Kullanıcı hesap bilgileri
        let payer = next_account_info(accounts_iter)?; // Kullanıcı cüzdan hesap bilgileri
       
       
        if kullanici_hesap.owner != _program_id{
          panic!()
        }
        msg!("1");
        if !payer.is_signer { // imzalayan değilse hata alır
          panic!()
        }
        msg!("2");

        let yeni_kullanici_bilgileri = Kullanici {
          isim:"Eda".to_string(),
          kullaniciadres:payer.key.to_bytes()
     
       };

       yeni_kullanici_bilgileri.serialize(&mut &mut kullanici_hesap.data.borrow_mut()[..])?;
  
        Ok(())
      }
      
      
      pub fn fon_transfer(
        _program_id: &Pubkey, 
        accounts: &[AccountInfo], 
        islemler2: Fon,
      ) -> ProgramResult {
        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();
        msg!("9");
        let kullanici_hesap = next_account_info(accounts_iter)?; // Kullanıcı hesap bilgileri
        let payer = next_account_info(accounts_iter)?; // Kullanıcı cüzdan hesap bilgileri
        let kilitli_fon_cuzdan_hesap = next_account_info(accounts_iter)?; // Kilitli fon cüzdan hesap bilgileri
    
        // Kullanıcı imzasını kontrol edelim
        if !payer.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }
        // kullanıcı hesabı payere ait mi
        let kullanici_okuma = Kullanici::try_from_slice(&kullanici_hesap.data.borrow())?;
        let payer_from_bytes = Pubkey:: new_from_array(kullanici_okuma.kullaniciadres);

        if &payer_from_bytes != payer.key {
          msg!("22")
        }
        
        let kilitli_fon_cuzdan_hesap_data = Fon{
          miktar: islemler2.miktar,
          kilitacmazamani: islemler2.kilitacmazamani,
          kullaniciowner: payer.key.to_bytes(),

        };
        msg!("8");

        // Kullanıcının cüzdan hesabından(payer) kilitli fon cüzdan hesabına fon transferi
        **kullanici_hesap.try_borrow_mut_lamports()? -= islemler2.miktar;
        **kilitli_fon_cuzdan_hesap.try_borrow_mut_lamports()? = islemler2.miktar;

    
        // Kilitli fon bilgilerini kilitli fon cüzdan hesabına yazalım
        kilitli_fon_cuzdan_hesap_data.serialize(&mut &mut kilitli_fon_cuzdan_hesap.data.borrow_mut()[..])?;
    
        Ok(())
      }

     
      pub fn fon_cekme(
        _program_id: &Pubkey,
        accounts: &[AccountInfo], 
      ) -> ProgramResult {
        let accounts_iter: &mut std::slice::Iter<'_, AccountInfo<'_>> = &mut accounts.iter();
        
        let kullanici_hesap: &AccountInfo<'_> = next_account_info(accounts_iter)?; 
        let kilitli_fon_cuzdan_hesap: &AccountInfo<'_> = next_account_info(accounts_iter)?;     
        
        if kilitli_fon_cuzdan_hesap.owner != _program_id {
            msg!("Kilitli fon cüzdan hesabı yanlış program tarafından sahipleniliyor");
            panic!()
        }
        
        // Kilitli fon bilgilerini okuyalım
        let mut kilitli_fon_okuma = Fon::try_from_slice(&kilitli_fon_cuzdan_hesap.data.borrow())?;
      msg!("1");

        // Kilit süresi doldu mu? 
        let clock = Clock::get()?; // Belirlenen süreyi alarak bakalım
        let simdikizaman = clock.unix_timestamp as u64;
        if simdikizaman < kilitli_fon_okuma.kilitacmazamani {
            msg!("Kilit süresi henüz dolmadı");
            return Err((ZamanError.into())); // Kilit süresi dolmadıysa hata
        }
    
        // let topla = kilitli_fon_okuma.miktar.checked_add(2).ok_or(AricmeticError)?;

        // Fonları kullanıcıya geri verme
        let fon_miktari = kilitli_fon_okuma.miktar;
        
        // Lamportları transfer edelim
        **kilitli_fon_cuzdan_hesap.try_borrow_mut_lamports()? -= fon_miktari;
        **kullanici_hesap.try_borrow_mut_lamports()? += fon_miktari;
    
        // Kilitli fon miktarını sıfırlama
        kilitli_fon_okuma.miktar = 0;
        kilitli_fon_okuma.serialize(&mut &mut kilitli_fon_cuzdan_hesap.data.borrow_mut()[..])?;
    
        Ok(())
    }
    
  
      
}