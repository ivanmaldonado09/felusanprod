<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=utf-8");

include ('../db.php');

try {
    // Consulta para obtener categorías principales y sus subcategorías,
    // incluyendo el campo es_mostrada para ambas
    $stmt = $conn->prepare("
        SELECT 
            c1.id AS categoria_id, 
            c1.nombre AS categoria_nombre, 
            c1.es_mostrada,
            c2.id AS subcategoria_id, 
            c2.nombre AS subcategoria_nombre,
            c2.es_mostrada AS subcategoria_es_mostrada
        FROM categorias c1
        LEFT JOIN categorias c2 ON c2.padre_id = c1.id
        WHERE c1.padre_id IS NULL
    ");

    $stmt->execute();
    $categoriasRaw = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Estructuramos los datos: cada categoría principal incluirá su arreglo de subcategorías
    $categorias = [];

    foreach ($categoriasRaw as $row) {
        $categoriaId = $row['categoria_id'];

        if (!isset($categorias[$categoriaId])) {
            $categorias[$categoriaId] = [
                'id'            => $categoriaId,
                'nombre'        => $row['categoria_nombre'],
                'es_mostrada'   => (bool)$row['es_mostrada'], // Convertir a booleano
                'subcategorias' => []
            ];
        }

        // Si existe un id de subcategoría, la agregamos
        if ($row['subcategoria_id']) {
            $categorias[$categoriaId]['subcategorias'][] = [
                'id'          => $row['subcategoria_id'],
                'nombre'      => $row['subcategoria_nombre'],
                'es_mostrada' => (bool)$row['subcategoria_es_mostrada']
            ];
        }
    }

    echo json_encode([
        'success' => true,
        'data'    => array_values($categorias) // Convertir a array indexado
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
