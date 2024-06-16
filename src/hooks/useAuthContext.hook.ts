import { useContext } from 'react';
import { AuthContext } from '../AuthContextType';

const useAuthContext = () => useContext(AuthContext);

export { useAuthContext };
