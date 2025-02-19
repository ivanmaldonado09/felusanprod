<?php
// Incluir el archivo de conexión a la base de datos
include 'db.php';

// Configurar la cabecera para JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');


// Consulta para obtener los productos con sus talles y colores
$query = "
SELECT
    p.id,
    p.nombre,
    p.descripcion,
    p.precio,
    p.genero,
    p.fecha,
    p.ofertado,
    p.precio_oferta,
    -- Si la categoría asignada (c) es principal (padre_id IS NULL), se usa c; de lo contrario, se usa su padre (cp)
    CASE 
        WHEN cp.id IS NULL THEN c.id 
        ELSE cp.id 
    END AS categoria_id,
    CASE 
        WHEN cp.id IS NULL THEN c.nombre 
        ELSE cp.nombre 
    END AS categoria_nombre,
    -- Si existe cp, significa que la categoría asignada es una subcategoría
    CASE 
        WHEN cp.id IS NULL THEN NULL 
        ELSE c.id 
    END AS subcategoria_id,
    CASE 
        WHEN cp.id IS NULL THEN NULL 
        ELSE c.nombre 
    END AS subcategoria_nombre,
    GROUP_CONCAT(DISTINCT t2.talle ORDER BY t2.id) AS talles,
    GROUP_CONCAT(DISTINCT col.color ORDER BY col.id) AS colores,
    GROUP_CONCAT(DISTINCT pf.foto_url ORDER BY pf.id) AS fotos,
    GROUP_CONCAT(DISTINCT CONCAT(col.color, '-', t2.talle, '-', pv.stock) ORDER BY col.id, t2.id) AS stock_variantes
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN categorias cp ON c.padre_id = cp.id
LEFT JOIN producto_variantes pv ON p.id = pv.producto_id
LEFT JOIN talles t2 ON pv.talle_id = t2.id
LEFT JOIN colores col ON pv.color_id = col.id
LEFT JOIN producto_fotos pf ON p.id = pf.producto_id
GROUP BY p.id
";



try {
    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare($query);
    $stmt->execute();

    // Obtener los resultados
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retornar los resultados como JSON
    echo json_encode($productos);
} catch (PDOException $e) {
    // Manejo de errores
    echo json_encode(['error' => 'Error al obtener los productos: ' . $e->getMessage()]);
}




?>
