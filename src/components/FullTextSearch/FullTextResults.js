import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

function FullTextResults(props) {
    const { data } = props;
    const { t, i18n } = useTranslation("common");

    useEffect(() =>{

    });
    console.log('data', data)
    return (
        <div>
            {
                data && data.docs && data.docs.length > 0 && data.docs.map((item, index) => {
                    return(
                    <div key={index}>
                        <p>
                            <span>{item.patentid}</span><span> - </span><span>{item.title}</span>
                        </p>
                        <p><span>{t('publicationData')}</span><span>{item.pubdate}</span></p>
                        {item['desc_en_nostem-hl'] && item['desc_en_nostem-hl'].length > 0 && <p><span>{t("description")}</span>{item['desc_en_nostem-hl'][0]}</p>}
                        {/* {item.clm_en_nostem-hl && item.clm_en_nostem-hl.length > 0 && <p><span>{t("claims")}</span><span>{item.clm_en_nostem-hl[0]}</span></p>}
                        {item.abst_en_nostem-hl && item.abst_en_nostem-hl.length > 0 && <p><span>{t("abstract")}</span><span>{item.abst_en_nostem-hl[0]}</span></p>} */}
                        <hr />
                    </div>
                    );
                })
            }
        </div>
    )
}

export default FullTextResults;