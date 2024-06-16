const AuthorizationHeaderFromEmailAndPassword = (email: string, password: string): string => {
  return btoa(`Basic ${email}:${password}`)
}

export { AuthorizationHeaderFromEmailAndPassword };
