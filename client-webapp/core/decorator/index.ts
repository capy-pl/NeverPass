// The function only checks whether the token exist in session storate,
// it doesn't check whether the token is valid or not.
// If the token is not valid, the decorator will not raise any error.
export function loginRequired(
  target: any,
  property: string,
  descriptor: PropertyDescriptor
) {
  const key = sessionStorage.getItem('key');
  if (!key) {
    throw new Error('token not found in session storage');
  }
  return descriptor;
}
