export const url = {
    login: "do=gquser.login&format=json",
    searchResult: "do=mygq.get_welcome_page_v2&format=json",
    searchResultStatus: "do=gqworkflow.get_status&format=json&key=progress",
    news: "do=mygq.get_news_bullet&format=json",
    seqSearchInit: "do=gqft.launch_seq_search&format=json",
    seqSearchSubmit: "do=gqworkflow.submit_seq_search&format=json",
    mostRecentTypeUrl:"resultsummNew/index.html#/resbrowse/wf:**.resdb/1",
    mostRecentClassicUrl:"gqresult&db=wf:**.resdb&is_workspace_recognized=1&def_view=query",
    mostRecentReportUrl:"resultsummNew/index.html#/antibody/overview/**",
    progress: "do=gqworkflow.get_status&workflow=id:**&format=json",
    accountInfo: "do=gquser.get_info&format=json",
    getprojectFolder:"do=gqfolder.get_home_folder&format=json",
    projectFolderDetail:"do=gqfolder.get_info&format=json&form=dojo&depth=4&id=**",
    projectFolderData:"do=gqfolder.get_elements_v2&id=**&sort=-create_time&format=json",
    deleteSearchResult:"do=gqshareable.delete&format=json&id=**&is_recursive=true"
}