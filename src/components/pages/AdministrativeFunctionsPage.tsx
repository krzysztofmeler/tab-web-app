import {FC, useContext, useEffect} from 'react';
import {Link} from "react-router-dom";
import {useNavigate} from "react-router";
import {AuthContext} from "../../AuthContextType";

const AdministrativeFunctionsPage: FC = () => {

  const navigate = useNavigate()

  const { data: authData } = useContext(AuthContext);

  useEffect(() => {
    if (authData === null) {
      navigate('/sign-in');
    }
  })

  if (authData === null) {
    return <>You must login first</>
  }

  return <>
    <h2>Administrative functions</h2>

    <Link to={'/administration/tags'}>Tags</Link>
  </>;
}

export { AdministrativeFunctionsPage };
