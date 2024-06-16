import { FC } from 'react';
import {Link} from "react-router-dom";

const AdministrativeFunctionsPage: FC = () => <>
  <h2>Administrative functions</h2>

  <Link to={'/administration/tags'}>Tags</Link>
</>;

export { AdministrativeFunctionsPage };
