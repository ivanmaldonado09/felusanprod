<?php
// Esto va al principio de cada archivo API (colores.php, talles.php, tipos.php)
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
    $query = "SELECT * FROM colores";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $colores = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($colores) {
        echo json_encode($colores);
    } else {
        echo json_encode([]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Error al obtener los datos: ' . $e->getMessage()
    ]);
}
?>