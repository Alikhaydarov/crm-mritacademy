export default {
  meEndpoint: '/auth/me', // Foydalanuvchi ma'lumotlari endpointi
  loginEndpoint: '/jwt/login', // Login endpointi
  registerEndpoint: '/jwt/register', // Ro'yxatdan o'tish endpointi
  storageTokenKeyName: 'accessToken', // Local storage uchun kalit
  onTokenExpiration: 'refreshToken', // Token muddati tugaganda nima qilish
};
