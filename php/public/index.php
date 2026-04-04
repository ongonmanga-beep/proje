<?php
require_once __DIR__ . '/../services/Database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit(0);

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = DB::connect();

    if ($uri === '/api/users' && $method === 'GET') {
        echo json_encode($pdo->query("SELECT * FROM users ORDER BY id DESC")->fetchAll());
        exit;
    }

    if ($uri === '/api/users' && $method === 'POST') {
        $d = json_decode(file_get_contents('php://input'), true);
        $s = $pdo->prepare("INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)");
        $s->execute([$d['email'], $d['password_hash'], $d['name'] ?? null]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'email' => $d['email'], 'name' => $d['name']]);
        exit;
    }

    if ($uri === '/api/auth' && $method === 'POST') {
        $d = json_decode(file_get_contents('php://input'), true);
        $s = $pdo->prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?");
        $s->execute([$d['email'], $d['password_hash']]);
        echo json_encode($s->fetch() ?: ['error' => 'Invalid']);
        exit;
    }

    if ($uri === '/api/portfolios' && $method === 'GET') {
        $s = $pdo->prepare("SELECT * FROM portfolios WHERE user_id = ? ORDER BY id DESC");
        $s->execute([$_GET['userId'] ?? null]);
        echo json_encode($s->fetchAll());
        exit;
    }

    if ($uri === '/api/portfolios' && $method === 'POST') {
        $d = json_decode(file_get_contents('php://input'), true);
        $s = $pdo->prepare("INSERT INTO portfolios (user_id, name) VALUES (?, ?)");
        $s->execute([$d['userId'], $d['name']]);
        echo json_encode(['id' => $pdo->lastInsertId(), 'name' => $d['name'], 'holdings' => []]);
        exit;
    }

    if ($uri === '/api/holdings' && $method === 'GET') {
        $s = $pdo->prepare("SELECT * FROM holdings WHERE portfolio_id = ? ORDER BY id");
        $s->execute([$_GET['portfolioId'] ?? null]);
        echo json_encode($s->fetchAll());
        exit;
    }

    if ($uri === '/api/holdings' && $method === 'POST') {
        $d = json_decode(file_get_contents('php://input'), true);
        $s = $pdo->prepare("INSERT INTO holdings (portfolio_id, symbol, type, quantity, avg_buy_price) VALUES (?, ?, ?, ?, ?)");
        $s->execute([$d['portfolioId'], $d['symbol'], $d['type'], $d['quantity'], $d['buyPrice']]);
        echo json_encode(['id' => (int)$pdo->lastInsertId()] + $d);
        exit;
    }

    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
