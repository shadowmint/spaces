use std::sync::{Arc, Mutex};
use crate::data::data_store::DataStore;
use crate::CStoreError;
use crate::CStoreErrorCode;
use std::error::Error;

pub trait CStoreData {
    /// Return the unique data object key for this object.
    fn data_object_key(&self) -> i64;
}

#[derive(Clone)]
pub struct CStore<T> {
    store: Arc<Mutex<DataStore<T>>>
}

impl<T> CStore<T> {
    /// Create a new instance
    pub fn new() -> CStore<T> {
        return CStore {
            store: Arc::new(Mutex::new(DataStore::<T>::new()))
        };
    }

    /// Insert a record into the store
    pub fn insert(&mut self, data: impl CStoreData) -> Result<bool, CStoreError> {
        match self.store.try_lock() {
            Ok(mut store) => store.insert(data),

            Err(e) => Err(CStoreError {
                code: CStoreErrorCode::InsertFailed,
                message: Some(e.description().to_string()),
                inner: None,
            })
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::CStore;
    use crate::CStoreData;

    impl CStoreData for i32 {
        fn data_object_key(&self) -> i64 {
            return *self as i64;
        }
    }

    #[test]
    fn test_create_store() {
        let _ = CStore::<i32>::new();
    }

    #[test]
    fn test_insert_into_store() {
        let mut store = CStore::<i32>::new();
        store.insert(32);
    }
}
