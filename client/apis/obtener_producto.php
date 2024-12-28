<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        echo json_encode(['success' => false, 'message' => 'ID no proporcionado']);
        exit;
    }

    try {
        // Obtener datos del producto
        $stmt = $conn->prepare('SELECT * FROM productos WHERE id = ?');
        $stmt->execute([$id]);
        $producto = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$producto) {
            echo json_encode(['success' => false, 'message' => 'Producto no encontrado']);
            exit;
        }

        // Obtener variantes del producto
        $stmt = $conn->prepare('SELECT * FROM producto_variantes WHERE producto_id = ?');
        $stmt->execute([$id]);
        $variantes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Obtener fotos del producto
        $stmt = $conn->prepare('SELECT foto_url, color_id FROM producto_fotos WHERE producto_id = ?');
        $stmt->execute([$id]);
        $fotos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'producto' => $producto,
            'variantes' => $variantes,
            'fotos' => $fotos
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error al obtener el producto: ' . $e->getMessage()
        ]);
    }
}