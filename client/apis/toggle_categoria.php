<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

include('../db.php');

try {
    // Verificar que se haya enviado el ID de la categoría
    if (!isset($_POST['id'])) {
        throw new Exception("No se ha proporcionado el ID de la categoría.");
    }
    
    $id = $_POST['id'];

    // Obtener el valor actual de es_mostrada para la categoría
    $stmt = $conn->prepare("SELECT es_mostrada FROM categorias WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    $categoria = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$categoria) {
        throw new Exception("No se encontró la categoría con el ID proporcionado.");
    }
    
    // Cambiar el valor: si es true (1) se pone false (0), y viceversa
    $currentValue = $categoria['es_mostrada'];
    $newValue = ($currentValue) ? 0 : 1;

    // Actualizar el campo es_mostrada de la categoría
    $updateStmt = $conn->prepare("UPDATE categorias SET es_mostrada = :newValue WHERE id = :id");
    $updateStmt->bindParam(':newValue', $newValue, PDO::PARAM_INT);
    $updateStmt->bindParam(':id', $id, PDO::PARAM_INT);
    $updateStmt->execute();

    echo json_encode([
        'success' => true,
        'message' => 'El campo es_mostrada se actualizó exitosamente.',
        'es_mostrada' => (bool)$newValue
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
