export class Endpoints {
  static devUrl = "http://localhost:5000";
  static prodUrl = "https://lilucky-backend.vercel.app";
  static baseUrl = `${Endpoints.devUrl}/api`;
  static auth = `${Endpoints.baseUrl}/auth`
  static login = `${Endpoints.baseUrl}/auth/login`;
  static forgetPassword = `${Endpoints.auth}/forgot-password`;
  static resetPassword = `${Endpoints.auth}/reset-password-otp`;
  static register = `${Endpoints.auth}/register`;
  static user = `${Endpoints.baseUrl}/user`;
  static account = `${Endpoints.baseUrl}/user/account`;
  // static name = `${Endpoints.baseUrl}/user/name`;
  static products = `${Endpoints.baseUrl}/products`;
  static cart = `${Endpoints.baseUrl}/cart`;
  static category = `${Endpoints.baseUrl}/category`;
  static order = `${Endpoints.baseUrl}/order`;

}
