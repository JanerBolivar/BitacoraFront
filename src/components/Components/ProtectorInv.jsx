import { useAuth } from '../../contexts/useAuth';
import Alert from './Alert';

const ProtectorInv = ({ children }) => {
    const { user } = useAuth();

    // Comprueba si el usuario tiene el rol "investigador"
    if (user?.role === 'investigador') {
        return children; // Renderiza el contenido anidado
    } else {
        return <Alert />; // Muestra una alerta o cualquier otro contenido
    }
};

export default ProtectorInv;