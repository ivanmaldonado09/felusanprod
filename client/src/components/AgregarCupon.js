import React, { useState } from 'react';

const AgregarCupon = () => {
    const [cupon, setCupon] = useState('');
    const [descuento, setDescuento] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que el cupon no esté vacío
        if (!cupon.trim()) {
            setError('El nombre del cupon no puede estar vacío.');
            return;
        }

        setError(null); // Limpiar errores anteriores
        setSuccess(null); // Limpiar mensajes de éxito anteriores

        try {
            const response = await fetch('http://felusan.com/apis/agregarCupon.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cupon, descuento }),
            });

            if (!response.ok) {
                throw new Error('Error en la solicitud: ' + response.status);
            }

            const result = await response.json();
            if (result.success) {
                setSuccess(result.message || 'Cupon agregado correctamente.');
                setCupon(''); // Limpiar el campo de entrada
                setDescuento(''); // Limpiar el campo de entrada
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
                    Ingresar nombre del cupon:
                    <input
                        type="text"
                        value={cupon}
                        onChange={(e) => setCupon(e.target.value)}
                    />
                </label>

                <label>
                    Ingresar descuento del cupon (solo numero, sin %):
                    <input
                        type="number"
                        value={descuento}
                        onChange={(e) => setDescuento(e.target.value)}
                    />
                </label>
                <button type="submit">Enviar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default AgregarCupon;
