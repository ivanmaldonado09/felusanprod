<?php
// Incluir el archivo de conexión a la base de datos
include '../db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');



if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Obtener el ID del producto del body
    $data = json_decode(file_get_contents('php://input'), true);
    $producto_id = $data['id'] ?? null;

    if (!$producto_id) {
        echo json_encode(['success' => false, 'message' => 'ID de producto no proporcionado']);
        exit;
    }

    try {
        // Usar la conexión existente ($conn)
        $conn->beginTransaction();

        // Eliminar registros de producto_fotos
        $stmt = $conn->prepare('DELETE FROM producto_fotos WHERE producto_id = ?');
        $stmt->execute([$producto_id]);

        // Eliminar registros de producto_variantes
        $stmt = $conn->prepare('DELETE FROM producto_variantes WHERE producto_id = ?');
        $stmt->execute([$producto_id]);

        // Eliminar el producto
        $stmt = $conn->prepare('DELETE FROM productos WHERE id = ?');
        $stmt->execute([$producto_id]);

        // Confirmar la transacción
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Producto y sus registros relacionados eliminados correctamente'
        ]);

    } catch (PDOException $e) {
        // Si hay error, revertir la transacción
        if ($conn->inTransaction()) {
            $conn->rollBack();
        }
        echo json_encode([
            'success' => false,
            'message' => 'Error al eliminar: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>