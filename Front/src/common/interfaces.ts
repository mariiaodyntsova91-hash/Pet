export interface DataResponse {
  message: string;
}

// Дані, які форма надсилає до NestJS під час входу.
export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

// Формат успішної відповіді авторизації.
export type LoginResponse = {
  accessToken: string;
};
