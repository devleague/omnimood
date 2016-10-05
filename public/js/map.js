 var svg = d3.select("svg"),
   width = +svg.attr("width"),
   height = +svg.attr("height");

 var outlineDefault = "#eeeeee";
 var outlineHighlight = "#1221ee";
 var fillDefault = "#000000";

 var moodMin = 0;
 var moodMid = 5;
 var moodMax = 10;

 var testText = d3.select("body").append("div").attr("id", "testText");
 //var x=d3.scale.ordinal()
 //.domain(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]);
 // var moodScale=d3.scale.ordinal().range(['#dd2222','#cccccc','#2222dd']); //.domain([-10,0,10]);

 var moodScale = d3.scaleLinear()
   .domain([moodMin, moodMid, moodMax])
   .range(["red", "yellow", "green"]);

 d3.json("json/world-50m.json", function(error, world) {

   var countries = topojson.feature(world, world.objects.countries).features

   var projection = d3.geoMercator()
     .scale((width - 3) / (2 * Math.PI))
     .translate([width / 2, height / 2]);

   var path = d3.geoPath()
     .projection(projection);

   svg.selectAll(".country")
     .data(countries)
     .enter().insert("path", ".graticule")
     .attr("id", function(d) {
       return "cc" + d.id;
     })
     .attr("d", path)
     .attr("stroke", outlineDefault)
     .style("fill", fillDefault) //fillDefault
     .on("mouseover", function(d) {
       d3.select(this)
         .attr("stroke", outlineHighlight);
     })
     .on("mouseout", function() {
       d3.select(this)
         .attr("stroke", outlineDefault)
     })
     .append("svg:title")
     .text(function(d) {
       return testCountryNameJSON[d.id]
     });
 });


 function displayCountry(id) {
   d3.select("h1#title").text(id);
 }

 function setCountryMood(id, mood) {
   svg.select("path#cc" + id)
     .data([1, 1, 2])
     .style("fill", mood);
 }

 setInterval(function() {
   var thisCountryObject = testCountryJSON[Math.floor((Math.random() * testCountryJSON.length))];
  // console.log(thisCountryObject);
   displayCountry(thisCountryObject.c);
   setCountryMood(thisCountryObject.id, moodScale(Math.floor((Math.random() * moodMax))));
 }, 100);


 var testCountryJSON = [{
   "id": "004 ",
   "c": "Afghanistan"
 }, {
   "id": "008 ",
   "c": "Albania"
 }, {
   "id": "010 ",
   "c": "Antarctica"
 }, {
   "id": "012 ",
   "c": "Algeria"
 }, {
   "id": "016 ",
   "c": "American Samoa"
 }, {
   "id": "020 ",
   "c": "Andorra"
 }, {
   "id": "024 ",
   "c": "Angola"
 }, {
   "id": "028 ",
   "c": "Antigua and Barbuda"
 }, {
   "id": "031 ",
   "c": "Azerbaijan"
 }, {
   "id": "032 ",
   "c": "Argentina"
 }, {
   "id": "036 ",
   "c": "Australia"
 }, {
   "id": "040 ",
   "c": "Austria"
 }, {
   "id": "044 ",
   "c": "Bahamas"
 }, {
   "id": "048 ",
   "c": "Bahrain"
 }, {
   "id": "050 ",
   "c": "Bangladesh"
 }, {
   "id": "051 ",
   "c": "Armenia"
 }, {
   "id": "052 ",
   "c": "Barbados"
 }, {
   "id": "056 ",
   "c": "Belgium"
 }, {
   "id": "060 ",
   "c": "Bermuda"
 }, {
   "id": "064 ",
   "c": "Bhutan"
 }, {
   "id": "068 ",
   "c": "Bolivia, Plurinational State of"
 }, {
   "id": "070 ",
   "c": "Bosnia and Herzegovina"
 }, {
   "id": "072 ",
   "c": "Botswana"
 }, {
   "id": "074 ",
   "c": "Bouvet Island"
 }, {
   "id": "076 ",
   "c": "Brazil"
 }, {
   "id": "084 ",
   "c": "Belize"
 }, {
   "id": "086 ",
   "c": "British Indian Ocean Territory"
 }, {
   "id": "090 ",
   "c": "Solomon Islands"
 }, {
   "id": "092 ",
   "c": "Virgin Islands, British"
 }, {
   "id": "096 ",
   "c": "Brunei Darussalam"
 }, {
   "id": "100 ",
   "c": "Bulgaria"
 }, {
   "id": "104 ",
   "c": "Myanmar"
 }, {
   "id": "108 ",
   "c": "Burundi"
 }, {
   "id": "112 ",
   "c": "Belarus"
 }, {
   "id": "116 ",
   "c": "Cambodia"
 }, {
   "id": "120 ",
   "c": "Cameroon"
 }, {
   "id": "124 ",
   "c": "Canada"
 }, {
   "id": "132 ",
   "c": "Cabo Verde"
 }, {
   "id": "136 ",
   "c": "Cayman Islands"
 }, {
   "id": "140 ",
   "c": "Central African Republic"
 }, {
   "id": "144 ",
   "c": "Sri Lanka"
 }, {
   "id": "148 ",
   "c": "Chad"
 }, {
   "id": "152 ",
   "c": "Chile"
 }, {
   "id": "156 ",
   "c": "China"
 }, {
   "id": "158 ",
   "c": "Taiwan, Province of China"
 }, {
   "id": "162 ",
   "c": "Christmas Island"
 }, {
   "id": "166 ",
   "c": "Cocos (Keeling) Islands"
 }, {
   "id": "170 ",
   "c": "Colombia"
 }, {
   "id": "174 ",
   "c": "Comoros"
 }, {
   "id": "175 ",
   "c": "Mayotte"
 }, {
   "id": "178 ",
   "c": "Congo"
 }, {
   "id": "180 ",
   "c": "Congo, the Democratic Republic of the"
 }, {
   "id": "184 ",
   "c": "Cook Islands"
 }, {
   "id": "188 ",
   "c": "Costa Rica"
 }, {
   "id": "191 ",
   "c": "Croatia"
 }, {
   "id": "192 ",
   "c": "Cuba"
 }, {
   "id": "196 ",
   "c": "Cyprus"
 }, {
   "id": "203 ",
   "c": "Czechia"
 }, {
   "id": "204 ",
   "c": "Benin"
 }, {
   "id": "208 ",
   "c": "Denmark"
 }, {
   "id": "212 ",
   "c": "Dominica"
 }, {
   "id": "214 ",
   "c": "Dominican Republic"
 }, {
   "id": "218 ",
   "c": "Ecuador"
 }, {
   "id": "222 ",
   "c": "El Salvador"
 }, {
   "id": "226 ",
   "c": "Equatorial Guinea"
 }, {
   "id": "231 ",
   "c": "Ethiopia"
 }, {
   "id": "232 ",
   "c": "Eritrea"
 }, {
   "id": "233 ",
   "c": "Estonia"
 }, {
   "id": "234 ",
   "c": "Faroe Islands"
 }, {
   "id": "238 ",
   "c": "Falkland Islands (Malvinas)"
 }, {
   "id": "239 ",
   "c": "South Georgia and the South Sandwich Islands"
 }, {
   "id": "242 ",
   "c": "Fiji"
 }, {
   "id": "246 ",
   "c": "Finland"
 }, {
   "id": "248 ",
   "c": "Åland Islands"
 }, {
   "id": "250 ",
   "c": "France"
 }, {
   "id": "254 ",
   "c": "French Guiana"
 }, {
   "id": "258 ",
   "c": "French Polynesia"
 }, {
   "id": "260 ",
   "c": "French Southern Territories"
 }, {
   "id": "262 ",
   "c": "Djibouti"
 }, {
   "id": "266 ",
   "c": "Gabon"
 }, {
   "id": "268 ",
   "c": "Georgia"
 }, {
   "id": "270 ",
   "c": "Gambia"
 }, {
   "id": "275 ",
   "c": "Palestine, State of"
 }, {
   "id": "276 ",
   "c": "Germany"
 }, {
   "id": "288 ",
   "c": "Ghana"
 }, {
   "id": "292 ",
   "c": "Gibraltar"
 }, {
   "id": "296 ",
   "c": "Kiribati"
 }, {
   "id": "300 ",
   "c": "Greece"
 }, {
   "id": "304 ",
   "c": "Greenland"
 }, {
   "id": "308 ",
   "c": "Grenada"
 }, {
   "id": "312 ",
   "c": "Guadeloupe"
 }, {
   "id": "316 ",
   "c": "Guam"
 }, {
   "id": "320 ",
   "c": "Guatemala"
 }, {
   "id": "324 ",
   "c": "Guinea"
 }, {
   "id": "328 ",
   "c": "Guyana"
 }, {
   "id": "332 ",
   "c": "Haiti"
 }, {
   "id": "334 ",
   "c": "Heard Island and McDonald Islands"
 }, {
   "id": "336 ",
   "c": "Holy See (Vatican City State)"
 }, {
   "id": "340 ",
   "c": "Honduras"
 }, {
   "id": "344 ",
   "c": "Hong Kong"
 }, {
   "id": "348 ",
   "c": "Hungary"
 }, {
   "id": "352 ",
   "c": "Iceland"
 }, {
   "id": "356 ",
   "c": "India"
 }, {
   "id": "360 ",
   "c": "Indonesia"
 }, {
   "id": "364 ",
   "c": "Iran, Islamic Republic of"
 }, {
   "id": "368 ",
   "c": "Iraq"
 }, {
   "id": "372 ",
   "c": "Ireland"
 }, {
   "id": "376 ",
   "c": "Israel"
 }, {
   "id": "380 ",
   "c": "Italy"
 }, {
   "id": "384 ",
   "c": "Côte d'Ivoire"
 }, {
   "id": "388 ",
   "c": "Jamaica"
 }, {
   "id": "392 ",
   "c": "Japan"
 }, {
   "id": "398 ",
   "c": "Kazakhstan"
 }, {
   "id": "400 ",
   "c": "Jordan"
 }, {
   "id": "404 ",
   "c": "Kenya"
 }, {
   "id": "408 ",
   "c": "Korea, Democratic People's Republic of"
 }, {
   "id": "410 ",
   "c": "Korea, Republic of"
 }, {
   "id": "414 ",
   "c": "Kuwait"
 }, {
   "id": "417 ",
   "c": "Kyrgyzstan"
 }, {
   "id": "418 ",
   "c": "Lao People's Democratic Republic"
 }, {
   "id": "422 ",
   "c": "Lebanon"
 }, {
   "id": "426 ",
   "c": "Lesotho"
 }, {
   "id": "428 ",
   "c": "Latvia"
 }, {
   "id": "430 ",
   "c": "Liberia"
 }, {
   "id": "434 ",
   "c": "Libya"
 }, {
   "id": "438 ",
   "c": "Liechtenstein"
 }, {
   "id": "440 ",
   "c": "Lithuania"
 }, {
   "id": "442 ",
   "c": "Luxembourg"
 }, {
   "id": "446 ",
   "c": "Macao"
 }, {
   "id": "450 ",
   "c": "Madagascar"
 }, {
   "id": "454 ",
   "c": "Malawi"
 }, {
   "id": "458 ",
   "c": "Malaysia"
 }, {
   "id": "462 ",
   "c": "Maldives"
 }, {
   "id": "466 ",
   "c": "Mali"
 }, {
   "id": "470 ",
   "c": "Malta"
 }, {
   "id": "474 ",
   "c": "Martinique"
 }, {
   "id": "478 ",
   "c": "Mauritania"
 }, {
   "id": "480 ",
   "c": "Mauritius"
 }, {
   "id": "484 ",
   "c": "Mexico"
 }, {
   "id": "492 ",
   "c": "Monaco"
 }, {
   "id": "496 ",
   "c": "Mongolia"
 }, {
   "id": "498 ",
   "c": "Moldova, Republic of"
 }, {
   "id": "499 ",
   "c": "Montenegro"
 }, {
   "id": "500 ",
   "c": "Montserrat"
 }, {
   "id": "504 ",
   "c": "Morocco"
 }, {
   "id": "508 ",
   "c": "Mozambique"
 }, {
   "id": "512 ",
   "c": "Oman"
 }, {
   "id": "516 ",
   "c": "Namibia"
 }, {
   "id": "520 ",
   "c": "Nauru"
 }, {
   "id": "524 ",
   "c": "Nepal"
 }, {
   "id": "528 ",
   "c": "Netherlands"
 }, {
   "id": "531 ",
   "c": "Curaçao"
 }, {
   "id": "533 ",
   "c": "Aruba"
 }, {
   "id": "534 ",
   "c": "Sint Maarten (Dutch part)"
 }, {
   "id": "535 ",
   "c": "Bonaire, Sint Eustatius and Saba"
 }, {
   "id": "540 ",
   "c": "New Caledonia"
 }, {
   "id": "548 ",
   "c": "Vanuatu"
 }, {
   "id": "554 ",
   "c": "New Zealand"
 }, {
   "id": "558 ",
   "c": "Nicaragua"
 }, {
   "id": "562 ",
   "c": "Niger"
 }, {
   "id": "566 ",
   "c": "Nigeria"
 }, {
   "id": "570 ",
   "c": "Niue"
 }, {
   "id": "574 ",
   "c": "Norfolk Island"
 }, {
   "id": "578 ",
   "c": "Norway"
 }, {
   "id": "580 ",
   "c": "Northern Mariana Islands"
 }, {
   "id": "581 ",
   "c": "United States Minor Outlying Islands"
 }, {
   "id": "583 ",
   "c": "Micronesia, Federated States of"
 }, {
   "id": "584 ",
   "c": "Marshall Islands"
 }, {
   "id": "585 ",
   "c": "Palau"
 }, {
   "id": "586 ",
   "c": "Pakistan"
 }, {
   "id": "591 ",
   "c": "Panama"
 }, {
   "id": "598 ",
   "c": "Papua New Guinea"
 }, {
   "id": "600 ",
   "c": "Paraguay"
 }, {
   "id": "604 ",
   "c": "Peru"
 }, {
   "id": "608 ",
   "c": "Philippines"
 }, {
   "id": "612 ",
   "c": "Pitcairn"
 }, {
   "id": "616 ",
   "c": "Poland"
 }, {
   "id": "620 ",
   "c": "Portugal"
 }, {
   "id": "624 ",
   "c": "Guinea-Bissau"
 }, {
   "id": "626 ",
   "c": "Timor-Leste"
 }, {
   "id": "630 ",
   "c": "Puerto Rico"
 }, {
   "id": "634 ",
   "c": "Qatar"
 }, {
   "id": "638 ",
   "c": "Réunion"
 }, {
   "id": "642 ",
   "c": "Romania"
 }, {
   "id": "643 ",
   "c": "Russian Federation"
 }, {
   "id": "646 ",
   "c": "Rwanda"
 }, {
   "id": "652 ",
   "c": "Saint Barthélemy"
 }, {
   "id": "654 ",
   "c": "Saint Helena, Ascension and Tristan da Cunha"
 }, {
   "id": "659 ",
   "c": "Saint Kitts and Nevis"
 }, {
   "id": "660 ",
   "c": "Anguilla"
 }, {
   "id": "662 ",
   "c": "Saint Lucia"
 }, {
   "id": "663 ",
   "c": "Saint Martin (French part)"
 }, {
   "id": "666 ",
   "c": "Saint Pierre and Miquelon"
 }, {
   "id": "670 ",
   "c": "Saint Vincent and the Grenadines"
 }, {
   "id": "674 ",
   "c": "San Marino"
 }, {
   "id": "678 ",
   "c": "Sao Tome and Principe"
 }, {
   "id": "682 ",
   "c": "Saudi Arabia"
 }, {
   "id": "686 ",
   "c": "Senegal"
 }, {
   "id": "688 ",
   "c": "Serbia"
 }, {
   "id": "690 ",
   "c": "Seychelles"
 }, {
   "id": "694 ",
   "c": "Sierra Leone"
 }, {
   "id": "702 ",
   "c": "Singapore"
 }, {
   "id": "703 ",
   "c": "Slovakia"
 }, {
   "id": "704 ",
   "c": "Viet Nam"
 }, {
   "id": "705 ",
   "c": "Slovenia"
 }, {
   "id": "706 ",
   "c": "Somalia"
 }, {
   "id": "710 ",
   "c": "South Africa"
 }, {
   "id": "716 ",
   "c": "Zimbabwe"
 }, {
   "id": "724 ",
   "c": "Spain"
 }, {
   "id": "728 ",
   "c": "South Sudan"
 }, {
   "id": "729 ",
   "c": "Sudan"
 }, {
   "id": "732 ",
   "c": "Western Sahara"
 }, {
   "id": "740 ",
   "c": "Suriname"
 }, {
   "id": "744 ",
   "c": "Svalbard and Jan Mayen"
 }, {
   "id": "748 ",
   "c": "Swaziland"
 }, {
   "id": "752 ",
   "c": "Sweden"
 }, {
   "id": "756 ",
   "c": "Switzerland"
 }, {
   "id": "760 ",
   "c": "Syrian Arab Republic"
 }, {
   "id": "762 ",
   "c": "Tajikistan"
 }, {
   "id": "764 ",
   "c": "Thailand"
 }, {
   "id": "768 ",
   "c": "Togo"
 }, {
   "id": "772 ",
   "c": "Tokelau"
 }, {
   "id": "776 ",
   "c": "Tonga"
 }, {
   "id": "780 ",
   "c": "Trinidad and Tobago"
 }, {
   "id": "784 ",
   "c": "United Arab Emirates"
 }, {
   "id": "788 ",
   "c": "Tunisia"
 }, {
   "id": "792 ",
   "c": "Turkey"
 }, {
   "id": "795 ",
   "c": "Turkmenistan"
 }, {
   "id": "796 ",
   "c": "Turks and Caicos Islands"
 }, {
   "id": "798 ",
   "c": "Tuvalu"
 }, {
   "id": "800 ",
   "c": "Uganda"
 }, {
   "id": "804 ",
   "c": "Ukraine"
 }, {
   "id": "807 ",
   "c": "Macedonia, the former Yugoslav Republic of"
 }, {
   "id": "818 ",
   "c": "Egypt"
 }, {
   "id": "826 ",
   "c": "United Kingdom"
 }, {
   "id": "831 ",
   "c": "Guernsey"
 }, {
   "id": "832 ",
   "c": "Jersey"
 }, {
   "id": "833 ",
   "c": "Isle of Man"
 }, {
   "id": "834 ",
   "c": "Tanzania, United Republic of"
 }, {
   "id": "840 ",
   "c": "United States of America"
 }, {
   "id": "850 ",
   "c": "Virgin Islands, U.S."
 }, {
   "id": "854 ",
   "c": "Burkina Faso"
 }, {
   "id": "858 ",
   "c": "Uruguay"
 }, {
   "id": "860 ",
   "c": "Uzbekistan"
 }, {
   "id": "862 ",
   "c": "Venezuela, Bolivarian Republic of"
 }, {
   "id": "876 ",
   "c": "Wallis and Futuna"
 }, {
   "id": "882 ",
   "c": "Samoa"
 }, {
   "id": "887 ",
   "c": "Yemen"
 }, {
   "id": "894 ",
   "c": "Zambia"
 }];

 var testCountryNameJSON = {
   "004": "Afghanistan",
   "008": "Albania",
   "010": "Antarctica",
   "012": "Algeria",
   "016": "American Samoa",
   "020": "Andorra",
   "024": "Angola",
   "028": "Antigua and Barbuda",
   "031": "Azerbaijan",
   "032": "Argentina",
   "036": "Australia",
   "040": "Austria",
   "044": "Bahamas",
   "048": "Bahrain",
   "050": "Bangladesh",
   "051": "Armenia",
   "052": "Barbados",
   "056": "Belgium",
   "060": "Bermuda",
   "064": "Bhutan",
   "068": "Bolivia, Plurinational State of",
   "070": "Bosnia and Herzegovina",
   "072": "Botswana",
   "074": "Bouvet Island",
   "076": "Brazil",
   "084": "Belize",
   "086": "British Indian Ocean Territory",
   "090": "Solomon Islands",
   "092": "Virgin Islands, British",
   "096": "Brunei Darussalam",
   "100": "Bulgaria",
   "104": "Myanmar",
   "108": "Burundi",
   "112": "Belarus",
   "116": "Cambodia",
   "120": "Cameroon",
   "124": "Canada",
   "132": "Cabo Verde",
   "136": "Cayman Islands",
   "140": "Central African Republic",
   "144": "Sri Lanka",
   "148": "Chad",
   "152": "Chile",
   "156": "China",
   "158": "Taiwan, Province of China",
   "162": "Christmas Island",
   "166": "Cocos (Keeling) Islands",
   "170": "Colombia",
   "174": "Comoros",
   "175": "Mayotte",
   "178": "Congo",
   "180": "Congo, the Democratic Republic of the",
   "184": "Cook Islands",
   "188": "Costa Rica",
   "191": "Croatia",
   "192": "Cuba",
   "196": "Cyprus",
   "203": "Czechia",
   "204": "Benin",
   "208": "Denmark",
   "212": "Dominica",
   "214": "Dominican Republic",
   "218": "Ecuador",
   "222": "El Salvador",
   "226": "Equatorial Guinea",
   "231": "Ethiopia",
   "232": "Eritrea",
   "233": "Estonia",
   "234": "Faroe Islands",
   "238": "Falkland Islands (Malvinas)",
   "239": "South Georgia and the South Sandwich Islands",
   "242": "Fiji",
   "246": "Finland",
   "248": "Åland Islands",
   "250": "France",
   "254": "French Guiana",
   "258": "French Polynesia",
   "260": "French Southern Territories",
   "262": "Djibouti",
   "266": "Gabon",
   "268": "Georgia",
   "270": "Gambia",
   "275": "Palestine, State of",
   "276": "Germany",
   "288": "Ghana",
   "292": "Gibraltar",
   "296": "Kiribati",
   "300": "Greece",
   "304": "Greenland",
   "308": "Grenada",
   "312": "Guadeloupe",
   "316": "Guam",
   "320": "Guatemala",
   "324": "Guinea",
   "328": "Guyana",
   "332": "Haiti",
   "334": "Heard Island and McDonald Islands",
   "336": "Holy See (Vatican City State)",
   "340": "Honduras",
   "344": "Hong Kong",
   "348": "Hungary",
   "352": "Iceland",
   "356": "India",
   "360": "Indonesia",
   "364": "Iran, Islamic Republic of",
   "368": "Iraq",
   "372": "Ireland",
   "376": "Israel",
   "380": "Italy",
   "384": "Côte d'Ivoire",
   "388": "Jamaica",
   "392": "Japan",
   "398": "Kazakhstan",
   "400": "Jordan",
   "404": "Kenya",
   "408": "Korea, Democratic People's Republic of",
   "410": "Korea, Republic of",
   "414": "Kuwait",
   "417": "Kyrgyzstan",
   "418": "Lao People's Democratic Republic",
   "422": "Lebanon",
   "426": "Lesotho",
   "428": "Latvia",
   "430": "Liberia",
   "434": "Libya",
   "438": "Liechtenstein",
   "440": "Lithuania",
   "442": "Luxembourg",
   "446": "Macao",
   "450": "Madagascar",
   "454": "Malawi",
   "458": "Malaysia",
   "462": "Maldives",
   "466": "Mali",
   "470": "Malta",
   "474": "Martinique",
   "478": "Mauritania",
   "480": "Mauritius",
   "484": "Mexico",
   "492": "Monaco",
   "496": "Mongolia",
   "498": "Moldova, Republic of",
   "499": "Montenegro",
   "500": "Montserrat",
   "504": "Morocco",
   "508": "Mozambique",
   "512": "Oman",
   "516": "Namibia",
   "520": "Nauru",
   "524": "Nepal",
   "528": "Netherlands",
   "531": "Curaçao",
   "533": "Aruba",
   "534": "Sint Maarten (Dutch part)",
   "535": "Bonaire, Sint Eustatius and Saba",
   "540": "New Caledonia",
   "548": "Vanuatu",
   "554": "New Zealand",
   "558": "Nicaragua",
   "562": "Niger",
   "566": "Nigeria",
   "570": "Niue",
   "574": "Norfolk Island",
   "578": "Norway",
   "580": "Northern Mariana Islands",
   "581": "United States Minor Outlying Islands",
   "583": "Micronesia, Federated States of",
   "584": "Marshall Islands",
   "585": "Palau",
   "586": "Pakistan",
   "591": "Panama",
   "598": "Papua New Guinea",
   "600": "Paraguay",
   "604": "Peru",
   "608": "Philippines",
   "612": "Pitcairn",
   "616": "Poland",
   "620": "Portugal",
   "624": "Guinea-Bissau",
   "626": "Timor-Leste",
   "630": "Puerto Rico",
   "634": "Qatar",
   "638": "Réunion",
   "642": "Romania",
   "643": "Russian Federation",
   "646": "Rwanda",
   "652": "Saint Barthélemy",
   "654": "Saint Helena, Ascension and Tristan da Cunha",
   "659": "Saint Kitts and Nevis",
   "660": "Anguilla",
   "662": "Saint Lucia",
   "663": "Saint Martin (French part)",
   "666": "Saint Pierre and Miquelon",
   "670": "Saint Vincent and the Grenadines",
   "674": "San Marino",
   "678": "Sao Tome and Principe",
   "682": "Saudi Arabia",
   "686": "Senegal",
   "688": "Serbia",
   "690": "Seychelles",
   "694": "Sierra Leone",
   "702": "Singapore",
   "703": "Slovakia",
   "704": "Viet Nam",
   "705": "Slovenia",
   "706": "Somalia",
   "710": "South Africa",
   "716": "Zimbabwe",
   "724": "Spain",
   "728": "South Sudan",
   "729": "Sudan",
   "732": "Western Sahara",
   "740": "Suriname",
   "744": "Svalbard and Jan Mayen",
   "748": "Swaziland",
   "752": "Sweden",
   "756": "Switzerland",
   "760": "Syrian Arab Republic",
   "762": "Tajikistan",
   "764": "Thailand",
   "768": "Togo",
   "772": "Tokelau",
   "776": "Tonga",
   "780": "Trinidad and Tobago",
   "784": "United Arab Emirates",
   "788": "Tunisia",
   "792": "Turkey",
   "795": "Turkmenistan",
   "796": "Turks and Caicos Islands",
   "798": "Tuvalu",
   "800": "Uganda",
   "804": "Ukraine",
   "807": "Macedonia, the former Yugoslav Republic of",
   "818": "Egypt",
   "826": "United Kingdom",
   "831": "Guernsey",
   "832": "Jersey",
   "833": "Isle of Man",
   "834": "Tanzania, United Republic of",
   "840": "United States of America",
   "850": "Virgin Islands, U.S.",
   "854": "Burkina Faso",
   "858": "Uruguay",
   "860": "Uzbekistan",
   "862": "Venezuela, Bolivarian Republic of",
   "876": "Wallis and Futuna",
   "882": "Samoa",
   "887": "Yemen",
   "894": "Zambia"
 }