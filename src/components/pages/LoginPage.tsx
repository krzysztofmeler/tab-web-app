import {FC, useContext, useState} from 'react';
import {Link} from "react-router-dom";
import {TextInput} from "../forms/TextInput";
import {jsSubmit} from "../../utils/js-submit";
import {fetch} from "../../hooks/useRequest.hook";
import {AuthContext} from "../../AuthContextType";

const LoginPage: FC = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [success, setSuccess] = useState(false);

  const {update: setAuthData} = useContext(AuthContext);


  const signIn = async () => {
    setProcessing(true);

    try {
      const response = await fetch.get('../user', {
        auth: {
          password,
          username: email,
        }
      });

      if (response.status === 200) {
        setAuthData({ password, email });
        setSuccess(true);
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }

    setProcessing(false);
  };

  return (<>
    <h2>Login</h2>


    <TextInput value={email} updateValue={setEmail} label="E-mail" />
    <TextInput
      value={password}
      updateValue={setPassword}
      label="Password"
    />
    <button type="button" onClick={jsSubmit(signIn)}>
      Sign in
    </button>

    <p>or</p>
    <Link to={'/sign-up'}>Create new account</Link>
  </>);
}

export { LoginPage };
