<?php
// Asegurarse de que los errores de PHP no se muestren en la salida
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Establecer el manejador de errores personalizado
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    throw new ErrorException($errstr, $errno, 0, $errfile, $errline);
});

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

try {
    require_once '../db.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    $id = $_POST['id'] ?? null;
    if (!$id) {
        throw new Exception('ID del producto no proporcionado');
    }

    $nombre = $_POST['nombre'] ?? '';
    $precio = $_POST['precio'] ?? '';
    $genero = $_POST['genero'] ?? '';
    $prenda = $_POST['prenda'] ?? '';
    $tipo_id = $_POST['tipo_id'] ?? '';
    $ofertado = $_POST['ofertado'] ?? '0';
    $precio_oferta = $_POST['precio_oferta'] ?? null;
    
    // Validar que variants sea JSON válido
    $variants = json_decode($_POST['variants'] ?? '[]', true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error en el formato de las variantes');
    }

    $total_fotos = isset($_POST['total_fotos']) ? (int)$_POST['total_fotos'] : 0;

    $conn->beginTransaction();

    // Actualizar el producto principal
    $stmt = $conn->prepare("UPDATE productos SET 
        nombre = ?, 
        precio = ?, 
        genero = ?, 
        prenda = ?, 
        tipo_id = ?, 
        ofertado = ?, 
        precio_oferta = ?
        WHERE id = ?");
        
    if (!$stmt->execute([
        $nombre, 
        $precio, 
        $genero, 
        $prenda, 
        $tipo_id, 
        $ofertado, 
        $precio_oferta,
        $id
    ])) {
        throw new Exception('Error al actualizar los datos básicos del producto');
    }

    // Actualizar variantes
    $stmt = $conn->prepare("DELETE FROM producto_variantes WHERE producto_id = ?");
    $stmt->execute([$id]);

    $stmt = $conn->prepare("INSERT INTO producto_variantes (producto_id, color_id, talle_id, stock) VALUES (?, ?, ?, ?)");
    foreach ($variants as $variant) {
        if (!$stmt->execute([
            $id,
            $variant['color_id'],
            $variant['talle_id'],
            $variant['stock']
        ])) {
            throw new Exception('Error al insertar las variantes');
        }
    }

    // Procesar fotos
    $uploadDirectory = '../public/images/';
    if (!is_dir($uploadDirectory)) {
        mkdir($uploadDirectory, 0777, true);
    }

     // Procesar fotos eliminadas
     if (isset($_POST['deleted_photos'])) {
        $deletedPhotos = json_decode($_POST['deleted_photos'], true);
        if (is_array($deletedPhotos)) {
            foreach ($deletedPhotos as $photoUrl) {
                // Obtener el nombre del archivo desde la URL
                $fileName = basename($photoUrl);
                $filePath = $uploadDirectory . $fileName;
    
                // Eliminar de la base de datos
                $stmt = $conn->prepare("DELETE FROM producto_fotos WHERE foto_url = ?");
                if (!$stmt->execute([$photoUrl])) {
                    throw new Exception("Error al eliminar la foto $photoUrl de la base de datos");
                }
    
                // Eliminar del servidor
                if (file_exists($filePath)) {
                    if (!unlink($filePath)) {
                        throw new Exception("Error al eliminar la foto $fileName del servidor");
                    }
                }
            }
        }
    }

    for ($i = 0; $i < $total_fotos; $i++) {
        $color_id = $_POST["foto_color_$i"] ?? null;
        
        if (!$color_id) {
            continue;
        }

        if (isset($_FILES["foto_$i"]) && $_FILES["foto_$i"]['error'] === UPLOAD_ERR_OK) {
            $foto = $_FILES["foto_$i"];
            
            // Validar el tipo de archivo
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = finfo_file($finfo, $foto['tmp_name']);
            finfo_close($finfo);

            if (!in_array($mimeType, ['image/jpeg', 'image/png', 'image/gif'])) {
                throw new Exception("El archivo $i no es una imagen válida");
            }

            $imageFileType = strtolower(pathinfo($foto['name'], PATHINFO_EXTENSION));
            $imagenNombre = uniqid() . '-' . bin2hex(random_bytes(8)) . '.' . $imageFileType;
            $imagenRuta = $uploadDirectory . $imagenNombre;
            $dbImagePath = '/images/' . $imagenNombre;

            if (!move_uploaded_file($foto['tmp_name'], $imagenRuta)) {
                throw new Exception("Error al guardar la imagen $i");
            }

            // Verificar si ya existe una foto para este color
            $stmt = $conn->prepare("SELECT foto_url FROM producto_fotos WHERE producto_id = ? AND color_id = ?");
            $stmt->execute([$id, $color_id]);
            $oldPhoto = $stmt->fetch(PDO::FETCH_COLUMN);

            if ($oldPhoto) {
                // Eliminar la foto antigua
                $oldPath = "../" . $oldPhoto;
                if (file_exists($oldPath)) {
                    unlink($oldPath);
                }

                $stmt = $conn->prepare("UPDATE producto_fotos SET foto_url = ? WHERE producto_id = ? AND color_id = ?");
                if (!$stmt->execute([$dbImagePath, $id, $color_id])) {
                    throw new Exception("Error al actualizar la foto $i en la base de datos");
                }
            } else {
                $stmt = $conn->prepare("INSERT INTO producto_fotos (producto_id, color_id, foto_url) VALUES (?, ?, ?)");
                if (!$stmt->execute([$id, $color_id, $dbImagePath])) {
                    throw new Exception("Error al insertar la foto $i en la base de datos");
                }
            }
        }
    }

    $conn->commit();
    echo json_encode([
        'success' => true,
        'message' => 'Producto actualizado correctamente'
    ]);

} catch (Throwable $e) {
    if (isset($conn)) {
        $conn->rollBack();
    }
    
    // Log del error para debugging
    error_log("Error en actualizar.php: " . $e->getMessage());
    
    echo json_encode([
        'success' => false,
        'message' => 'Error al actualizar el producto: ' . $e->getMessage(),
        'debug' => [
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]
    ]);
}