<?php
/**
 * CELEBRATION — Mercado Pago Webhook Listener (Orders API + Payments)
 * Valida firma HMAC x-signature cuando MP_WEBHOOK_SECRET esta configurada,
 * verifica el estado real contra Mercado Pago API y garantiza idempotencia.
 */

declare(strict_types=1);

$configPath = __DIR__ . '/mp-config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    exit;
}
require_once $configPath;

function getHeaderLower(string $target): string
{
    foreach ($_SERVER as $key => $value) {
        if (str_starts_with($key, 'HTTP_')) {
            $normalized = strtolower(str_replace('_', '-', substr($key, 5)));
            if ($normalized === $target) {
                return (string) $value;
            }
        }
    }
    return '';
}

function verifyWebhookSignature(string $xSignature, string $xRequestId, string $dataId, string $secret): bool
{
    if ($secret === '') {
        return true; // Permitido mientras no se haya fijado MP_WEBHOOK_SECRET; se valida contra API
    }
    if ($xSignature === '' || $dataId === '') {
        return false;
    }

    $ts = '';
    $v1 = '';
    foreach (explode(',', $xSignature) as $part) {
        $kv = explode('=', trim($part), 2);
        if (count($kv) === 2) {
            if ($kv[0] === 'ts') {
                $ts = trim($kv[1]);
            } elseif ($kv[0] === 'v1') {
                $v1 = trim($kv[1]);
            }
        }
    }

    if ($ts === '' || $v1 === '') {
        return false;
    }

    // Requisito oficial MP: caracteres alfanumericos de data.id en minuscula
    $manifest = 'id:' . strtolower($dataId) . ';';
    if ($xRequestId !== '') {
        $manifest .= 'request-id:' . $xRequestId . ';';
    }
    $manifest .= 'ts:' . $ts . ';';

    $computed = hash_hmac('sha256', $manifest, $secret);
    return hash_equals($computed, $v1);
}

$rawBody = file_get_contents('php://input');
$payload = is_string($rawBody) ? json_decode($rawBody, true) : null;
if (!is_array($payload)) {
    $payload = [];
}

$dataId = (string) ($_GET['data_id'] ?? ($_GET['data.id'] ?? ($payload['data']['id'] ?? ($_GET['id'] ?? ''))));
$type = (string) ($_GET['type'] ?? ($payload['type'] ?? ($payload['topic'] ?? '')));
$action = (string) ($payload['action'] ?? '');

$xSignature = getHeaderLower('x-signature');
$xRequestId = getHeaderLower('x-request-id');

if (defined('MP_WEBHOOK_SECRET') && MP_WEBHOOK_SECRET !== '') {
    if (!verifyWebhookSignature($xSignature, $xRequestId, $dataId, MP_WEBHOOK_SECRET)) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['ok' => false, 'error' => 'Invalid signature']);
        exit;
    }
}

$verifiedStatus = '';
if ($dataId !== '' && preg_match('/^[A-Za-z0-9_-]{6,64}$/', $dataId)) {
    $endpoint = ($type === 'orders' || $type === 'order' || str_starts_with($dataId, 'ORD'))
        ? 'https://api.mercadopago.com/v1/orders/' . rawurlencode($dataId)
        : 'https://api.mercadopago.com/v1/payments/' . rawurlencode($dataId);

    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . MP_ACCESS_TOKEN, 'Accept: application/json'],
        CURLOPT_TIMEOUT => 10,
    ]);
    $resp = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($code >= 200 && $code < 300 && is_string($resp)) {
        $info = json_decode($resp, true);
        if (is_array($info)) {
            $verifiedStatus = (string) ($info['status'] ?? '');
        }
    }
}

// Registro idempotente simple para conciliacion
$eventKey = ($xRequestId !== '' ? $xRequestId : ($type . ':' . $dataId . ':' . $verifiedStatus));
$logPath = __DIR__ . '/webhooks.log';
$existing = is_file($logPath) ? (string) @file_get_contents($logPath) : '';
if ($eventKey !== '' && !str_contains($existing, $eventKey)) {
    $record = [
        'received_at' => gmdate('c'),
        'key' => $eventKey,
        'type' => $type,
        'action' => $action,
        'data_id' => $dataId,
        'verified_status' => $verifiedStatus,
    ];
    @file_put_contents($logPath, json_encode($record, JSON_UNESCAPED_UNICODE) . PHP_EOL, FILE_APPEND | LOCK_EX);
}

http_response_code(200);
header('Content-Type: application/json');
echo json_encode(['ok' => true]);
