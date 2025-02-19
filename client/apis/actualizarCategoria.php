<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

include('../db.php');

try {
    if (!isset($_POST['id']) || !isset($_POST['nombre']) || !isset($_POST['es_mostrada']) || !isset($_POST['padre_id'])) {
        throw new Exception("Faltan parámetros para actualizar la categoría.");
    }
    
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $es_mostrada = $_POST['es_mostrada']; // Se espera 0 o 1
    $padre_id = $_POST['padre_id'];
    
    // Si padre_id es cadena vacía, asignamos NULL
    if ($padre_id === "") {
        $padre_id = null;
    }
    
    $stmt = $conn->prepare("UPDATE categorias SET nombre = :nombre, es_mostrada = :es_mostrada, padre_id = :padre_id WHERE id = :id");
    $stmt->bindParam(':nombre', $nombre, PDO::PARAM_STR);
    $stmt->bindParam(':es_mostrada', $es_mostrada, PDO::PARAM_INT);
    if ($padre_id === null) {
        $stmt->bindValue(':padre_id', null, PDO::PARAM_NULL);
    } else {
        $stmt->bindParam(':padre_id', $padre_id, PDO::PARAM_INT);
    }
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => "Categoría actualizada exitosamente."
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => "No se encontró la categoría o no hubo cambios."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
