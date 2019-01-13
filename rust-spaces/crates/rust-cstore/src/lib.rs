mod data;
mod cstore;
mod cstore_error;

pub use crate::cstore::CStore;
pub use crate::cstore::CStoreData;
pub use crate::cstore_error::CStoreError;
pub use crate::cstore_error::CStoreErrorCode;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
