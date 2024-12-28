<?php
// Estos headers deben ir antes de cualquier salida de datos
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");
include('../db.php');

// Para las solicitudes OPTIONS (pre-flight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Leer el cuerpo de la solicitud
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Validar el dato recibido
        $tipo = $data['tipo'] ?? null;
        if (!$tipo || trim($tipo) === '') {
            throw new Exception('El nombre del color no puede estar vacío');
        }

        // Insertar el color en la base de datos
        $query = "INSERT INTO tipos (tipo) VALUES (:tipo)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':tipo', $tipo, PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Tipo agregado correctamente'
            ]);
        } else {
            throw new Exception('Error al agregar el tipo a la base de datos');
        }
    } else {
        // Método no permitido
        http_response_code(405);
        echo json_encode([
            'error' => true,
            'message' => 'Método no permitido'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Error al procesar la solicitud: ' . $e->getMessage()
    ]);
}
?>
