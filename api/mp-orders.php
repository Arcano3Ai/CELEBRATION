<?php
/**
 * CELEBRATION — Mercado Pago Orders API v1 Endpoint
 * App: CELEBRATION (ID: 4609837465940167 | User ID: 2902738350)
 *
 * Acciones:
 *   GET  ?action=config
 *   GET  ?action=redirect&pkg=signature&scheme=deposit
 *   GET  ?action=order_status&id=ORD...
 *   POST action=create_checkout_order
 *   POST action=create_spei_order
 *   POST action=pay_card
 */

declare(strict_types=1);

$configPath = __DIR__ . '/mp-config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'Configuracion de servidor faltante (mp-config.php)']);
    exit;
}
require_once $configPath;

function sendJson(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function generateUuidV4(): string
{
    $bytes = random_bytes(16);
    $bytes[6] = chr((ord($bytes[6]) & 0x0f) | 0x40);
    $bytes[8] = chr((ord($bytes[8]) & 0x3f) | 0x80);
    $hex = bin2hex($bytes);
    return sprintf(
        '%s-%s-%s-%s-%s',
        substr($hex, 0, 8),
        substr($hex, 8, 4),
        substr($hex, 12, 4),
        substr($hex, 16, 4),
        substr($hex, 20, 12)
    );
}

function resolvePackage(string $pkgKey, string $scheme): array
{
    $catalog = [
        'signature' => [
            'name' => 'Signature',
            'full' => 500.00,
            'deposit' => 500.00,
            'allow_deposit' => false,
        ],
        'essential' => [
            'name' => 'Essential',
            'full' => 990.00,
            'deposit' => 495.00,
            'allow_deposit' => true,
        ],
        'premiere' => [
            'name' => 'Premiere Edition',
            'full' => 1790.00,
            'deposit' => 895.00,
            'allow_deposit' => true,
        ],
        'couture' => [
            'name' => 'Haute Couture',
            'full' => 2990.00,
            'deposit' => 1495.00,
            'allow_deposit' => true,
        ],
        'haute-couture' => [
            'name' => 'Haute Couture',
            'full' => 2990.00,
            'deposit' => 1495.00,
            'allow_deposit' => true,
        ],
        'mini' => [
            'name' => 'Signature',
            'full' => 500.00,
            'deposit' => 500.00,
            'allow_deposit' => false,
        ],
    ];

    $safeKey = array_key_exists($pkgKey, $catalog) ? $pkgKey : 'signature';
    $item = $catalog[$safeKey];
    $useDeposit = ($scheme === 'deposit' && $item['allow_deposit']);
    $amount = $useDeposit ? $item['deposit'] : $item['full'];

    return [
        'key' => $safeKey,
        'name' => $item['name'],
        'scheme' => $useDeposit ? 'deposit' : 'full',
        'scheme_label' => $useDeposit ? 'Anticipo 50%' : 'Pago Total 100%',
        'amount_float' => $amount,
        'amount_str' => number_format($amount, 2, '.', ''),
    ];
}

function buildExternalReference(string $pkgKey, string $scheme): string
{
    $pkgCode = strtoupper(substr($pkgKey, 0, 4));
    $schCode = ($scheme === 'deposit') ? 'DEP' : 'TOT';
    $rand = strtoupper(bin2hex(random_bytes(2)));
    return sprintf('CEL-%s-%s-%s-%s', $pkgCode, $schCode, gmdate('ymdHis'), $rand);
}

function callMpApi(string $method, string $path, string $accessToken, ?array $body = null, ?string $idempotencyKey = null, ?string $deviceId = null, ?string $productId = null): array
{
    $url = 'https://api.mercadopago.com' . $path;
    $ch = curl_init($url);

    if ($deviceId === null || $deviceId === '') {
        $deviceId = trim((string) ($_SERVER['HTTP_X_MELI_SESSION_ID'] ?? ''));
        if ($deviceId === '') {
            $deviceId = bin2hex(random_bytes(16));
        }
    }

    $prodId = ($productId !== null && $productId !== '') ? $productId : 'C85Q6TGS4G718CFJS27G';

    $headers = [
        'Authorization: Bearer ' . $accessToken,
        'Content-Type: application/json; charset=UTF-8',
        'Accept: application/json',
        'User-Agent: MercadoPago DX-PHP SDK/3.16.0',
        'X-Product-Id: ' . $prodId,
        'X-Tracking-Id: platform:8|8.3.0,type:SDK3.16.0,so;',
        'X-meli-session-id: ' . $deviceId,
    ];
    if ($idempotencyKey !== null && $idempotencyKey !== '') {
        $headers[] = 'X-Idempotency-Key: ' . $idempotencyKey;
    }

    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CONNECTTIMEOUT => 8,
    ]);

    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    $raw = curl_exec($ch);
    $curlErr = curl_error($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($raw === false) {
        return ['http' => 502, 'data' => ['message' => 'Error de comunicacion cURL: ' . $curlErr]];
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        $decoded = ['raw' => $raw];
    }

    return ['http' => $httpCode, 'data' => $decoded];
}

