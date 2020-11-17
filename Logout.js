import fb from '../fb'
import { useHistory } from 'react-router-dom';

function Logout() {

    const history = useHistory()

    const logout = async () => {
        await fb.auth().signOut()
        history.push("/")
    }
    logout()

    return null
}

export default Logout;
