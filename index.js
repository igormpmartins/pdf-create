const fs = require('fs')
const PdfPrinter = require('pdfmake')
const express = require('express')
const exp = require('constants')

const fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Bold.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-Bolditalic.ttf'
    }
}

const lista = []
lista.push([
    {text:'Pessoa', style: 'header'}, 
    {text:'E-mail', style: 'header'}, 
    {text:'Status', style: 'header'}
])

for (let i = 0; i < 100; i++) {

    let status = 'Ativo'

    if (i % 2 === 0) {
        status = {
            text: 'Inativo',
            style: 'inativo'
        }
    }

    lista.push(['Igor Martins', 'treku@treku.com.br', status])
}

const printer = new PdfPrinter(fonts)
const docDefinition = {
    content: [
        {
            image: 'images/greg.jpg',
            //height: 200,
            //width: 200
            fit: [200, 200]
        },
        {text: 'Relatório'},
        {text: '- Listagem - '},
        {
            table: {
                widths: ['*', '*', 100],
                body: lista
            }
        }
    ],
    styles: {
        header: {
            fontSize: 14,
            bold: true
        },
        inativo: {
            fontSize: 14,
            bold: true,
            italics: true
        }
    },
    footer: (page, pages) => {
        return {
            columns: [
                {text: '-> Relatório gerado com a lib PDFMake'},
                {
                    text: [
                        {text: page.toString(), italics: true, bold: true},
                        {text: ' de ', italics: true, bold: true},
                        {text: pages.toString(), italics: true, bold: true}
                    ], 
                    alignment: 'right'
                }
            ],
            margin: [40, 0]
        }
    }
}

/*
const pdf = printer.createPdfKitDocument(docDefinition)
pdf.pipe(fs.WriteStream('treku.pdf'))
pdf.end()
*/

const app = express()

app.get('/pdf/:name', (req, res) => {

    const userPDF = printer.createPdfKitDocument({
        content: {text: 'Olá ' + req.params.name}
    })

    //res.header('Content-Disposition', 'inline; filename=treku2.pdf')
    res.header('Content-Disposition', 'attachment; filename=' + req.params.name + '.pdf')
    res.header('Content-Type', 'application/pdf')

    userPDF.pipe(res)
    userPDF.end()

    //res.send(req.params.name)
})

app.listen(3000, (err) => {
    if (err) {
        console.log('error!', err)
    } else {
        console.log('server-online')
    }
})