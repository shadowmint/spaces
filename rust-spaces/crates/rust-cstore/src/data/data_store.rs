pub struct DataStore<T> {
    data: Vec<T>
}

impl<T> DataStore<T> {
    /// Create a new instance
    pub fn new() -> DataStore<T> {
        return DataStore {
            data: Vec::new()
        };
    }
}