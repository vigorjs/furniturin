<?php

declare(strict_types=1);

namespace App\Services\Ai;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GeminiVisionService
{
    private string $apiKey;

    private string $model;

    private string $baseUrl;

    private int $timeout;

    public function __construct()
    {
        $this->apiKey = (string) config('services.gemini.api_key', '');
        $this->model = (string) config('services.gemini.model', 'gemini-2.0-flash');
        $this->baseUrl = rtrim((string) config('services.gemini.base_url'), '/');
        $this->timeout = (int) config('services.gemini.timeout', 30);
    }

    /**
     * Send one or more images + prompt to Gemini and return parsed JSON.
     *
     * @param  array<int, UploadedFile>  $images  Ordered by priority; the first is treated as primary.
     * @param  array<string, mixed>  $jsonSchema
     * @return array<string, mixed>
     *
     * @throws RuntimeException when the API call fails or returns invalid JSON.
     */
    public function generateJsonFromImages(
        array $images,
        string $prompt,
        array $jsonSchema,
    ): array {
        if ($this->apiKey === '') {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        if ($images === []) {
            throw new RuntimeException('Minimal satu gambar diperlukan.');
        }

        $parts = [['text' => $prompt]];
        foreach ($images as $image) {
            $parts[] = ['inline_data' => [
                'mime_type' => $image->getMimeType() ?: 'image/jpeg',
                'data' => base64_encode((string) file_get_contents($image->getRealPath())),
            ]];
        }

        $payload = [
            'contents' => [['parts' => $parts]],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'responseSchema' => $jsonSchema,
                'temperature' => 0.4,
            ],
        ];

        $url = "{$this->baseUrl}/models/{$this->model}:generateContent";

        $response = Http::timeout($this->timeout)
            ->withQueryParameters(['key' => $this->apiKey])
            ->acceptJson()
            ->asJson()
            ->post($url, $payload);

        if (! $response->successful()) {
            Log::warning('Gemini vision request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            throw new RuntimeException('Gagal menghubungi Gemini API.');
        }

        $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (! is_string($text) || $text === '') {
            throw new RuntimeException('Respons Gemini kosong atau tidak valid.');
        }

        $decoded = json_decode($text, true);

        if (! is_array($decoded)) {
            Log::warning('Gemini returned non-JSON payload', ['text' => $text]);
            throw new RuntimeException('Gemini mengembalikan data yang tidak dapat diproses.');
        }

        return $decoded;
    }
}
