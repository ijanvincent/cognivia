<?php

namespace App\Services\User;

use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory as WordIOFactory;
use PhpOffice\PhpPresentation\IOFactory as PresentationIOFactory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class DocumentParserService
{
    /**
     * Parse uploaded document and extract text content.
     *
     * @param UploadedFile $file
     * @return string
     * @throws \Exception
     */
    public function parse(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());

        return match ($extension) {
            'pdf'  => $this->parsePdf($file),
            'docx' => $this->parseDocx($file),
            'pptx' => $this->parsePptx($file),
            default => throw new \InvalidArgumentException(
                "Unsupported file type: {$extension}. Allowed: pdf, docx, pptx"
            ),
        };
    }

    /**
     * Extract text from PDF file.
     */
    private function parsePdf(UploadedFile $file): string
    {
        try {
            $parser = new PdfParser();
            $pdf    = $parser->parseFile($file->getRealPath());
            $text   = $pdf->getText();

            if (empty(trim($text))) {
                throw new \RuntimeException('PDF appears to be empty or image-based (no extractable text).');
            }

            return $this->sanitizeText($text);
        } catch (\InvalidArgumentException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('DocumentParserService PDF error', ['error' => $e->getMessage()]);
            throw new \RuntimeException('Failed to parse PDF: ' . $e->getMessage());
        }
    }

    /**
     * Extract text from DOCX file.
     */
    private function parseDocx(UploadedFile $file): string
    {
        try {
            $phpWord  = WordIOFactory::load($file->getRealPath(), 'Word2007');
            $sections = $phpWord->getSections();
            $text     = '';

            foreach ($sections as $section) {
                foreach ($section->getElements() as $element) {
                    $text .= $this->extractWordElementText($element);
                }
            }

            if (empty(trim($text))) {
                throw new \RuntimeException('DOCX appears to be empty or contains no extractable text.');
            }

            return $this->sanitizeText($text);
        } catch (\InvalidArgumentException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('DocumentParserService DOCX error', ['error' => $e->getMessage()]);
            throw new \RuntimeException('Failed to parse DOCX: ' . $e->getMessage());
        }
    }

    /**
     * Extract text from PPTX file.
     */
    private function parsePptx(UploadedFile $file): string
    {
        try {
            $presentation = PresentationIOFactory::load($file->getRealPath());
            $text         = '';

            foreach ($presentation->getAllSlides() as $slide) {
                foreach ($slide->getShapeCollection() as $shape) {
                    if ($shape instanceof \PhpOffice\PhpPresentation\Shape\RichText) {
                        foreach ($shape->getParagraphs() as $paragraph) {
                            foreach ($paragraph->getRichTextElements() as $element) {
                                $text .= $element->getText() . ' ';
                            }
                            $text .= "\n";
                        }
                    }
                }
            }

            if (empty(trim($text))) {
                throw new \RuntimeException('PPTX appears to be empty or contains no extractable text.');
            }

            return $this->sanitizeText($text);
        } catch (\InvalidArgumentException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('DocumentParserService PPTX error', ['error' => $e->getMessage()]);
            throw new \RuntimeException('Failed to parse PPTX: ' . $e->getMessage());
        }
    }

    /**
     * Recursively extract text from Word elements.
     */
    private function extractWordElementText($element): string
    {
        $text = '';

        if ($element instanceof \PhpOffice\PhpWord\Element\TextRun) {
            foreach ($element->getElements() as $child) {
                $text .= $this->extractWordElementText($child);
            }
            $text .= "\n";
        } elseif ($element instanceof \PhpOffice\PhpWord\Element\Text) {
            $text .= $element->getText() . ' ';
        } elseif ($element instanceof \PhpOffice\PhpWord\Element\Table) {
            foreach ($element->getRows() as $row) {
                foreach ($row->getCells() as $cell) {
                    foreach ($cell->getElements() as $cellElement) {
                        $text .= $this->extractWordElementText($cellElement);
                    }
                    $text .= "\t";
                }
                $text .= "\n";
            }
        }

        return $text;
    }

    /**
     * Sanitize extracted text — remove null bytes, normalize whitespace.
     */
    private function sanitizeText(string $text): string
    {
        // Remove null bytes
        $text = str_replace("\0", '', $text);
        // Normalize line endings
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        // Collapse excessive blank lines (max 2 consecutive)
        $text = preg_replace('/\n{3,}/', "\n\n", $text);
        // Trim
        return trim($text);
    }
}