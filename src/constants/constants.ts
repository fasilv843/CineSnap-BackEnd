export const OTP_TIMER = 1000 * 60 * 3  
export const TheaterShowLimit = 6
export const maxDistance = 100 // users can see theaters in 100 km radius
export const accessTokenExp = 15 * 60 // 15 min
export const refreshTokenExp = 3 * 60 * 60 // 3 hour
export const tempTokenExp = 10 * 60 // 10 min

const now = new Date()
export const FullRefundTime = new Date(now.setDate(now.getDate() - 3)); // 3 Days before
export const HalfRefundTime = new Date(now.setDate(now.getDate() - 1)) // Yesterday
export const QuarterRefundTime = new Date(now.setHours(now.getHours() - 4)) // 4 Hour Before

export const emailRegex = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
export const passwordMinLength = 8
export const OTPRegex = '^[1-9][0-9]{3}$'
export const ZipRegex = '^[1-9][0-9]{5}$'
export const userNameMinLength = 3
export const userNameMaxLength = 20
export const nameRegex = '^[a-zA-Z ]{3,20}$'
export const passwordRegex = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$'