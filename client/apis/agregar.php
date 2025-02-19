<?php
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Función para manejar errores
function handleError($message) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => $message
    ]);
    exit;
}

// Configurar el manejador de errores
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    handleError("Error: $errstr");
});

try {
    include('../db.php');

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=utf-8");

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        handleError('Método no permitido');
    }

    // Debug: ver qué datos están llegando
    error_log("POST data: " . print_r($_POST, true));
    error_log("FILES data: " . print_r($_FILES, true));

    // Validar campos básicos del producto
    $requiredFields = ['nombre', 'precio', 'genero', 'categoria_id'];
    foreach ($requiredFields as $field) {
        if (!isset($_POST[$field]) || empty($_POST[$field])) {
            handleError("Campo requerido faltante: $field");
        }
    }

    // Validar y decodificar las variantes
    if (!isset($_POST['variants'])) {
        handleError("No se recibieron variantes del producto");
    }

    $variants = json_decode($_POST['variants'], true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        handleError("Error al decodificar las variantes: " . json_last_error_msg());
    }

    if (empty($variants)) {
        handleError("Se requiere al menos una variante del producto");
    }

    // Validar que haya al menos una foto
    $total_fotos = isset($_POST['total_fotos']) ? (int)$_POST['total_fotos'] : 0;
    if ($total_fotos < 1) {
        handleError("Se requiere al menos una foto del producto");
    }

    // Obtener los datos del POST
    $nombre = $_POST['nombre'];
    $precio = (float)$_POST['precio'];
    $genero = $_POST['genero'];
    $categoria_id = (int)$_POST['categoria_id'];
    $ofertado = (int)$_POST['ofertado'];
    $precio_oferta = $ofertado === 1 ? (float)$_POST['precio_oferta'] : $precio;

    // Iniciar la transacción
    $conn->beginTransaction();

    try {
        // Insertar producto en la tabla productos
        $queryProducto = "INSERT INTO productos (nombre, precio, genero, categoria_id, ofertado, precio_oferta) 
                         VALUES (:nombre, :precio, :genero, :categoria_id, :ofertado, :precio_oferta)";
        $stmtProducto = $conn->prepare($queryProducto);
        $stmtProducto->execute([
            ':nombre' => $nombre,
            ':precio' => $precio,
            ':genero' => $genero,
            ':categoria_id' => $categoria_id,
            ':ofertado' => $ofertado,
            ':precio_oferta' => $precio_oferta
        ]);

        // Obtener el ID del producto recién insertado
        $producto_id = $conn->lastInsertId();

        // Preparar las declaraciones para las variantes y fotos
        $queryVariante = "INSERT INTO producto_variantes (producto_id, color_id, talle_id, stock) 
                         VALUES (:producto_id, :color_id, :talle_id, :stock)";
        $stmtVariante = $conn->prepare($queryVariante);

        $queryFoto = "INSERT INTO producto_fotos (producto_id, color_id, foto_url) 
                      VALUES (:producto_id, :color_id, :foto_url)";
        $stmtFoto = $conn->prepare($queryFoto);

        // Insertar cada variante
        foreach ($variants as $variant) {
            // Validar datos de la variante
            if (empty($variant['color_id']) || empty($variant['talle_id']) || !isset($variant['stock'])) {
                throw new Exception("Datos de variante incompletos");
            }

            // Insertar variante
            $stmtVariante->execute([
                ':producto_id' => $producto_id,
                ':color_id' => (int)$variant['color_id'],
                ':talle_id' => (int)$variant['talle_id'],
                ':stock' => (int)$variant['stock']
            ]);
        }

        // Procesar y guardar cada foto
        for ($i = 0; $i < $total_fotos; $i++) {
            if (!isset($_FILES["foto_$i"]) || $_FILES["foto_$i"]['error'] !== UPLOAD_ERR_OK) {
                throw new Exception("Error al procesar la foto $i");
            }

            if (!isset($_POST["foto_color_$i"]) || empty($_POST["foto_color_$i"])) {
                throw new Exception("No se especificó el color para la foto $i");
            }

            $foto = $_FILES["foto_$i"];
            $color_id = (int)$_POST["foto_color_$i"];

            // Validar el tipo de archivo
            $imageFileType = strtolower(pathinfo($foto['name'], PATHINFO_EXTENSION));
            if (!in_array($imageFileType, ['jpg', 'jpeg', 'png', 'gif'])) {
                throw new Exception("Solo se permiten imágenes JPG, JPEG, PNG y GIF para la foto $i");
            }

            // Generar nombre único para la imagen
            $imagenNombre = uniqid() . '-' . basename($foto['name']);
            $imagenRuta = '../public/images/' . $imagenNombre;

            // Mover el archivo
            if (!move_uploaded_file($foto['tmp_name'], $imagenRuta)) {
                throw new Exception("Error al guardar la imagen $i");
            }

            // Insertar la información de la foto en la base de datos
            $stmtFoto->execute([
                ':producto_id' => $producto_id,
                ':color_id' => $color_id,
                ':foto_url' => '/images/' . $imagenNombre
            ]);
        }

        // Confirmar la transacción
        $conn->commit();

        echo json_encode([
            'success' => true,
            'message' => 'Producto, variantes y fotos agregados correctamente'
        ]);

    } catch (Exception $e) {
        // Si hay algún error, revertir la transacción y eliminar las imágenes que se hayan subido
        $conn->rollBack();
        
        // Limpiar archivos de imágenes si se subieron
        for ($i = 0; $i < $total_fotos; $i++) {
            if (isset($_FILES["foto_$i"]) && $_FILES["foto_$i"]['error'] === UPLOAD_ERR_OK) {
                $imagenNombre = uniqid() . '-' . basename($_FILES["foto_$i"]['name']);
                $imagenRuta = '../public/images/' . $imagenNombre;
                if (file_exists($imagenRuta)) {
                    unlink($imagenRuta);
                }
            }
        }
        
        throw $e;
    }

} catch (Exception $e) {
    handleError($e->getMessage());
}
?>