<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

include ('../db.php');

try {
    // Consulta para obtener categorías y sus subcategorías en una sola consulta
    $stmt = $conn->prepare("
        SELECT c1.id AS categoria_id, c1.nombre AS categoria_nombre,
               c2.id AS subcategoria_id, c2.nombre AS subcategoria_nombre
        FROM categorias c1
        LEFT JOIN categorias c2 ON c2.padre_id = c1.id
        WHERE c1.padre_id IS NULL
    ");

    $stmt->execute();
    $categoriasRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Procesar los datos en PHP para estructurarlos correctamente
    $categorias = [];

    foreach ($categoriasRaw as $row) {
        $categoriaId = $row['categoria_id'];

        if (!isset($categorias[$categoriaId])) {
            $categorias[$categoriaId] = [
                'id' => $categoriaId,
                'nombre' => $row['categoria_nombre'],
                'subcategorias' => []
            ];
        }

        if ($row['subcategoria_id']) {
            $categorias[$categoriaId]['subcategorias'][] = [
                'id' => $row['subcategoria_id'],
                'nombre' => $row['subcategoria_nombre']
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'data' => array_values($categorias) // Convertimos a array indexado
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
