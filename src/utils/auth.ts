const AuthorizationHeaderFromEmailAndPassword = (email: string, password: string): string => {
  return 'Basic ' + btoa(`${email}:${password}`)
}

export { AuthorizationHeaderFromEmailAndPassword };
