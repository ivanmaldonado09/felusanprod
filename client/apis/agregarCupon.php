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
        
        // Validar el dato recibido cupon y descuento
        $nombre = $data['cupon'] ?? null;
        if (!$nombre || trim($nombre) === '') {
            throw new Exception('El nombre del cupon no puede estar vacío');
        }
        $descuento = $data['descuento'] ?? null;
        if (!$descuento || trim($descuento) === '') {
            throw new Exception('El descuento del cupon no puede estar vacío');
        }


        $query = "INSERT INTO cupones (nombre, descuento) VALUES (:nombre, :descuento)";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
        $stmt->bindParam(':descuento', $descuento, PDO::PARAM_STR);

       

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Cupon agregado correctamente'
            ]);
        } else {
            throw new Exception('Error al agregar el cupon a la base de datos');
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
