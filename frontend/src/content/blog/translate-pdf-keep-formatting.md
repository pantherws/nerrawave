---
slug: translate-pdf-keep-formatting
title: How to Translate a PDF Without Losing the Formatting
dek: Translating the PDF is harder — layout, tables, and fonts have to survive the switch to another language.
date: October 6, 2026
tags: PDF, Formatting, Translation
heroVariant: pdf-format
---

Translating the words in a PDF is easy.
Translating the PDF is harder.
Anyone who has copied text out of a PDF, translated it and attempted to put it back knows the problem. Paragraphs move. Tables break. Fonts change. Headings wrap differently. Page numbers shift. Text boxes stop fitting their contents.
The translation may be correct, but the document no longer looks like the document you started with.
Modern AI document translation is changing that process.
Instead of treating a PDF as a container from which text must be extracted, translated and manually rebuilt, document translation systems can analyse the structure of the PDF, translate its content and reconstruct the translated document while retaining its original layout as closely as possible.
Here is how it works.
##! Can you translate a PDF and keep the same formatting?
Yes, although the quality of the result depends on the PDF and the translation system being used.
A relatively simple digital PDF containing ordinary paragraphs and headings is much easier to process than a scanned document containing multiple columns, complex tables, handwritten notes and embedded graphics.
The important distinction is between **translating the text in a PDF** and **translating the PDF itself**.
A text translator only needs to return translated words.
A PDF translator that preserves formatting needs to understand both the language and the document.
##! Why does PDF formatting break when translated?
There is a simple reason.
Languages take up different amounts of space.
Suppose an English heading occupies one line.
Its German translation may require two.
A short English paragraph might become longer in French. A translation into Chinese might occupy space very differently. Arabic introduces right to left text direction. Different writing systems may require different fonts.
The original PDF was designed around the dimensions of the original language.
Once that language changes, the layout has to accommodate the new content.
This can affect:
* line breaks
* paragraph height
* page breaks
* table dimensions
* headings
* captions
* text boxes
* columns
* headers and footers
* pagination
* spacing
This is why simply replacing the source text with translated text does not always work.
The translated document sometimes needs to be reconstructed rather than merely overwritten.
## First, determine what kind of PDF you have
Not all PDFs are the same.
This has a major effect on how they can be translated.
### Text based PDFs
A text based PDF contains actual machine readable text.
You can usually test this by attempting to select individual words with your cursor.
These documents are generally easier to translate because the text can be identified directly.
### Scanned PDFs
A scanned PDF may look identical to a normal PDF when you open it, but each page is effectively an image.
There may be no machine readable text at all.
Before translation can begin, optical character recognition is required to identify the text on the page.
### Image heavy PDFs
Some PDFs combine ordinary text with photographs, diagrams, screenshots or other graphics containing additional text.
This creates a mixed document processing problem.
The system needs to determine which content can be translated, which elements should remain unchanged and how translated text relates to surrounding visual elements.
### Complex structured PDFs
Reports, brochures, academic papers, legal documents and corporate publications can contain multiple columns, tables, footnotes, captions and layered visual elements.
These documents require more than simple text extraction if the objective is to preserve their appearance.
## Method 1: Copy and paste the text
The simplest way to translate a PDF is to copy its text into a translation tool or AI assistant.
For short, simple documents, this can work perfectly well.
The problem is that copying the text often removes information about the document.
The translation system may know what the words say, but it may no longer know which text belonged in a table, which paragraph was a caption or where a particular heading appeared on the page.
After translation, you have translated text rather than a translated PDF.
You then need to rebuild the document yourself.
For a one page letter, that might take a few minutes.
For a long report, it can become the most time consuming part of the entire translation process.
## Method 2: Convert the PDF before translating
Another approach is to convert the PDF into an editable format, such as a word processing document, translate that file, and then export it back to PDF.
This can work well for relatively simple PDFs.
However, PDF conversion is imperfect.
Complex tables, columns, text boxes, graphics and typography can change during conversion before translation has even started.
You can therefore end up solving two formatting problems.
First, repairing the PDF conversion.
Then, repairing the translated document.