function callCloudRunOrderService(bool $isSandbox, array $payload): array
{
    $endpoint = $isSandbox
        ? 'https://mp-orders-service-436wihiq4q-uc.a.run.app/create-order-test'
        : 'https://mp-orders-service-436wihiq4q-uc.a.run.app/create-order';

    $ch = curl_init($endpoint);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        CURLOPT_TIMEOUT => 12,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);

    $raw = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($raw === false || $httpCode < 200 || $httpCode >= 300) {
        return ['http' => $httpCode ?: 502, 'data' => []];
    }
    $decoded = json_decode($raw, true);
    return ['http' => $httpCode, 'data' => is_array($decoded) ? $decoded : []];
}

function appendOrderLog(array $entry): void
{
    $logFile = __DIR__ . '/orders-log.json';
    $entry['logged_at'] = gmdate('c');
    @file_put_contents(
        $logFile,
        json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL,
        FILE_APPEND | LOCK_EX
    );
}

function normalizeEmail(string $email, string $fallbackLocal = 'reserva'): string
{
    $trimmed = trim($email);
    if ($trimmed !== '' && filter_var($trimmed, FILTER_VALIDATE_EMAIL)) {
        return $trimmed;
    }
    return $fallbackLocal . '@thecelebration.com.mx';
}

function splitCoupleName(string $raw): array
{
    $clean = trim(preg_replace('/\s+/', ' ', $raw));
    if ($clean === '') {
        return ['Invitado', 'CELEBRATION'];
    }
    $parts = explode(' ', $clean, 2);
    return [substr($parts[0], 0, 60), substr($parts[1] ?? 'CELEBRATION', 0, 60)];
}

function resolveCardPaymentType(string $methodId, string $explicitType): string
{
    $allowed = ['credit_card', 'debit_card', 'prepaid_card'];
    if (in_array($explicitType, $allowed, true)) {
        return $explicitType;
    }
    if (str_starts_with($methodId, 'deb')) {
        return 'debit_card';
    }
    return 'credit_card';
}

function buildOrderItems(array $pkg): array
{
    return [
        [
            'external_code' => 'CEL-' . strtoupper($pkg['key']) . '-' . strtoupper($pkg['scheme']),
            'title' => $pkg['name'] . ' — ' . $pkg['scheme_label'] . ' (CELEBRATION)',
            'description' => 'Invitación Digital de Lujo CELEBRATION — ' . $pkg['name'],
            'category_id' => 'services',
            'quantity' => 1,
            'unit_price' => $pkg['amount_str'],
        ],
    ];
}

function buildPayerPhone(string $rawPhone): ?array
{
    $digits = preg_replace('/\D+/', '', $rawPhone);
    if ($digits === '' || strlen($digits) < 8) {
        return null;
    }
    $local10 = strlen($digits) > 10 ? substr($digits, -10) : $digits;
    return [
        'area_code' => substr($local10, 0, 2),
        'number' => substr($local10, 2),
    ];
}

