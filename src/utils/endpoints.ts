export class Endpoints {
  static devUrl = "http://localhost:5000/api";
  static prodUrl = "https://lilucky-backend-ynmx.vercel.app/api";
  static baseUrl = Endpoints.prodUrl;
  static auth = `${Endpoints.baseUrl}/auth`
  static login = `${Endpoints.baseUrl}/auth/login`;
  static forgetPassword = `${Endpoints.baseUrl}/auth/forgot-password`;
  static resetPassword = `${Endpoints.baseUrl}/auth/reset-password-otp`;
  static register = `${Endpoints.baseUrl}/auth/register`;
  static user = `${Endpoints.baseUrl}/user`;
  static account = `${Endpoints.baseUrl}/user/account`;
  // static name = `${Endpoints.baseUrl}/user/name`;
  static products = `${Endpoints.baseUrl}/products`;
  static cart = `${Endpoints.baseUrl}/cart`;
  static category = `${Endpoints.baseUrl}/category`;
  static order = `${Endpoints.baseUrl}/order`;
//   static cart = `${Endpoints.baseUrl}/cart`;

}
