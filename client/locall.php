<?php
// Incluir el archivo de conexión a la base de datos
include 'db.php';

// Configurar la cabecera para JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Consulta para obtener la contraseña
$query = "SELECT contrasena FROM useradmin LIMIT 1"; // LIMIT 1 para asegurar que solo devuelves una fila

// Usar una consulta preparada para mayor seguridad
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode(['error' => 'Error al preparar la consulta: ' . $conn->errorInfo()]);
    exit;
}

// Ejecutar la consulta
$stmt->execute();

// Obtener el resultado
$row = $stmt->fetch(PDO::FETCH_ASSOC); // Usar fetch() con PDO

$contrasena = $row ? $row['contrasena'] : null;

// Devolver la contraseña como respuesta JSON
echo json_encode(['contrasena' => $contrasena]);

// Cerrar la conexión
$stmt = null;
$conn = null;
?>
