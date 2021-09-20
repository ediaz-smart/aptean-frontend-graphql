
    export default function getAuthorities() {
        var result = [];
        data.map((item, index) =>{
            let obj = {};
            var au = item.substring(0, 2);
            var desc = au + " -" + item.substring(2);
            obj['value'] = (au == '--') ? '' : au;
            obj['label'] = desc;
            result.push(obj);
        })
        return result;
    };

    let data = [
        "US	United States of America",
        "EP	European Patent Office (EPO)",
        "WO	World Intellectual Property Organization (WIPO)",
        "CA	Canada",
        "CN	China",
        "KR	Republic of Korea",
        "DE	Germany",
        "AU	Australia",
        "GB	United Kingdom",
        "--------------",
        "AD	Andorra",
        "AE	United Arab Emirates",
        "AF	Afghanistan",
        "AG	Antigua and Barbuda",
        "AI	Anguilla",
        "AL	Albania",
        "AM	Armenia",
        "AO	Angola",
        "AP	African Regional IP Organization (ARIPO)",
        "AR	Argentina",
        "AT	Austria",
        //"AU	Australia",
        "AW	Aruba",
        "AZ	Azerbaijan",
        "BA	Bosnia and Herzegovina",
        "BB	Barbados",
        "BD	Bangladesh",
        "BE	Belgium",
        "BF	Burkina Faso",
        "BG	Bulgaria",
        "BH	Bahrain",
        "BI	Burundi",
        "BJ	Benin",
        "BM	Bermuda",
        "BN	Brunei Darussalam",
        "BO	Bolivia",
        "BQ	Bonaire Saint Eustatius and Saba",
        "BR	Brazil",
        "BS	Bahamas",
        "BT	Bhutan",
        "BV	Bouvet Island",
        "BW	Botswana",
        "BX	Benelux Office for Intellectual Property (BOIP)",
        "BY	Belarus",
        "BZ	Belize",
        //"CA	Canada",
        "CD	Democratic Republic of the Congo",
        "CF	Central African Republic",
        "CG	Congo",
        "CH	Switzerland",
        "CI	Côte d’Ivoire",
        "CK	Cook Islands",
        "CL	Chile",
        "CM	Cameroon",
        //"CN	China",
        "CO	Colombia",
        "CR	Costa Rica",
        "CS	Czechoslovakia",
        "CU	Cuba",
        "CV	Cape Verde",
        "CW	Curaçao",
        "CY	Cyprus",
        "CZ	Czech Republic",
        "DD	German Democratic Republic",
        //"DE	Germany",
        "DJ	Djibouti",
        "DK	Denmark",
        "DM	Dominica",
        "DO	Dominican Republic",
        "DZ	Algeria",
        "EA	Eurasian Patent Organization (EAPO)",
        "EC	Ecuador",
        "EE	Estonia",
        "EG	Egypt",
        "EH	Western Sahara",
        //"EP	European Patent Office (EPO)",
        "ER	Eritrea",
        "ES	Spain",
        "ET	Ethiopia",
        "FI	Finland",
        "FJ	Fiji",
        "FK	Falkland Islands (Malvinas)",
        "FO	Faroe Islands",
        "FR	France",
        "GA	Gabon",
        //"GB	United Kingdom",
        "GC	Gulf Cooperation Council (GCC)",
        "GD	Grenada",
        "GE	Georgia",
        "GG	Guernsey",
        "GH	Ghana",
        "GI	Gibraltar",
        "GL	Greenland",
        "GM	Gambia",
        "GN	Guinea",
        "GQ	Equatorial Guinea",
        "GR	Greece",
        "GS	South Georgia and the South Sandwich Islands",
        "GT	Guatemala",
        "GW	Guinea-Bissau",
        "GY	Guyana",
        "HK	Hong Kong Special Admin. Region of the PRC",
        "HN	Honduras",
        "HR	Croatia",
        "HT	Haiti",
        "HU	Hungary",
        "IB	International Bureau of WIPO",
        "ID	Indonesia",
        "IE	Ireland",
        "IL	Israel",
        "IM	Isle of Man",
        "IN	India",
        "IQ	Iraq",
        "IR	Iran (Islamic Republic of)",
        "IS	Iceland",
        "IT	Italy",
        "JE	Jersey",
        "JM	Jamaica",
        "JO	Jordan",
        "JP	Japan",
        "KE	Kenya",
        "KG	Kyrgyzstan",
        "KH	Cambodia",
        "KI	Kiribati",
        "KM	Comoros",
        "KN	Saint Kitts and Nevis",
        "KP	Democratic People’s Republic of Korea",
        //"KR	Republic of Korea",
        "KW	Kuwait",
        "KY	Cayman Islands",
        "KZ	Kazakhstan",
        "LA	Lao People’s Democratic Republic",
        "LB	Lebanon",
        "LC	Saint Lucia",
        "LI	Liechtenstein",
        "LK	Sri Lanka",
        "LR	Liberia",
        "LS	Lesotho",
        "LT	Lithuania",
        "LU	Luxembourg",
        "LV	Latvia",
        "LY	Libyan Arab Jamahiriya",
        "MA	Morocco",
        "MC	Monaco",
        "MD	Republic of Moldova",
        "ME	Montenegro",
        "MG	Madagascar",
        "MK	The former Yugoslav Republic of Macedonia",
        "ML	Mali",
        "MM	Myanmar",
        "MN	Mongolia",
        "MO	Macao",
        "MP	Northern Mariana Islands",
        "MR	Mauritania",
        "MS	Montserrat",
        "MT	Malta",
        "MU	Mauritius",
        "MV	Maldives",
        "MW	Malawi",
        "MX	Mexico",
        "MY	Malaysia",
        "MZ	Mozambique",
        "NA	Namibia",
        "NE	Niger",
        "NG	Nigeria",
        "NI	Nicaragua",
        "NL	Netherlands",
        "NO	Norway",
        "NP	Nepal",
        "NR	Nauru",
        "NZ	New Zealand",
        "OA	African Intellectual Property Organization (OAPI)",
        "OM	Oman",
        "PA	Panama",
        "PE	Peru",
        "PG	Papua New Guinea",
        "PH	Philippines",
        "PK	Pakistan",
        "PL	Poland",
        "PT	Portugal",
        "PW	Palau",
        "PY	Paraguay",
        "QA	Qatar",
        "QZ	Community Plant Variety Office (EU) (CPVO)",
        "RD	Research Disclosures",
        "RH	Rhodesia",
        "RO	Romania",
        "RS	Serbia",
        "RU	Russian Federation",
        "RW	Rwanda",
        "SA	Saudi Arabia",
        "SB	Solomon Islands",
        "SC	Seychelles",
        "SD	Sudan",
        "SE	Sweden",
        "SG	Singapore",
        "SH	Saint Helena Ascension and Tristan da Cunha",
        "SI	Slovenia",
        "SK	Slovakia",
        "SL	Sierra Leone",
        "SM	San Marino",
        "SN	Senegal",
        "SO	Somalia",
        "SR	Suriname",
        "ST	Sao Tome and Principe",
        "SU	Soviet Union",
        "SV	El Salvador",
        "SX	Sint Maarten (Dutch part)",
        "SY	Syrian Arab Republic",
        "SZ	Swaziland",
        "TC	Turks and Caicos Islands",
        "TD	Chad",
        "TG	Togo",
        "TH	Thailand",
        "TJ	Tajikistan",
        "TL	Timor–Leste",
        "TM	Turkmenistan",
        "TN	Tunisia",
        "TO	Tonga",
        "TP	International Technology Disclosures",
        "TR	Turkey",
        "TT	Trinidad and Tobago",
        "TV	Tuvalu",
        "TW	Taiwan",
        "TZ	United Republic of Tanzania",
        "UA	Ukraine",
        "UG	Uganda",
        //"US	United States of America",
        "UY	Uruguay",
        "UZ	Uzbekistan",
        "VA	Holy See (Vatican City State)",
        "VC	Saint Vincent and the Grenadines",
        "VE	Venezuela",
        "VG	Virgin Islands (British)",
        "VN	Vietnam",
        "VU	Vanuatu",
        //"WO	World Intellectual Property Organization (WIPO)",
        "WS	Samoa",
        "XN	Nordic Patent Institute (NPI)",
        "YE	Yemen",
        "YU	Yugoslavia/Serbia and Montenegro",
        "ZA	South Africa",
        "ZM	Zambia",
        "ZW	Zimbabwe"
    ];
