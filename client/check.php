<?php
require_once __DIR__ . '/vendor/autoload.php'; // Asegúrate de que la ruta sea correcta

// Cargar el archivo .env
$dotenvFilePath = __DIR__ . '/.env';


require_once __DIR__ . '/vendor/autoload.php'; // Asegúrate de que la ruta sea correcta

// Cargar el archivo .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();


// Verificar las variables de entorno
$host = getenv('DB_HOST');
$user = $_ENV['DB_USER'];
$password = $_ENV['DB_PASSWORD'];
$dbname = $_ENV['DB_NAME'];

// Retornar un mensaje con las variables cargadas
echo json_encode([
    'DB_HOST' => $_ENV['DB_HOST'],
    'DB_USER' => $user,
    'DB_PASSWORD' => $password,
    'DB_NAME' => $dbname
]);
