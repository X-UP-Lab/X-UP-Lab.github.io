#!/usr/bin/env bash 
# https://bibtexparser.readthedocs.io/en/master/install.html
# https://github.com/lukasschwab/arxiv.py

# pip install bibtexparser
# pip install arxiv

import bibtexparser
import arxiv

def loadbib(bibfile):
    with open(bibfile) as bibtex_file:
        # bib_database = bibtexparser.load(bibtex_file)
        bib_database = bibtexparser.bparser.BibTexParser(common_strings=True).parse_file(bibtex_file)
    return bib_database

def savebib(bibfile, bib_database):
    with open(bibfile, 'w') as bibtex_file:
        bibtexparser.dump(bib_database, bibtex_file)

def search(title):
    search  = arxiv.Search(
        query = title,
        max_results = 1,
    )
    paper = next(search.results())
    return paper.pdf_url


def main():
    bibfile = '_bibliography/papers_src.bib'
    save_bib_file = '_bibliography/papers.bib'
    bib_database = loadbib(bibfile)
    # print(bib_database.entries)

    # add bibtex_show
    for entry in bib_database.entries:
        entry['bibtex_show'] = "true"
        entry['pdf'] = '{}'.format(search(entry['title']))
        print(entry['url'])
    
    savebib(save_bib_file, bib_database)


if __name__ == '__main__':
    main()