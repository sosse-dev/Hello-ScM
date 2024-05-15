/**
* Array route untuk publik
* Router yang tidak dibutuhkan untuk autentikasi
* @type {string[]}
*/
export const publicRoutes = [
    "/auth/new-verification",
    '/api/uploadthing',
    "/report"
]

/**
* Array route untuk autentikasi
* Router di set dialihkan ke Halaman Utama
* @type {string[]}
*/
export const authRoutes = [
    "/login",
    "/sign-up",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
]

/**
* Prefix untuk router api autentikasi
* Router yang dimulai dengan prefix ini digunakan untuk autentikasi
* @type {string}
*/
export const apiAuthPrefix = "/api/auth"

/**
* Default route untuk pengalihan setelah login
* @type {string}
*/
export const DEFAULT_LOGIN_REDIRECT = "/"