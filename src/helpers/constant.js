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
    ]
}
export default Constant;