## Method 3: Use an AI document translator
A dedicated AI document translator attempts to handle the complete process.
Instead of asking you to extract and rebuild the document manually, the system analyses the file, identifies its content and structure, translates the relevant text and reconstructs the document afterwards.
This is the approach Nerrawave is built around.
The aim is not merely to translate what the PDF says.
It is to return the document in another language.


##! How an AI PDF translator preserves formatting
The exact technology varies between systems, but a modern document translation workflow can be understood in several stages.
### Step 1: Analyse the PDF
Before translation begins, the system examines the document.
It attempts to identify both textual content and structural elements.
This might include headings, paragraphs, tables, lists, columns, captions, images, headers, footers and other page elements.
The objective is to create an understanding of how the document is constructed.
### Step 2: Extract the content that needs translation
Once the structure is understood, translatable content can be separated logically from the formatting and document information that should remain.
This is important.
A document translation system should not blindly translate everything it encounters.
Some content is language.
Some content is structure.
Some content should remain unchanged.
### Step 3: Translate the content
The extracted language is translated into the selected target language.
Modern AI models can consider surrounding context when making translation decisions.
This is particularly useful when a word or phrase could have several meanings.
Rather than treating each sentence as completely independent, contextual translation can use information from elsewhere in the document.
### Step 4: Review the translation
The first translation does not necessarily need to be the final translation.
A separate AI review process can check the translated content for possible mistranslations, missing information, terminology inconsistencies and unnatural phrasing.
Nerrawave incorporates automated review and proofreading into the translation workflow for this reason.
The objective is not simply to generate translated text as quickly as possible.
It is to produce a better finished document.
### Step 5: Reconstruct the PDF
The translated content then needs to be returned to the document.
The system uses the structural information identified earlier to determine where translated content belongs.
A heading should remain a heading.
Text from a table cell should return to the appropriate table cell.
A caption should remain associated with its image.
The document is reconstructed around the new language.
##! How do scanned PDFs get translated?
Scanned PDFs require an additional step because their text may not actually exist as digital text.
The system first needs to read the page.
This process is generally performed using optical character recognition, or OCR.
OCR converts visible characters in an image into machine readable text.
For document translation, however, simply recognising the words is not enough.
Imagine scanning a restaurant menu with three columns.
An OCR system might correctly recognise every word but fail to understand the order in which those words should be read.
The same problem occurs with tables, forms, academic papers and complex reports.
More advanced document analysis attempts to recognise layout as well as characters.
That means understanding that a particular block is a heading, these elements form a table, this text belongs in the left column, and this caption relates to the image above it.
The better the structural understanding, the better the system's chances of reconstructing the translated document afterwards.
## What happens to tables during PDF translation?
Tables are one of the clearest examples of why document translation is different from text translation.
A table represents relationships between information.
If all the text is extracted as a continuous sequence, those relationships can be lost.
A document aware translation system instead attempts to identify the table as a structure.
The text within individual cells can then be translated while the relationships between rows and columns are retained.
There is still a practical challenge.
Translated text may be longer than the original text.
A narrow column designed around a short English word may not have enough room for its translation.
The reconstruction system therefore needs to accommodate differences in language while preserving the table as closely as possible.
## What happens to images?
An image that contains no text generally does not need translation.
It should simply remain where it belongs.
Images containing text are more complicated.
A photograph of a street sign, a screenshot of an application, a diagram containing labels and a designed advertisement all contain language in different forms.
Whether that text can be translated automatically depends on the image, document and capabilities of the translation system.
For this reason, users should always review image heavy translated documents where text embedded inside graphics is important.
## Can AI preserve fonts?
Sometimes.
Whether the same font can be retained depends partly on whether that font supports the characters required by the target language.
A font designed for the Latin alphabet may not contain Chinese, Japanese, Arabic or Cyrillic characters.
Even when a font technically supports both languages, differences in character width and text direction can alter the visual result.
Preserving formatting therefore does not always mean making every typographical measurement mathematically identical.
It means preserving the design, hierarchy and structure of the original document as faithfully as the new language allows.


