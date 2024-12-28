<?php
header("Content-Type: application/json; charset=utf-8");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    // Decodificar el JSON del cuerpo de la solicitud
    $input = json_decode(file_get_contents('php://input'), true);

    // Validar que las claves necesarias existen en el JSON
    if (!isset($input['nombre']) || !isset($input['precio']) || !isset($input['genero']) ||
        !isset($input['prenda']) || !isset($input['tipo_id']) || !isset($input['ofertado']) ||
        !isset($input['color_id']) || !isset($input['talle_id']) || !isset($input['stock'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Datos incompletos. Verifica los campos enviados.',
        ]);
        exit;
    }

    // Asignar variables desde el JSON
    $nombre = $input['nombre'];
    $precio = $input['precio'];
    $genero = $input['genero'];
    $prenda = $input['prenda'];
    $tipo_id = $input['tipo_id'];
    $ofertado = $input['ofertado'];
    $color_id = $input['color_id'];
    $talle_id = $input['talle_id'];
    $stock = $input['stock'];

    // Conexión a la base de datos (reemplaza con tu lógica real)
    $conn = new PDO("mysql:host=localhost;dbname=tu_base_de_datos", "usuario", "contraseña");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Iniciar transacción
    $conn->beginTransaction();

    // Insertar datos en la base de datos
    $query = "INSERT INTO productos (nombre, precio, genero, prenda, tipo_id, ofertado, color_id, talle_id, stock) 
              VALUES (:nombre, :precio, :genero, :prenda, :tipo_id, :ofertado, :color_id, :talle_id, :stock)";
    $stmt = $conn->prepare($query);
    $stmt->execute([
        ':nombre' => $nombre,
        ':precio' => $precio,
        ':genero' => $genero,
        ':prenda' => $prenda,
        ':tipo_id' => $tipo_id,
        ':ofertado' => $ofertado,
        ':color_id' => $color_id,
        ':talle_id' => $talle_id,
        ':stock' => $stock,
    ]);

    // Confirmar transacción
    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Producto agregado correctamente.',
    ]);
} catch (Exception $e) {
    // Revertir transacción si ocurre un error
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ]);
    exit;
}
