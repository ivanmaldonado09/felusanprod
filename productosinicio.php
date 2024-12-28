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
        p.prenda,
        p.ofertado,
        p.precio_oferta,
        t.tipo AS tipo_nombre,
        GROUP_CONCAT(DISTINCT t2.talle ORDER BY t2.id) AS talles,
        GROUP_CONCAT(DISTINCT c.color ORDER BY c.id) AS colores,
        GROUP_CONCAT(DISTINCT pf.foto_url ORDER BY pf.id) AS fotos,
        GROUP_CONCAT(DISTINCT CONCAT(c.color, '-', t2.talle, '-', pv.stock) ORDER BY c.id, t2.id) AS stock_variantes
    FROM productos p
    LEFT JOIN tipos t ON p.tipo_id = t.id
    LEFT JOIN producto_variantes pv ON p.id = pv.producto_id
    LEFT JOIN talles t2 ON pv.talle_id = t2.id
    LEFT JOIN colores c ON pv.color_id = c.id
    LEFT JOIN producto_fotos pf ON p.id = pf.producto_id
    GROUP BY p.id
    ORDER BY p.fecha DESC
    LIMIT 8;
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
