const API_HOST_NAME = process.env.NEXT_PUBLIC_API_HOST_NAME || 'localhost';
const API_PROTOCOL = process.env.NEXT_PUBLIC_API_PROTOCOL || 'http';
const API_PORT = process.env.NEXT_PUBLIC_API_PORT;

export function getRouteRootPath(): string {
  const path = `${API_PROTOCOL}://${API_HOST_NAME}`;
  if (API_PORT) {
    return `${path}:${API_PORT}/api`;
  }
  return `${path}/api`;
}

type AuthPathKey = 'signin';
type AccountPathKey = 'signup';
type UserPathKey = 'userinfo';
type TypePathKey = 'type';
type RootPathKey = 'root';
type ItemPathKey = 'item';

type APIRoutePathKey =
  | RootPathKey
  | AccountPathKey
  | AuthPathKey
  | UserPathKey
  | TypePathKey
  | ItemPathKey;

type APIRoutePathMap = {
  [key in APIRoutePathKey]: string;
};

const APIRouteMap: APIRoutePathMap = {
  root: '/',
  signin: '/auth/signin',
  signup: '/account/',
  userinfo: '/user/',
  type: '/type/',
  item: '/item/',
};

type Query = {
  [key: string]: string;
};

export function getAPIRoute(
  key: APIRoutePathKey,
  query: Query | undefined = undefined
): string {
  if (!(key in APIRouteMap)) {
    throw new Error('the key doesnt have a corresponsive path');
  }
  const path = `${getRouteRootPath()}${APIRouteMap[key]}`;
  if (query) {
    const queryStringArr = [path, `?`];
    for (let key in query) {
      queryStringArr.push(`${key}=${query[key]}`);
    }
    queryStringArr.pop();
    return queryStringArr.join('');
  }
  return path;
}
