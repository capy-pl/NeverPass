type AccountPathKey = 'signin' | 'signup' | 'message';
type RootPathKey = 'root';

type RoutePathKey = RootPathKey | AccountPathKey;

type RoutePathMap = {
  [key in RoutePathKey]: string;
};

const ClientRouteMap: RoutePathMap = {
  root: '/',
  signin: '/account/signin',
  signup: '/account/signup',
  message: '/account/message',
};

export default ClientRouteMap;
