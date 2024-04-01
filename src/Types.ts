// Some basic, but more descriptive types that should not need an explanation.
// These are basically just hints for the developer.

// Like, obviously a u32 can't be negative, but its not enforced by the type system...
// stupid type system man.
// don't get me started on floats and integers.

export type u8 = number;
export type i8 = number;
export type u16 = number;
export type i16 = number;
export type u32 = number;
export type i32 = number;
export type f32 = number;

export type GLVertexComponents = 1 | 2 | 3 | 4;