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

    // Preparar la sentencia para eliminar la categoría
    $stmt = $conn->prepare("DELETE FROM categorias WHERE id = :id");
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->execute();

    // Verificar si se eliminó alguna fila
    if ($stmt->rowCount() > 0) {
        echo json_encode([
            'success' => true,
            'message' => 'La categoría se eliminó exitosamente.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No se encontró la categoría con el ID proporcionado.'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
