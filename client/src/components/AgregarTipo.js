import React, { useState } from 'react';

const AgregarTipo = () => {
    const [tipo, setTipo] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que el talle no esté vacío
        if (!tipo.trim()) {
            setError('El nombre del tipo de prenda no puede estar vacío.');
            return;
        }

        setError(null); // Limpiar errores anteriores
        setSuccess(null); // Limpiar mensajes de éxito anteriores

        try {
            const response = await fetch('http://felusan.com/apis/agregarTipo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tipo }),
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }

            const result = await response.json();
            if (result.success) {
                setSuccess(result.message || 'Tipo agregado correctamente.');
                setTipo(''); // Limpiar el campo de entrada
            } else {
                throw new Error(result.message || 'Ocurrió un error desconocido.');
            }
        } catch (err) {
            setError('Error al enviar los datos: ' + err.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Ingresar nombre del tipo de prenda en este formato: tipo - Prenda, por ejemplo: Musculosa - Remera
                    <input
                        type="text"
                        value={tipo}
                        onChange={(e) => setTipo(e.target.value)}
                    />
                </label>
                <button type="submit">Enviar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default AgregarTipo;
