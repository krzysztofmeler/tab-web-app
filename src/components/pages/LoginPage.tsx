import { FC } from 'react';
import {Link} from "react-router-dom";

const LoginPage: FC = () => <>
  <h2>Login</h2>
  <p>or</p>
  <Link to={'/sign-up'}>Create new account</Link>
</>;

export { LoginPage };
