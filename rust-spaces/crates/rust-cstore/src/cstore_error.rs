use std::error::Error;
use std::fmt::Display;
use std::fmt;
use crate::data::data_store::DataStore;

#[derive(Debug)]
pub struct CStoreError {
    pub inner: Option<Box<Error>>,
    pub code: CStoreErrorCode,
    pub message: Option<String>,
}

#[derive(Debug)]
pub enum CStoreErrorCode {
    InsertFailed
}

impl Display for CStoreError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self.message.as_ref() {
            Some(msg) => write!(f, "CStoreError: {:?}: {}", self.code, msg),
            None => write!(f, "CStoreError: {:?}", self.code),
        }
    }
}

impl Error for CStoreError {}
