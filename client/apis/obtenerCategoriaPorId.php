<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

include('../db.php');

try {
    if (!isset($_GET['id'])) {
        throw new Exception("No se ha proporcionado el ID de la categoría.");
    }
    
    $id = $_GET['id'];
    
    $stmt = $conn->prepare("SELECT id, nombre, es_mostrada, padre_id FROM categorias WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    
    $categoria = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($categoria) {
        // Convertir es_mostrada a booleano
        $categoria['es_mostrada'] = (bool)$categoria['es_mostrada'];
        echo json_encode([
            'success' => true,
            'data'    => $categoria
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => "Categoría no encontrada."
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
