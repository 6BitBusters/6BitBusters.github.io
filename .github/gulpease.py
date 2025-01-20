import re
import os
import sys
import pathlib as path

DOCS_PATH = 'Docs'
MIN_SENTENCE_LENGTH = 15
MIN_INDEX = 50


def format_text(path:str) -> str:
    with open(path, 'r', encoding='utf-8') as file:
        text = file.read()
    text = re.sub(r'\\textit{(.*?)}', r'\1', text) # remove italics
    text = re.sub(r'\\textbf{(.*?)}', r'\1', text) # remove bold
    text = re.sub(r's.p.a.', r'spa', text, flags=re.IGNORECASE)
    text = text.replace('\n', ' ') \
        .replace('\\\\', ' ') \
        .replace('\t', ' ') \
        .replace('\\tabularnewline', '&') \
        .replace('\"', '')
    for _ in range(10):
        text = text.replace('  ', ' ')
    text = text.replace('\'', ' ') 
    return text


def is_valid(sentence:str) -> bool:
    stripped = sentence.strip()
    return not (len(stripped) < MIN_SENTENCE_LENGTH \
        or '}' in stripped or '{' in stripped \
        or '\\' in stripped or '$' in stripped \
        or stripped.startswith('%') or stripped.endswith('%'))


def extract_sentences(text:str) -> list[str]:
    # for paragraphs
    paragraphs = re.findall(r'}(.*?)(?=\\)', text, re.DOTALL) 
    # for tables content
    paragraphs.extend(re.findall(r'&(.*?)(?=&)', text, re.DOTALL)) 
    # for lists
    paragraphs.extend(re.findall(r'\\item(.*?)(?=[;.])', text, re.DOTALL))
    sentences = [re.split(r'[.;:?] ', paragraph) for paragraph in paragraphs]
    # flatten the list (ex. [[a,b],[c,d]] -> [a,b,c,d])
    flat_sentences = [sentence for paragraph in sentences for sentence in paragraph]
    flat_sentences = [sentence for sentence in flat_sentences if is_valid(sentence)] 
    #print(flat_sentences)
    return flat_sentences


def extract_words(sentences:list) -> list[str]:
    words = []
    for sentence in sentences:
        words.extend(re.findall(r'\b\w+\b', sentence))
    return words


def calculate_gulpease(path:str) -> int:
    text = format_text(path)
    sentences = extract_sentences(text)
    words = extract_words(sentences)
    n_words = len(words)
    n_chars = sum(len(word) for word in words)
    n_sentences = len(sentences)
    #print(f'\nWords: {n_words}, Chars: {n_chars}, Sentences: {n_sentences}')
    if n_words == 0:
        return 0
    idx = round(89 + (300 * n_sentences - 10 * n_chars) / n_words)
    return idx if idx <= 100 else 100


def is_checkable(file:str) -> bool:
    return ".tex" in file and "main" not in file and "titlepage" not in file


def gulpease(doc:str) -> tuple[int, int]:
    current_path = path.Path(doc)
    tot=0
    n_files=0
    for file in os.listdir(current_path): # for each file in a doc
        if is_checkable(file): 
            n_files+=1
            idx = calculate_gulpease(str(current_path) + "/" + file)
            try:
                assert idx >= MIN_INDEX
            except AssertionError:
                raise AssertionError(f'::error::Indice Gulpease per {file}: {idx} \n::error::L`indice deve essere superiore a 50')
            tot+=idx
    return (tot,n_files)


def main():
    doc = sys.argv[1]
    try:
        result = gulpease(doc)
        print(result[0]/result[1])
    except AssertionError as err:
        print(err,file=sys.stderr)
        exit(1)


if __name__ == "__main__":
    main()