function parseMpRejection(array $mpData): array
{
    $detailCode = '';
    if (!empty($mpData['errors'][0]['details'][0]) && is_string($mpData['errors'][0]['details'][0])) {
        $parts = explode(':', $mpData['errors'][0]['details'][0], 2);
        $detailCode = trim($parts[1] ?? $parts[0]);
    } elseif (!empty($mpData['status_detail'])) {
        $detailCode = (string) $mpData['status_detail'];
    }

    $messages = [
        'insufficient_amount' => 'Fondos o límite insuficiente en la tarjeta.',
        'card_insufficient_amount' => 'La tarjeta no tiene saldo o límite suficiente.',
        'required_call_for_authorize' => 'El banco requiere autorización del titular para aprobar este cargo.',
        'bad_filled_card_data' => 'Revisa el número de tarjeta, fecha de vencimiento o código de seguridad.',
        'card_disabled' => 'La tarjeta está deshabilitada o bloqueada.',
        'rejected_by_issuer' => 'Cargo rechazado por el banco emisor. Intenta con otra tarjeta o vía SPEI.',
        'high_risk' => 'Operación detenida por prevención de fraude. Prueba con otra tarjeta o SPEI.',
        'invalid_installments' => 'El plazo de mensualidades elegido no aplica para esta tarjeta.',
        'max_attempts_exceeded' => 'Se excedió el límite de intentos con esta tarjeta.',
    ];

    $friendly = $messages[$detailCode] ?? ($mpData['message'] ?? 'No se pudo procesar el pago con tarjeta.');
    return ['detail' => $detailCode, 'message' => $friendly];
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$rawBody = file_get_contents('php://input');
$input = [];
if (is_string($rawBody) && trim($rawBody) !== '') {
    $parsed = json_decode($rawBody, true);
    if (is_array($parsed)) {
        $input = $parsed;
    }
}

$action = (string) ($_GET['action'] ?? ($input['action'] ?? ''));
$isSandbox = (($_GET['sandbox'] ?? ($input['sandbox'] ?? '')) === '1');
$accessToken = $isSandbox ? MP_SANDBOX_ACCESS_TOKEN : MP_ACCESS_TOKEN;
$publicKey = $isSandbox ? MP_SANDBOX_PUBLIC_KEY : MP_PUBLIC_KEY;

if ($action === 'config') {
    sendJson(200, [
        'ok' => true,
        'app' => MP_APP_NAME,
        'app_id' => MP_APP_ID,
        'user_id' => MP_USER_ID,
        'mode' => $isSandbox ? 'sandbox' : 'production',
        'public_key' => $publicKey,
    ]);
}

if ($action === 'order_status') {
    $orderId = trim((string) ($_GET['id'] ?? ''));
    if (!preg_match('/^[A-Za-z0-9_-]{8,64}$/', $orderId)) {
        sendJson(400, ['ok' => false, 'error' => 'order_id invalido']);
    }
    $res = callMpApi('GET', '/v1/orders/' . rawurlencode($orderId), $accessToken);
    if ($res['http'] < 200 || $res['http'] >= 300) {
        sendJson($res['http'] ?: 502, ['ok' => false, 'error' => $res['data']['message'] ?? 'No se pudo consultar la orden']);
    }
    $d = $res['data'];
    sendJson(200, [
        'ok' => true,
        'id' => $d['id'] ?? $orderId,
        'status' => $d['status'] ?? 'unknown',
        'status_detail' => $d['status_detail'] ?? '',
        'total_amount' => $d['total_amount'] ?? '',
        'external_reference' => $d['external_reference'] ?? '',
    ]);
}

if ($action === 'redirect' || $action === 'create_checkout_order') {
    $pkgParam = (string) ($_GET['pkg'] ?? ($input['pkg'] ?? 'signature'));
    $schemeParam = (string) ($_GET['scheme'] ?? ($input['scheme'] ?? 'deposit'));
    $pkg = resolvePackage($pkgParam, $schemeParam);
    $extRef = buildExternalReference($pkg['key'], $pkg['scheme']);

    $coupleNames = trim((string) ($input['couple_names'] ?? ''));
    $couplePhone = trim((string) ($input['couple_phone'] ?? ''));
    $payerEmail = trim((string) ($input['payer_email'] ?? ''));

    // Intentar primero vía microservicio unificado Cloud Run (telemetría SDK + conciliación Supabase + Webhook)
    $crPayload = [
        'brand' => 'celebration',
        'orderId' => $extRef,
        'buyerName' => $coupleNames !== '' ? $coupleNames : 'Cliente Celebration',
        'buyerEmail' => $payerEmail !== '' ? normalizeEmail($payerEmail) : 'concierge@thecelebration.com.mx',
        'buyerPhone' => $couplePhone,
        'items' => [
            [
                'title' => $pkg['name'] . ' — ' . $pkg['scheme_label'] . ' (CELEBRATION)',
                'unit_price' => $pkg['amount_float'],
                'quantity' => 1,
                'description' => 'Invitación Digital CELEBRATION — ' . $pkg['name'],
            ],
        ],
    ];

    $crRes = callCloudRunOrderService($isSandbox, $crPayload);
    $orderId = (string) ($crRes['data']['order_id'] ?? '');
    $checkoutUrl = (string) ($crRes['data']['checkout_url'] ?? '');
    $provider = 'cloudrun';

    // Respaldo directo contra API de Mercado Pago si Cloud Run no responde a tiempo
    if ($checkoutUrl === '') {
        $provider = 'direct_mp';
        $deviceId = trim((string) ($input['device_id'] ?? ($_SERVER['HTTP_X_MELI_SESSION_ID'] ?? '')));
        $payload = [
            'type' => 'online',
            'processing_mode' => 'manual',
            'total_amount' => $pkg['amount_str'],
            'external_reference' => $extRef,
            'description' => 'CELEBRATION — ' . $pkg['name'] . ' (' . $pkg['scheme_label'] . ')',
            'items' => buildOrderItems($pkg),
        ];

        $res = callMpApi('POST', '/v1/orders', $accessToken, $payload, generateUuidV4(), $deviceId);
        if ($res['http'] < 200 || $res['http'] >= 300 || empty($res['data']['checkout_url'])) {
            if ($action === 'redirect') {
                header('Location: /checkout.html?pkg=' . rawurlencode($pkg['key']) . '&scheme=' . rawurlencode($pkg['scheme']), true, 302);
                exit;
            }
            sendJson($res['http'] ?: 502, [
                'ok' => false,
                'error' => $res['data']['message'] ?? 'No se pudo generar la orden de checkout',
                'details' => $res['data']['errors'] ?? null,
            ]);
        }
        $orderId = (string) ($res['data']['id'] ?? '');
        $checkoutUrl = (string) $res['data']['checkout_url'];
    }

    appendOrderLog([
        'action' => $action,
        'provider' => $provider,
        'order_id' => $orderId,
        'pkg' => $pkg['key'],
        'scheme' => $pkg['scheme'],
        'amount' => $pkg['amount_str'],
        'external_reference' => $extRef,
        'status' => 'created',
        'mode' => $isSandbox ? 'sandbox' : 'production',
    ]);

    if ($action === 'redirect') {
        header('Location: ' . $checkoutUrl, true, 302);
        exit;
    }

    sendJson(200, [
        'ok' => true,
        'provider' => $provider,
        'order_id' => $orderId,
        'checkout_url' => $checkoutUrl,
        'total_amount' => $pkg['amount_str'],
        'external_reference' => $extRef,
        'pkg' => $pkg['key'],
        'scheme' => $pkg['scheme'],
    ]);
}

if ($method !== 'POST') {
    sendJson(405, ['ok' => false, 'error' => 'Metodo no permitido']);
}

if ($action === 'create_spei_order') {
    $pkg = resolvePackage((string) ($input['pkg'] ?? 'signature'), (string) ($input['scheme'] ?? 'deposit'));
    $extRef = buildExternalReference($pkg['key'], $pkg['scheme']);
    $email = normalizeEmail((string) ($input['payer_email'] ?? ''));
    [$firstName, $lastName] = splitCoupleName((string) ($input['couple_names'] ?? ''));

    $payer = [
        'email' => $email,
        'first_name' => $firstName,
        'last_name' => $lastName,
    ];
    $phoneObj = buildPayerPhone((string) ($input['couple_phone'] ?? ''));
    if ($phoneObj !== null) {
        $payer['phone'] = $phoneObj;
    }

    $payload = [
        'type' => 'online',
        'processing_mode' => 'automatic',
        'total_amount' => $pkg['amount_str'],
        'external_reference' => $extRef,
        'description' => 'CELEBRATION SPEI — ' . $pkg['name'] . ' (' . $pkg['scheme_label'] . ')',
        'payer' => $payer,
        'items' => buildOrderItems($pkg),
        'transactions' => [
            'payments' => [
                [
                    'amount' => $pkg['amount_str'],
                    'payment_method' => [
                        'id' => 'clabe',
                        'type' => 'bank_transfer',
                    ],
                ],
            ],
        ],
    ];

    $deviceId = trim((string) ($input['device_id'] ?? ($_SERVER['HTTP_X_MELI_SESSION_ID'] ?? '')));
    $res = callMpApi('POST', '/v1/orders', $accessToken, $payload, generateUuidV4(), $deviceId);
    if ($res['http'] < 200 || $res['http'] >= 300) {
        sendJson($res['http'] ?: 502, [
            'ok' => false,
            'error' => $res['data']['message'] ?? 'No se pudo generar la orden SPEI',
            'details' => $res['data']['errors'] ?? null,
        ]);
    }

    $pm = $res['data']['transactions']['payments'][0] ?? [];
    $pmInfo = $pm['payment_method'] ?? [];

    appendOrderLog([
        'action' => 'create_spei_order',
        'order_id' => $res['data']['id'] ?? '',
        'payment_id' => $pm['id'] ?? '',
        'pkg' => $pkg['key'],
        'scheme' => $pkg['scheme'],
        'amount' => $pkg['amount_str'],
        'external_reference' => $extRef,
        'status' => $res['data']['status'] ?? '',
        'mode' => $isSandbox ? 'sandbox' : 'production',
    ]);

    sendJson(200, [
        'ok' => true,
        'order_id' => $res['data']['id'] ?? '',
        'payment_id' => $pm['id'] ?? '',
        'status' => $res['data']['status'] ?? 'action_required',
        'status_detail' => $res['data']['status_detail'] ?? 'waiting_transfer',
        'clabe' => $pmInfo['reference'] ?? '',
        'ticket_url' => $pmInfo['ticket_url'] ?? '',
        'expiration' => $pm['date_of_expiration'] ?? '',
        'total_amount' => $pkg['amount_str'],
        'external_reference' => $extRef,
    ]);
}

if ($action === 'pay_card') {
    $token = trim((string) ($input['token'] ?? ''));
    $pmId = trim((string) ($input['payment_method_id'] ?? ''));
    if ($token === '' || $pmId === '') {
        sendJson(400, ['ok' => false, 'error' => 'Falta token de tarjeta o metodo de pago']);
    }

    $pkg = resolvePackage((string) ($input['pkg'] ?? 'signature'), (string) ($input['scheme'] ?? 'deposit'));
    $extRef = buildExternalReference($pkg['key'], $pkg['scheme']);
    $email = normalizeEmail((string) ($input['payer_email'] ?? ''));
    [$firstName, $lastName] = splitCoupleName((string) ($input['couple_names'] ?? ''));
    $pmType = resolveCardPaymentType($pmId, trim((string) ($input['payment_type_id'] ?? '')));
    $installments = max(1, min(24, (int) ($input['installments'] ?? 1)));

    $payer = [
        'email' => $email,
        'first_name' => $firstName,
        'last_name' => $lastName,
    ];
    $phoneObj = buildPayerPhone((string) ($input['couple_phone'] ?? ''));
    if ($phoneObj !== null) {
        $payer['phone'] = $phoneObj;
    }
    if (!empty($input['identification']['type']) && !empty($input['identification']['number'])) {
        $payer['identification'] = [
            'type' => substr((string) $input['identification']['type'], 0, 20),
            'number' => substr((string) $input['identification']['number'], 0, 40),
        ];
    }

    $payload = [
        'type' => 'online',
        'processing_mode' => 'automatic',
        'total_amount' => $pkg['amount_str'],
        'external_reference' => $extRef,
        'description' => 'CELEBRATION — ' . $pkg['name'] . ' (' . $pkg['scheme_label'] . ')',
        'payer' => $payer,
        'items' => buildOrderItems($pkg),
        'transactions' => [
            'payments' => [
                [
                    'amount' => $pkg['amount_str'],
                    'payment_method' => [
                        'id' => $pmId,
                        'type' => $pmType,
                        'token' => $token,
                        'installments' => $installments,
                        'statement_descriptor' => 'CELEBRATION',
                    ],
                ],
            ],
        ],
    ];

    $deviceId = trim((string) ($input['device_id'] ?? ($_SERVER['HTTP_X_MELI_SESSION_ID'] ?? '')));
    $res = callMpApi('POST', '/v1/orders', $accessToken, $payload, generateUuidV4(), $deviceId);
    if ($res['http'] < 200 || $res['http'] >= 300) {
        $rej = parseMpRejection($res['data']);
        sendJson($res['http'] ?: 502, [
            'ok' => false,
            'status' => 'failed',
            'status_detail' => $rej['detail'],
            'error' => $rej['message'],
            'details' => $res['data']['errors'] ?? null,
        ]);
    }

    $order = $res['data'];
    $pm = $order['transactions']['payments'][0] ?? [];

    appendOrderLog([
        'action' => 'pay_card',
        'order_id' => $order['id'] ?? '',
        'payment_id' => $pm['id'] ?? '',
        'pkg' => $pkg['key'],
        'scheme' => $pkg['scheme'],
        'amount' => $pkg['amount_str'],
        'external_reference' => $extRef,
        'status' => $order['status'] ?? '',
        'status_detail' => $pm['status_detail'] ?? ($order['status_detail'] ?? ''),
        'couple_phone' => substr(preg_replace('/\D+/', '', (string) ($input['couple_phone'] ?? '')), 0, 15),
        'mode' => $isSandbox ? 'sandbox' : 'production',
    ]);

    sendJson(200, [
        'ok' => true,
        'order_id' => $order['id'] ?? '',
        'payment_id' => $pm['id'] ?? '',
        'status' => $order['status'] ?? 'processing',
        'status_detail' => $pm['status_detail'] ?? ($order['status_detail'] ?? ''),
        'total_amount' => $pkg['amount_str'],
        'external_reference' => $extRef,
        'pkg_name' => $pkg['name'],
        'scheme_label' => $pkg['scheme_label'],
    ]);
}

sendJson(400, ['ok' => false, 'error' => 'Accion no reconocida']);
