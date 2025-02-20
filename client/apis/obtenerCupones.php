<?php
include('../db.php');

header('Content-Type: application/json');
// Estos headers deben ir antes de cualquier salida de datos
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");
// Obtener todos los tipos de productos
$query = "SELECT * FROM cupones";
try {
    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare($query);
    $stmt->execute();

    // Obtener los resultados
    $talles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retornar los resultados como JSON
    echo json_encode($talles);
} catch (PDOException $e) {
    // Manejo de errores
    echo json_encode(['error' => 'Error al obtener los productos: ' . $e->getMessage()]);
}

?>
