const Constant = {
	searchType: {
        "GqWfIpSearch":"IP Sequence",
        "GqWfVMIpSearch":"Variation",
        "GqWfABIpSearch":"Antibody",
        "GqFolder":"Folder",
        "GqWfSeqSearch": "Blast Search",
        "GqWfAlndbCopy": "Save Filtered Result",
        "DlPhysicalSeqdb": "Sequence Database",
        "DlVirtualSeqdb": "Sequence Database"
        //"GqWfSeqSearch": "Blast Search"
    },
    folderRestrictNames:["Recent Search Results","My Data",'Reference Data','Data Shared With Me','Raw Uploaded Files','Search Folders'],
    strategies:[
        {value: "genepast", label: "GenePAST Search",val:"kerr"},
        {value: "blast", label: "BLAST Search", val:"blast"}
    ],
    patientSearchDatabases:[
        {value: "GQPAT_PRT", label: "GQ-Pat Gold+ Protein", ticked: true, selected: true},
        {value: "GQPAT_PREMIUM_PRT", label: "GQ-Pat Platinum Protein", ticked: true, selected: true},
        {value: "GEAA", label: "GENESEQ Protein", ticked: false, selected: false},
        {value: "CASPAT_PRT", label: "CAS Biosequences™ - Proteins from Patents", ticked: false, selected: false}
    ],
    alertOptions:{
        "0":"every time a database gets updated",
        null:"every time a database gets updated",
        "7":"every week",
        "14":"every 2 weeks",
        "30":"every month",
        "180":"every 6 months",
        "365":"every year"
    },
    nucleotideDB:['PROTEIN-PROTEIN','NUCLEOTIDE-PROTEIN','PROTEIN-NUCLEOTIDE','PROTEIN-MIX'],
    recordPerPage:5,
    fullTextSearchFields:[
        {key:"FullText",value:"Full Text"},
        {key:"Title",value:"Title"},
        {key:"TitleorAbstract",value:"Title, or Abstract"},
        {key:"TitleAbstractorClaims",value:"Title, Abstract, or Claims"},
        {key:"Claims",value:"Claims"},
        {key:"Abstract",value:"Abstract"},
        {key:"Description",value:"Description"}
    ]
}
export default Constant;