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
        {value: "blast", label: "BLAST Search", val:"blast"},
        {value: "fragment",label: "Fragment Search",val:"fragment"},
        {value: "motif",label: "MOTIF Search",val: "motif"}
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
    ],
    genePastItemsText:{
        "QUERY":" entire query sequence length",
        "SUBJECT":" entire length of any subject sequence",
        "SHORTER":" entire query sequence length or over the entire length of any subject sequence"
    },
    searchStrategies:{
        "kerr":"GenePAST",
        "blast":"BLAST",
        "fragment": "Fragment",
        "motif":"MOTIF"
    }
}
export default Constant;