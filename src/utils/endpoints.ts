export class Endpoints {
  static devUrl = "http://localhost:5000/api";
  static baseUrl = Endpoints.devUrl;
// static prodUrl = "https://well-nest-back.vercel.app";
  static login = `${Endpoints.baseUrl}/auth/login`;
  static register = `${Endpoints.baseUrl}/auth/register`;
  static user = `${Endpoints.baseUrl}/user`;
  static profile = `${Endpoints.baseUrl}/user/account`;
  static name = `${Endpoints.baseUrl}/user/name`;

  static products = `${Endpoints.baseUrl}/products`;
  static cart = `${Endpoints.baseUrl}/cart`;
  static category = `${Endpoints.baseUrl}/category`;
  static order = `${Endpoints.baseUrl}/order`;
//   static cart = `${Endpoints.baseUrl}/cart`;

}
