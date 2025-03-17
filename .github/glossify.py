import pathlib as path
import os
import concurrent.futures
import datetime 
import re

DOCS_PATH = "Docs"
G_KEYWORD = r"\\textsubscript{g}"
SKIP_LATEX_TAGS = [r"\\section",r"\\subsection",r"\\subsubsection",r"\\paragraph",r"\\includegraphics",r"\\url",r"\\includepdf",r"\\nameref"]

def main(UseThread:bool=False):
    glox_path = path.Path(DOCS_PATH+"/Generali/glossario/01_content.tex")
    
    defs = ReadAllWords(glox_path)

    if UseThread:
        with concurrent.futures.ThreadPoolExecutor(3) as pool: # with -> automatically wait for all threads
            for type in os.listdir(path.Path(DOCS_PATH)):
                if type == "Candidatura": # skippa la candidatura
                    continue
                pool.submit(Apply,defs,type)
    else:
        ApplyAll(defs)
        # print(defs)


def ApplyAll(defs:list):
    for type in os.listdir(path.Path(DOCS_PATH)):
        if type == "Candidatura":
            continue
        Apply(defs, type)

def Apply(defs:list, type:str):
    for doc in os.listdir(path.Path(DOCS_PATH+"/"+type)):
        if doc == "glossario": # skippa il glossario
            continue
        if ("VE" in doc or "VI" in doc) and not IsRecent(doc): # skip old reports
            continue

        current_path = path.Path(DOCS_PATH+"/"+type+"/"+doc)
        for file in  os.listdir(current_path): # for each file file in a doc
            if ".tex" not in file: # if is not a tex file skip
                continue
            file_path = str(current_path)+"/"+file
            Glossify(defs, file_path, file)

def Glossify(defs, file_path, file):
    with open(file_path,'r+',encoding='utf-8') as f:
        lines = f.readlines()
        for i,line in enumerate(lines):
            if re.search(r"|".join(SKIP_LATEX_TAGS),line.strip()): # if is in the skip list continue
                continue
            for j,d in enumerate(defs): # test if any definition is present in a line and replace it with its unique code
                pattern = "\\b"+d[0]+"\\b"
                matched = re.search(pattern,line,flags=re.IGNORECASE) # if present store the initial word
                if matched:
                    m = matched.group()
                    defs[j] = UpdateTupleKey(d,m) # update the lookup table
                line = re.sub(pattern,d[1],line,flags=re.IGNORECASE) # replace with code
                lines[i] = line
            for d in defs: # replace codes with the original word+pedice
                pattern = "\\b"+d[1]+"\\b"
                line = re.sub(pattern,d[0]+G_KEYWORD,line,flags=re.IGNORECASE)
                lines[i] = line
        f.seek(0)
        f.writelines(lines)

def ReadAllWords(glox_path):
    defs = {}
    i = 0
    with open(glox_path,'r',encoding='utf-8') as f:
        for line in f:
            if "\\subsection" in line:
                g_def = line.strip()[12:-1]
                defs[g_def] = str(i)*3
                i+=1
    defs = sorted(defs.items(), key=lambda x : len(x[0]),reverse=True) # sort dictionary based on word length
    return defs

def IsRecent(doc:str):
    date=doc.split('-')
    date[0] = date[0].split('_')[1]

    lower_bound = datetime.datetime(2024,11,13)
    document_date=datetime.datetime(int(date[0]),int(date[1]),int(date[2])) # date[0] = year, date[1] = month, date[2] = day
    return lower_bound<=document_date


def UpdateTupleKey(t:tuple,value:str): # util function to overwrite a tuple
    l = list(t)
    l[0] = value
    return tuple(l)

if __name__ == "__main__":
    main(1)

