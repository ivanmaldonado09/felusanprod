<?php
// Incluir el archivo autoload de Composer para cargar las dependencias
require_once __DIR__ . '/vendor/autoload.php'; // Asegúrate de que la ruta sea correcta

// Cargar el archivo .env (la ruta debería ser la misma carpeta donde está tu db.php)
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__); // Aquí corregimos la ruta
$dotenv->load();

// Obtener las variables de entorno
$host = $_ENV['DB_HOST'];
$user = $_ENV['DB_USER'];
$password = $_ENV['DB_PASSWORD'];
$dbname = $_ENV['DB_NAME'];
// Crear conexión
try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
}

