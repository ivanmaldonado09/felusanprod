<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

include ('../db.php'); // Asegúrate de que este archivo inicialice la conexión PDO en $conn

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Método no permitido");
    }
    
    // Recoger y validar el nombre de la categoría
    $nombre = isset($_POST['nombre']) ? trim($_POST['nombre']) : '';
    if (empty($nombre)) {
        throw new Exception("El nombre de la categoría es obligatorio.");
    }
    
    // Recoger el valor de 'es_principal' ("1" para principal, "0" para subcategoría)
    $es_principal = isset($_POST['es_principal']) ? $_POST['es_principal'] : '1';
    
    // Recoger el id de la categoría principal en caso de subcategoría.
    // Si es categoría principal, forzamos que padre_id sea NULL.
    $padre_id = isset($_POST['categoria_padre']) ? $_POST['categoria_padre'] : null;
    if ($es_principal === "1") {
        $padre_id = null;
    }
    
    // Recoger el valor de 'es_mostrada' (si se envía, sino por defecto "1")
    $es_mostrada = isset($_POST['es_mostrada']) ? $_POST['es_mostrada'] : '1';
    
    // Preparar la inserción en la tabla "categorias"
    $stmt = $conn->prepare("INSERT INTO categorias (nombre, padre_id, es_mostrada) VALUES (:nombre, :padre_id, :es_mostrada)");
    $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
    
    if ($padre_id === null) {
        $stmt->bindValue(':padre_id', null, PDO::PARAM_NULL);
    } else {
        $stmt->bindParam(':padre_id', $padre_id, PDO::PARAM_INT);
    }
    
    $stmt->bindValue(':es_mostrada', (int)$es_mostrada, PDO::PARAM_INT);
    
    $stmt->execute();
    
    echo json_encode([
        'success' => true,
        'message' => 'Categoría agregada correctamente.'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
