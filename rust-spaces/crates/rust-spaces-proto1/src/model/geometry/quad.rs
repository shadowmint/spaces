use crate::model::geometry::vector3::Vector3;

#[derive(Copy, Clone, Debug)]
pub struct Quad {
    points: [Vector3; 2],
    normal: Vector3,
}

impl Quad {
    /// Returns a new quad instance
    pub fn new(p1: Vector3, p2: Vector3, normal: Vector3) -> Quad {
        return Quad {
            points: [p1, p2],
            normal,
        };
    }
}