import fitz
from pathlib import Path

pdf = Path('attached_assets/Advanced_Quantum_Learning_Platform_Enhancement_Prompt_1789146605962.pdf')
out = Path('.agents/outputs/quantum-enhancement-pages')
out.mkdir(parents=True, exist_ok=True)

doc = fitz.open(pdf)
print(f'pages={doc.page_count}')
print(f'metadata={doc.metadata}')
for index, page in enumerate(doc):
    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    path = out / f'page-{index+1:02d}.png'
    pix.save(path)
    print(path)
