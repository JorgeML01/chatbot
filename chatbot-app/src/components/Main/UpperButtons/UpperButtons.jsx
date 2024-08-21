import Button from 'react-bootstrap/Button';
import './styles.css';

function UpperButtons() {
    return (
        <div className="upper-buttons">
            <Button href="/" variant="" className="button-main" size="lg">+ Cargar sílabo</Button>{' '}
            <Button href="chatbot" variant="" className="button-main" size="lg">Aprende conmigo</Button>{' '}
        </div>
    );
}

export default UpperButtons;