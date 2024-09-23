import './styles.css';
import React, { useState, useRef } from 'react';

function BodyMain() {
    const [selectedWeek, setSelectedWeek] = useState(null);
    const [weekNotes, setWeekNotes] = useState({}); // Estado para almacenar las notas de cada semana
    const textAreaRef = useRef(null);

    const handleWeekClick = (weekNumber) => {
        setSelectedWeek(weekNumber === selectedWeek ? null : weekNumber);
        // Enfocar el textarea después de actualizar el estado
        setTimeout(() => {
            if (textAreaRef.current && weekNumber === selectedWeek) {
                textAreaRef.current.focus();
            }
        }, 0);
    };

    const handleTextAreaClick = (event) => {
        event.stopPropagation(); // Evitar que el clic cierre el textarea
    };

    const handleTextAreaChange = (weekNumber, event) => {
        const newNote = event.target.value;
        setWeekNotes((prevNotes) => ({
            ...prevNotes,
            [weekNumber]: newNote, // Guardar el texto en el estado asociado a la semana
        }));
    };

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
                    {Array.from({ length: 10 }, (_, i) => (
                        <li key={i} onClick={() => handleWeekClick(i + 1)}>
                            Semana {i + 1}
                            {selectedWeek === i + 1 && (
                                <textarea
                                    ref={textAreaRef}
                                    placeholder={`Escribe algo para la Semana ${i + 1}...`}
                                    value={weekNotes[i + 1] || ''} // Mostrar el texto guardado si existe
                                    style={{ width: '100%', marginTop: '10px' }}
                                    onClick={handleTextAreaClick}
                                    onChange={(event) => handleTextAreaChange(i + 1, event)} // Actualizar el estado cuando cambia el textarea
                                ></textarea>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default BodyMain;
