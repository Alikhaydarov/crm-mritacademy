// ** JWT import
import jwt from 'jsonwebtoken';

// ** Mock Adapter
import mock from 'src/@fake-db/mock';

// ** Default AuthConfig
import defaultAuthConfig from 'src/configs/auth';

// ** Types
import { UserDataType } from 'src/context/types';

const users: UserDataType[] = [
  {
    id: 1,
    role: 'admin',
    password: 'admin',
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'admin@vuexy.com',
  },
  {
    id: 2,
    role: 'client',
    password: 'client',
    fullName: 'Jane Doe',
    username: 'janedoe',
    email: 'client@vuexy.com',
  },
];

// ** JWT Configurations from .env
const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET || 'defaultSecret',
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION || '1h',
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET || 'defaultRefreshSecret',
};

type ResponseType = [number, { [key: string]: any }];

mock.onPost('/jwt/login').reply(request => {
  const { email, password } = JSON.parse(request.data);

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    const accessToken = jwt.sign({ id: user.id }, jwtConfig.secret, { expiresIn: jwtConfig.expirationTime });

    const response = {
      accessToken,
      userData: { ...user, password: undefined },
    };

    return [200, response];
  } else {
    return [400, { error: { email: ['Email or Password is Invalid'] } }];
  }
});

mock.onPost('/jwt/register').reply(request => {
  const { email, password, username } = JSON.parse(request.data || '{}');

  const isEmailAlreadyInUse = users.some(user => user.email === email);
  const isUsernameAlreadyInUse = users.some(user => user.username === username);

  if (isEmailAlreadyInUse || isUsernameAlreadyInUse) {
    return [
      400,
      {
        error: {
          email: isEmailAlreadyInUse ? 'This email is already in use.' : null,
          username: isUsernameAlreadyInUse ? 'This username is already in use.' : null,
        },
      },
    ];
  }

  const newUser = {
    id: users.length + 1,
    email,
    password,
    username,
    avatar: null,
    fullName: '',
    role: 'client',
  };

  users.push(newUser);

  const accessToken = jwt.sign({ id: newUser.id }, jwtConfig.secret, { expiresIn: jwtConfig.expirationTime });

  return [200, { accessToken }];
});

mock.onGet('/auth/me').reply(config => {
  const token = config.headers?.Authorization?.replace('Bearer ', '');

  if (!token) {
    return [401, { error: 'Token is missing' }];
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as { id: number };

    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return [401, { error: 'User not found' }];
    }

    const userData = { ...user, password: undefined };

    return [200, { userData }];
  } catch (err) {
    if (defaultAuthConfig.onTokenExpiration === 'refreshToken') {
      const decoded = jwt.decode(token) as { id: number } | null;

      if (decoded && decoded.id) {
        const newAccessToken = jwt.sign({ id: decoded.id }, jwtConfig.secret, {
          expiresIn: jwtConfig.expirationTime,
        });

        return [200, { accessToken: newAccessToken }];
      }
    }

    return [401, { error: 'Invalid or expired token' }];
  }
});
