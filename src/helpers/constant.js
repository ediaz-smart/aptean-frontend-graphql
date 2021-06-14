const Constant = {
	searchType: {
        "GqWfIpSearch":"IP Sequence",
        "GqWfABIpSearch":"Antibody",
        "GqFolder":"Folder"
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
        "":"every time a database gets updated",
        null:"every time a database gets updated",
        "7":"every week",
        "14":"every 2 weeks",
        "30":"every month",
        "180":"every 6 months",
        "365":"every year"
    },
    nucleotideDB:['PROTEIN-PROTEIN','NUCLEOTIDE-PROTEIN','PROTEIN-NUCLEOTIDE','PROTEIN-MIX']
}
export default Constant;