## Can you translate a PDF into multiple languages?
Yes.
Once a source document has been analysed, the same source can potentially be translated into several target languages.
This is particularly useful for businesses and organisations producing multilingual material.
A company might have one English source document that needs French, German, Spanish and Portuguese versions.
Instead of treating these as unrelated files, a document translation system can treat them as multiple language versions of the same source.
Nerrawave is designed around this type of multi target document workflow.
## How can you improve the accuracy of a PDF translation?
The source document matters.
Clear, well written source material is generally easier to translate accurately than ambiguous or poorly structured content.
There are several things that can improve the process.
### Provide terminology
If particular terms must be translated in a particular way, provide a glossary where the translation system supports one.
### Add instructions
Tell the system about relevant context, audience, terminology or style requirements where instructions are supported.
### Use a good quality source file
For scans, image quality matters.
Low resolution pages, blurred text, unusual fonts, handwriting and damaged scans can make text recognition more difficult.
### Review important documents
AI can produce highly capable translations, but no automated system should be assumed to be infallible.
The more consequential the document, the more important appropriate human review becomes.
## Can AI translate legal PDFs?
AI can translate the language contained in legal documents, but there is an important distinction between a translation and a certified or legally verified translation.
A contract can be translated by AI.
That does not automatically mean the translation should be relied upon for litigation, regulatory filing or another high stakes legal purpose without professional review.
The same principle applies to medical, regulatory and safety critical documents.
The technology can perform the translation.
The intended use determines the level of verification required afterwards.
## Is AI PDF translation secure?
That depends on the service.
A PDF may contain personal information, financial information, contracts, intellectual property, business plans or other confidential material.
Before uploading sensitive documents, users should understand how the service handles files.
Useful questions include:
Where is the document processed?
Are third party AI or document processing providers involved?
How long is the file retained?
Can the user delete it?
Is document content used for AI model training?
What security measures are used?
A reputable document translation service should address these questions in its Privacy Policy rather than leaving users to guess.
## What is the best way to translate a PDF while keeping the layout?
For a short and simple PDF, several approaches may work.
For a complex document, the most efficient approach is generally a document translation system designed to preserve structure rather than a text translator that requires the document to be rebuilt afterwards.
The distinction becomes increasingly important as the document becomes longer or more complicated.
A five sentence PDF does not present much of a formatting problem.
A 70 page annual report does.
The value of document aware translation increases with the complexity of the document.
## Why formatting is part of translation
Formatting is sometimes treated as something that happens after translation.
For documents, that distinction is increasingly artificial.
The location of information can affect its meaning.
A heading tells you that the paragraphs beneath it belong to a particular subject.
A table tells you that certain values relate to certain categories.
A caption tells you that text relates to a particular image.
Structure carries information.
Preserving that structure is therefore not merely cosmetic.
It is part of preserving the document.
## From PDF translation to document translation
PDF translation illustrates a larger change taking place in language technology.
For years, automated translation concentrated primarily on converting source text into target text.
AI has made that translation increasingly capable.
The next problem is everything surrounding the words.
Understanding the document.
Maintaining terminology.
Checking the translation.
Preserving the layout.
Reconstructing the file.
Delivering something that can actually be used.
That is where document translation is heading.
##! Translate the document, not just the words
Nerrawave was built around a simple principle.

> **Translation changes the language. It shouldn't change the document.**

Upload a PDF or another supported document, select the target language, and Nerrawave handles the translation workflow, including document analysis, AI translation, automated review and document reconstruction.
Because the useful output of document translation should not be a block of translated text.
It should be your document.
In another language.
