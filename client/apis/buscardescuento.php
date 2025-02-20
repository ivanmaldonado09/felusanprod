<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Se obtiene el cupón enviado en la URL, por ejemplo: ?cupon=DESCUENTAZO15
    $cupon = $_GET['cupon'] ?? null;
    
    if (!$cupon) {
        echo json_encode(['success' => false, 'message' => 'Cupón no proporcionado']);
        exit;
    }
    
    try {
        // Buscar el cupón en la tabla "cupones" comparando el campo "nombre"
        $stmt = $conn->prepare('SELECT * FROM cupones WHERE nombre = ?');
        $stmt->execute([$cupon]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$resultado) {
            echo json_encode(['success' => false, 'message' => 'Cupón no encontrado']);
            exit;
        }
        
        // Retornar el descuento encontrado (por ejemplo, 15 para un 15% de descuento)
        echo json_encode([
            'success' => true,
            'descuento' => $resultado['descuento']
        ]);
        
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error al buscar cupón: ' . $e->getMessage()
        ]);
    }
}
