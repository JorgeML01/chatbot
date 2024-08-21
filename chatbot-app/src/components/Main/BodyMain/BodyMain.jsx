import './styles.css';
function BodyMain() {
    return (
        <div className="body-main">
            <div className="silabo-contenedor">
                <iframe 
                    src="./test-pdfs/Silabo DAV 2021-4.pdf" 
                    type="application/pdf" 
                    className="pdf-viewer"
                    width="100%" 
                    height="100%"
                    title="Guía"
                />
            </div>
            <div className="semanas-contenedor">
                <ul className="week-list">
                    <li>Semana 1</li>
                    <li>Semana 2</li>
                    <li>Semana 3</li>
                    <li>Semana 4</li>
                    <li>Semana 5</li>
                    <li>Semana 6</li>
                    <li>Semana 7</li>
                    <li>Semana 8</li>
                    <li>Semana 9</li>
                    <li className="ultima-semana">Semana 10</li>
                </ul>
            </div>
        </div>
    );
}

export default BodyMain;