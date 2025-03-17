import sys as sys
import shutil as cmd
import pathlib as path
import subprocess
import os
import logging
import concurrent.futures


TEMPLATE = '<li><a href="{{link}}" target="_blank">{{name}}</a> <span class="tag-versione">{{ver}}</span> </li>'
DOCS_PATH = "Docs"

class PDF:
    def __init__(self,name,ver,use):
        self.name = name
        self.ver = ver
        self.use = use
    def GetName(self,WExt=False):
        if WExt:
            return self.name+'.pdf'
        else :
            return self.name
    def GetVer(self):
        return self.ver
    def GetUse(self):
        return self.use
    def __lt__(self, other):
        if self.name < other.name:
            return True
        else:
            return False



def main(UseThread:bool=False):
    logging.basicConfig(level=os.getenv('LOGLEVEL', 'INFO'))
    init_path = os.getcwd()

    logging.info(f'Creating the workspace')
    cmd.rmtree('_site', ignore_errors=True)
    cmd.copytree('website', '_site', symlinks=False)

    html = path.Path('_site/index.html').read_text()

    pdfs = {}
    command = ["latexmk", "-pdf"]

    if UseThread:
        with concurrent.futures.ThreadPoolExecutor(60) as pool:
            for type in os.listdir(path.Path(DOCS_PATH)):
                pool.submit(BuildTypePDF,init_path,pdfs,command,type)
    else:
        BuildAllPDF(init_path, pdfs, command) 

    UpdateHtml(html,pdfs)


def BuildAllPDF(init_path:str, pdfs:dict[str, list], command:list[str]):
    logging.info(f'Building tex files')
    for type in os.listdir(path.Path(DOCS_PATH)):
        pdfs[type]=[]
        BuildTypePDF(init_path, pdfs, command, type)

def BuildTypePDF(init_path:str, pdfs:dict[str, list], command:list[str], type:str):
    for doc in os.listdir(path.Path(DOCS_PATH+"/"+type)):
        ver = GetDocVersion(path.Path(DOCS_PATH+"/"+type+"/"+doc+"/titlepage.tex"))
        use = GetDocUse(path.Path(DOCS_PATH+"/"+type+"/"+doc+"/titlepage.tex"))
        logging.debug(f"Current dir {os.getcwd()}")
        logging.debug(f"Changing dir to {path.Path('tex/'+type+'/'+doc)}")
        os.chdir(path.Path(DOCS_PATH+"/"+type+"/"+doc))
        result = subprocess.run(command + ["-jobname="+doc] + [path.Path("main.tex")],stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
        try:
            result.check_returncode()
        except Exception as e:
            logging.error(f"Compiling {doc} failed with stderr: \n{result.stderr}")
            exit(1)
        pdfs[type].append(PDF(doc,ver,use))
        cmd.move(doc+".pdf",path.Path("../../../_site/"+doc+".pdf"))
        logging.debug(f"Current dir to {os.getcwd()}")
        logging.debug(f"Changing dir to {path.Path(init_path)}")
        os.chdir(init_path)

def UpdateHtml(html:str,pdfs:dict[str, list]):
    logging.info(f'Updating the HTML')
    for type in pdfs:
        if type=="Generali":
            html = html.replace("{{Generali}}","<h2>Documentazione Interna</h2><ul>{{Generali Interni}}</ul><h2>Documentazione Esterna</h2><ul>{{Generali Esterni}}</ul>")
            pdfs[type].sort(reverse=True)
            i = []
            e = []
            for pdf in pdfs[type]:
                if pdf.GetUse() == "Interno":
                    i.append(MakeLink(pdf))
                if pdf.GetUse() == "Esterno":
                    e.append(MakeLink(pdf))
            html = html.replace("{{Generali Interni}}","\n".join(l for l in i))
            html = html.replace("{{Generali Esterni}}","\n".join(l for l in e))
        else:
            pdfs[type].sort(reverse=True)
            html = html.replace("{{"+ type +"}}","\n".join(MakeLink(pdf) for pdf in pdfs[type]))
    path.Path('_site/index.html').write_text(html)

def GetDocVersion(path:str):
    ver = ""
    with open(path,'r') as doc:
        for line in doc:
            if "Versione" in line:
                ver = line.split()[-1][:5]
    return ver if ver != "" else " -.-.-"

def GetDocUse(path:str):
    use = ""
    with open(path,'r') as doc:
        for line in doc:
            if "Uso" in line:
                use = line.split("&")[1].strip().strip("\\")
    return use if use != "" else "vuoto"
    
def MakeLink(pdf:PDF):
    return TEMPLATE.replace("{{link}}",pdf.GetName(True)).replace("{{name}}",pdf.GetName()).replace("{{ver}}",pdf.GetVer())

if __name__ == "__main__":
    main()


    
