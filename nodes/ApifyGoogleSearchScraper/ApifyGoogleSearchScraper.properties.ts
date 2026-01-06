import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	return {
		...defaultInput,
		// Search term(s) (queries)
		queries: context.getNodeParameter('queries', itemIndex),
		// Results per page (resultsPerPage)
		resultsPerPage: context.getNodeParameter('resultsPerPage', itemIndex),
		// Max pages per search (maxPagesPerQuery)
		maxPagesPerQuery: context.getNodeParameter('maxPagesPerQuery', itemIndex),
		// ⏩ Add-on: Google AI Mode (aiMode)
		aiMode: context.getNodeParameter('aiMode', itemIndex),
		// ⏩ Add-on: Perplexity AI search (perplexitySearch)
		...((() => {
			try {
				const rawValue = context.getNodeParameter("perplexitySearch", itemIndex);
				if (typeof rawValue === "string" && rawValue.trim() === "") {
					return { perplexitySearch: undefined };
				}
				return { perplexitySearch: typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue };
			} catch (error) {
				throw new Error(`Invalid JSON in parameter "perplexitySearch": ${(error as Error).message}`);
			}
		})()),
		// ⏩ Add-on: Extract business leads information - Maximum leads per domain (maximumLeadsEnrichmentRecords)
		maximumLeadsEnrichmentRecords: context.getNodeParameter('maximumLeadsEnrichmentRecords', itemIndex),
		// Leads departments selection (leadsEnrichmentDepartments)
		leadsEnrichmentDepartments: context.getNodeParameter('leadsEnrichmentDepartments', itemIndex),
		// Add-on: Enable paid results (ads) extraction (focusOnPaidAds)
		focusOnPaidAds: context.getNodeParameter('focusOnPaidAds', itemIndex),
		// Country (countryCode)
		countryCode: context.getNodeParameter('countryCode', itemIndex),
		// Search language (searchLanguage)
		searchLanguage: context.getNodeParameter('searchLanguage', itemIndex),
		// Interface Language (languageCode)
		languageCode: context.getNodeParameter('languageCode', itemIndex),
		// Exact location (Google UULE parameter) (locationUule)
		...((() => {
			const value = context.getNodeParameter('locationUule', itemIndex);
			return (value !== undefined && value !== null && value !== '') ? { locationUule: value } : {};
		})()),
		// Force exact match (forceExactMatch)
		forceExactMatch: context.getNodeParameter('forceExactMatch', itemIndex),
		// Site (site)
		...((() => {
			const value = context.getNodeParameter('site', itemIndex);
			return (value !== undefined && value !== null && value !== '') ? { site: value } : {};
		})()),
		// Related to site (relatedToSite)
		...((() => {
			const value = context.getNodeParameter('relatedToSite', itemIndex);
			return (value !== undefined && value !== null && value !== '') ? { relatedToSite: value } : {};
		})()),
		// Words in title (wordsInTitle)
		...((() => {
			const wordsInTitle = context.getNodeParameter('wordsInTitle', itemIndex, {}) as { values?: { value: string }[] };
			return wordsInTitle?.values?.length ? { wordsInTitle: wordsInTitle.values.map(e => e.value) } : {};
		})()),
		// Words in text (wordsInText)
		...((() => {
			const wordsInText = context.getNodeParameter('wordsInText', itemIndex, {}) as { values?: { value: string }[] };
			return wordsInText?.values?.length ? { wordsInText: wordsInText.values.map(e => e.value) } : {};
		})()),
		// Words in URL (wordsInUrl)
		...((() => {
			const wordsInUrl = context.getNodeParameter('wordsInUrl', itemIndex, {}) as { values?: { value: string }[] };
			return wordsInUrl?.values?.length ? { wordsInUrl: wordsInUrl.values.map(e => e.value) } : {};
		})()),
		// Quick date range (quickDateRange)
		...((() => {
			const value = context.getNodeParameter('quickDateRange', itemIndex);
			return (value !== undefined && value !== null && value !== '') ? { quickDateRange: value } : {};
		})()),
		// Before date (beforeDate)
		...((() => {
			const value = context.getNodeParameter('beforeDate', itemIndex);
			return (value !== undefined && value !== null && value !== '') ? { beforeDate: value } : {};
		})()),
		// After date (afterDate)
		...((() => {
			const value = context.getNodeParameter('afterDate', itemIndex);
			return (value !== undefined && value !== null && value !== '') ? { afterDate: value } : {};
		})()),
		// File types (fileTypes)
		fileTypes: context.getNodeParameter('fileTypes', itemIndex),
		// Mobile results (mobileResults)
		mobileResults: context.getNodeParameter('mobileResults', itemIndex),
		// Unfiltered results (includeUnfilteredResults)
		includeUnfilteredResults: context.getNodeParameter('includeUnfilteredResults', itemIndex),
		// Save HTML to dataset (saveHtml)
		saveHtml: context.getNodeParameter('saveHtml', itemIndex),
		// Save HTML to key-value store (saveHtmlToKeyValueStore)
		saveHtmlToKeyValueStore: context.getNodeParameter('saveHtmlToKeyValueStore', itemIndex),
		// Include icon image data (base64) (includeIcons)
		includeIcons: context.getNodeParameter('includeIcons', itemIndex),
	};
}

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const actorProperties: INodeProperties[] = [
  {
    "displayName": "Search term(s)",
    "name": "queries",
    "description": "Use regular search words or enter Google Search URLs. You can also apply [advanced Google search techniques](https://blog.apify.com/how-to-scrape-google-like-a-pro/), such as <code>AI site:twitter.com</code> or <code>javascript OR python</code>. You can also define selected search filters as separate fields below (in the <code>Advanced search filters</code> section). Just ensure that your queries do not exceed 32 words to comply with Google Search limits.",
    "required": true,
    "default": "javascript\ntypescript\npython",
    "type": "string",
    "typeOptions": {
      "rows": 5
    }
  },
  {
    "displayName": "Results per page",
    "name": "resultsPerPage",
    "description": "Specifies the desired number of results per page that is passed to Google Search as the `num` parameter. However, Google applies its own internal filtering and quality checks, so the actual number of returned results may differ from this value, especially on the first page. To potentially retrieve more results closer to your desired count, consider enabling the \"Unfiltered results\" option from the \"Additional settings\" section below, which includes results that Google normally filters out.",
    "required": false,
    "default": 0,
    "type": "number",
    "typeOptions": {
      "minValue": 1,
      "maxValue": 100
    }
  },
  {
    "displayName": "Max pages per search",
    "name": "maxPagesPerQuery",
    "description": "",
    "required": false,
    "default": 0,
    "type": "number",
    "typeOptions": {
      "minValue": 1
    }
  },
  {
    "displayName": "⏩ Add-on: Google AI Mode",
    "name": "aiMode",
    "description": "Enable scraping of Google's AI Mode to perform Answer Engine Optimization (AEO), GEO targeting, track brand visibility, and analyze competitors.",
    "required": false,
    "default": "aiModeOff",
    "type": "options",
    "options": [
      {
        "name": "AI Mode off",
        "value": "aiModeOff"
      },
      {
        "name": "AI Mode + Search Results",
        "value": "aiModeWithSearchResults"
      },
      {
        "name": "AI Mode only",
        "value": "aiModeOnly"
      }
    ]
  },
  {
    "displayName": "⏩ Add-on: Perplexity AI search",
    "name": "perplexitySearch",
    "description": "Enable Perplexity to retrieve AI-generated answers and citations using the Sonar model. This feature is designed for cross-platform analysis, allowing you to directly compare Google AI Mode results against Perplexity’s perspective to identify narrative differences and coverage gaps. Note: An additional fee applies per result when this feature is active. Please refer to the Pricing tab for your specific rate.",
    "required": false,
    "default": "{\"enablePerplexity\":false,\"returnImages\":false,\"returnRelatedQuestions\":false}",
    "type": "json"
  },
  {
    "displayName": "⏩ Add-on: Extract business leads information - Maximum leads per domain",
    "name": "maximumLeadsEnrichmentRecords",
    "description": "Enrich your results with detailed contact and company information, including employee names, job titles, emails, phone numbers, LinkedIn profiles, and key company data like industry and number of employees. <br><br> This setting allows you to set the maximum number of leads records you want to scrape per each domain found. By default, it's set to 0 which means that no leads information will be scraped. <br><br>⚠️ Note that some of the fields contain <b>personal data</b>. GDPR protects personal data in the European Union and by other regulations around the world. You should not scrape personal data unless you have a legitimate reason to do so. If you're unsure whether your use case is legitimate, please consult an attorney. <br><br>To keep your leads relevant, we automatically filter out large chains and online platforms (e.g., social media, retail giants, food delivery services). <br><br>⚠️ <b>Cost warning:</b> This is a multiplier. Requesting 10 leads for 1,000 domains will attempt to find 10,000 total leads. You are only charged for leads successfully found.",
    "required": false,
    "default": 0,
    "type": "number",
    "typeOptions": {}
  },
  {
    "displayName": "Leads departments selection",
    "name": "leadsEnrichmentDepartments",
    "description": "You can use this filter to include only specific departments (like Sales, Marketing, or C-Suite). Note: This will only work if the ⏩ Add-on: Extract business leads information - Maximum leads per domain (maximumLeadsEnrichmentRecords) option is enabled. Please note that some job titles are sometimes miscategorized in the wrong departments.",
    "required": false,
    "default": [],
    "type": "multiOptions",
    "options": [
      {
        "name": "C-Suite",
        "value": "c_suite"
      },
      {
        "name": "Product",
        "value": "product"
      },
      {
        "name": "Engineering & Technical",
        "value": "engineering_technical"
      },
      {
        "name": "Design",
        "value": "design"
      },
      {
        "name": "Education",
        "value": "education"
      },
      {
        "name": "Finance",
        "value": "finance"
      },
      {
        "name": "Human Resources",
        "value": "human_resources"
      },
      {
        "name": "Information Technology",
        "value": "information_technology"
      },
      {
        "name": "Legal",
        "value": "legal"
      },
      {
        "name": "Marketing",
        "value": "marketing"
      },
      {
        "name": "Medical & Health",
        "value": "medical_health"
      },
      {
        "name": "Operations",
        "value": "operations"
      },
      {
        "name": "Sales",
        "value": "sales"
      },
      {
        "name": "Consulting",
        "value": "consulting"
      }
    ]
  },
  {
    "displayName": "Add-on: Enable paid results (ads) extraction",
    "name": "focusOnPaidAds",
    "description": "Enable extraction of paid results (Google Ads). This feature improves ad detection accuracy by using an ad-specialized proxy to perform up to 3 retries for each search query. Best used for queries likely to show ads. An extra cost per search page applies when enabled, regardless of ads found. Pricing depends on your Apify subscription plan.",
    "required": false,
    "default": false,
    "type": "boolean"
  },
  {
    "displayName": "Country",
    "name": "countryCode",
    "description": "Specifies the country used for the search and the Google Search domain (e.g. <code>google.es</code> for Spain). By default, the actor uses United States (<code>google.com</code>).",
    "required": false,
    "default": "",
    "type": "options",
    "options": [
      {
        "name": "Default (United States)",
        "value": ""
      },
      {
        "name": "Afghanistan",
        "value": "af"
      },
      {
        "name": "Albania",
        "value": "al"
      },
      {
        "name": "Algeria",
        "value": "dz"
      },
      {
        "name": "American Samoa",
        "value": "as"
      },
      {
        "name": "Andorra",
        "value": "ad"
      },
      {
        "name": "Angola",
        "value": "ao"
      },
      {
        "name": "Anguilla",
        "value": "ai"
      },
      {
        "name": "Antarctica",
        "value": "aq"
      },
      {
        "name": "Antigua and Barbuda",
        "value": "ag"
      },
      {
        "name": "Argentina",
        "value": "ar"
      },
      {
        "name": "Armenia",
        "value": "am"
      },
      {
        "name": "Aruba",
        "value": "aw"
      },
      {
        "name": "Australia",
        "value": "au"
      },
      {
        "name": "Austria",
        "value": "at"
      },
      {
        "name": "Azerbaijan",
        "value": "az"
      },
      {
        "name": "Bahamas",
        "value": "bs"
      },
      {
        "name": "Bahrain",
        "value": "bh"
      },
      {
        "name": "Bangladesh",
        "value": "bd"
      },
      {
        "name": "Barbados",
        "value": "bb"
      },
      {
        "name": "Belarus",
        "value": "by"
      },
      {
        "name": "Belgium",
        "value": "be"
      },
      {
        "name": "Belize",
        "value": "bz"
      },
      {
        "name": "Benin",
        "value": "bj"
      },
      {
        "name": "Bermuda",
        "value": "bm"
      },
      {
        "name": "Bhutan",
        "value": "bt"
      },
      {
        "name": "Bolivia",
        "value": "bo"
      },
      {
        "name": "Bosnia and Herzegovina",
        "value": "ba"
      },
      {
        "name": "Botswana",
        "value": "bw"
      },
      {
        "name": "Bouvet Island",
        "value": "bv"
      },
      {
        "name": "Brazil",
        "value": "br"
      },
      {
        "name": "British Indian Ocean Territory",
        "value": "io"
      },
      {
        "name": "Brunei Darussalam",
        "value": "bn"
      },
      {
        "name": "Bulgaria",
        "value": "bg"
      },
      {
        "name": "Burkina Faso",
        "value": "bf"
      },
      {
        "name": "Burundi",
        "value": "bi"
      },
      {
        "name": "Cambodia",
        "value": "kh"
      },
      {
        "name": "Cameroon",
        "value": "cm"
      },
      {
        "name": "Canada",
        "value": "ca"
      },
      {
        "name": "Cape Verde",
        "value": "cv"
      },
      {
        "name": "Cayman Islands",
        "value": "ky"
      },
      {
        "name": "Central African Republic",
        "value": "cf"
      },
      {
        "name": "Chad",
        "value": "td"
      },
      {
        "name": "Chile",
        "value": "cl"
      },
      {
        "name": "China",
        "value": "cn"
      },
      {
        "name": "Christmas Island",
        "value": "cx"
      },
      {
        "name": "Cocos (Keeling) Islands",
        "value": "cc"
      },
      {
        "name": "Colombia",
        "value": "co"
      },
      {
        "name": "Comoros",
        "value": "km"
      },
      {
        "name": "Congo",
        "value": "cg"
      },
      {
        "name": "Congo, the Democratic Republic of the",
        "value": "cd"
      },
      {
        "name": "Cook Islands",
        "value": "ck"
      },
      {
        "name": "Costa Rica",
        "value": "cr"
      },
      {
        "name": "Cote D'ivoire",
        "value": "ci"
      },
      {
        "name": "Croatia",
        "value": "hr"
      },
      {
        "name": "Cuba",
        "value": "cu"
      },
      {
        "name": "Cyprus",
        "value": "cy"
      },
      {
        "name": "Czech Republic",
        "value": "cz"
      },
      {
        "name": "Denmark",
        "value": "dk"
      },
      {
        "name": "Djibouti",
        "value": "dj"
      },
      {
        "name": "Dominica",
        "value": "dm"
      },
      {
        "name": "Dominican Republic",
        "value": "do"
      },
      {
        "name": "Ecuador",
        "value": "ec"
      },
      {
        "name": "Egypt",
        "value": "eg"
      },
      {
        "name": "El Salvador",
        "value": "sv"
      },
      {
        "name": "Equatorial Guinea",
        "value": "gq"
      },
      {
        "name": "Eritrea",
        "value": "er"
      },
      {
        "name": "Estonia",
        "value": "ee"
      },
      {
        "name": "Ethiopia",
        "value": "et"
      },
      {
        "name": "Falkland Islands (Malvinas)",
        "value": "fk"
      },
      {
        "name": "Faroe Islands",
        "value": "fo"
      },
      {
        "name": "Fiji",
        "value": "fj"
      },
      {
        "name": "Finland",
        "value": "fi"
      },
      {
        "name": "France",
        "value": "fr"
      },
      {
        "name": "French Guiana",
        "value": "gf"
      },
      {
        "name": "French Polynesia",
        "value": "pf"
      },
      {
        "name": "French Southern Territories",
        "value": "tf"
      },
      {
        "name": "Gabon",
        "value": "ga"
      },
      {
        "name": "Gambia",
        "value": "gm"
      },
      {
        "name": "Georgia",
        "value": "ge"
      },
      {
        "name": "Germany",
        "value": "de"
      },
      {
        "name": "Ghana",
        "value": "gh"
      },
      {
        "name": "Gibraltar",
        "value": "gi"
      },
      {
        "name": "Greece",
        "value": "gr"
      },
      {
        "name": "Greenland",
        "value": "gl"
      },
      {
        "name": "Grenada",
        "value": "gd"
      },
      {
        "name": "Guadeloupe",
        "value": "gp"
      },
      {
        "name": "Guam",
        "value": "gu"
      },
      {
        "name": "Guatemala",
        "value": "gt"
      },
      {
        "name": "Guinea",
        "value": "gn"
      },
      {
        "name": "Guinea-Bissau",
        "value": "gw"
      },
      {
        "name": "Guyana",
        "value": "gy"
      },
      {
        "name": "Haiti",
        "value": "ht"
      },
      {
        "name": "Heard Island and Mcdonald Islands",
        "value": "hm"
      },
      {
        "name": "Holy See (Vatican City State)",
        "value": "va"
      },
      {
        "name": "Honduras",
        "value": "hn"
      },
      {
        "name": "Hong Kong",
        "value": "hk"
      },
      {
        "name": "Hungary",
        "value": "hu"
      },
      {
        "name": "Iceland",
        "value": "is"
      },
      {
        "name": "India",
        "value": "in"
      },
      {
        "name": "Indonesia",
        "value": "id"
      },
      {
        "name": "Iran, Islamic Republic of",
        "value": "ir"
      },
      {
        "name": "Iraq",
        "value": "iq"
      },
      {
        "name": "Ireland",
        "value": "ie"
      },
      {
        "name": "Israel",
        "value": "il"
      },
      {
        "name": "Italy",
        "value": "it"
      },
      {
        "name": "Jamaica",
        "value": "jm"
      },
      {
        "name": "Japan",
        "value": "jp"
      },
      {
        "name": "Jordan",
        "value": "jo"
      },
      {
        "name": "Kazakhstan",
        "value": "kz"
      },
      {
        "name": "Kenya",
        "value": "ke"
      },
      {
        "name": "Kiribati",
        "value": "ki"
      },
      {
        "name": "Korea, Democratic People's Republic of",
        "value": "kp"
      },
      {
        "name": "Korea, Republic of",
        "value": "kr"
      },
      {
        "name": "Kuwait",
        "value": "kw"
      },
      {
        "name": "Kyrgyzstan",
        "value": "kg"
      },
      {
        "name": "Lao People's Democratic Republic",
        "value": "la"
      },
      {
        "name": "Latvia",
        "value": "lv"
      },
      {
        "name": "Lebanon",
        "value": "lb"
      },
      {
        "name": "Lesotho",
        "value": "ls"
      },
      {
        "name": "Liberia",
        "value": "lr"
      },
      {
        "name": "Libyan Arab Jamahiriya",
        "value": "ly"
      },
      {
        "name": "Liechtenstein",
        "value": "li"
      },
      {
        "name": "Lithuania",
        "value": "lt"
      },
      {
        "name": "Luxembourg",
        "value": "lu"
      },
      {
        "name": "Macao",
        "value": "mo"
      },
      {
        "name": "Macedonia, the Former Yugoslav Republic of",
        "value": "mk"
      },
      {
        "name": "Madagascar",
        "value": "mg"
      },
      {
        "name": "Malawi",
        "value": "mw"
      },
      {
        "name": "Malaysia",
        "value": "my"
      },
      {
        "name": "Maldives",
        "value": "mv"
      },
      {
        "name": "Mali",
        "value": "ml"
      },
      {
        "name": "Malta",
        "value": "mt"
      },
      {
        "name": "Marshall Islands",
        "value": "mh"
      },
      {
        "name": "Martinique",
        "value": "mq"
      },
      {
        "name": "Mauritania",
        "value": "mr"
      },
      {
        "name": "Mauritius",
        "value": "mu"
      },
      {
        "name": "Mayotte",
        "value": "yt"
      },
      {
        "name": "Mexico",
        "value": "mx"
      },
      {
        "name": "Micronesia, Federated States of",
        "value": "fm"
      },
      {
        "name": "Moldova, Republic of",
        "value": "md"
      },
      {
        "name": "Monaco",
        "value": "mc"
      },
      {
        "name": "Mongolia",
        "value": "mn"
      },
      {
        "name": "Montserrat",
        "value": "ms"
      },
      {
        "name": "Morocco",
        "value": "ma"
      },
      {
        "name": "Mozambique",
        "value": "mz"
      },
      {
        "name": "Myanmar",
        "value": "mm"
      },
      {
        "name": "Namibia",
        "value": "na"
      },
      {
        "name": "Nauru",
        "value": "nr"
      },
      {
        "name": "Nepal",
        "value": "np"
      },
      {
        "name": "Netherlands",
        "value": "nl"
      },
      {
        "name": "Netherlands Antilles",
        "value": "an"
      },
      {
        "name": "New Caledonia",
        "value": "nc"
      },
      {
        "name": "New Zealand",
        "value": "nz"
      },
      {
        "name": "Nicaragua",
        "value": "ni"
      },
      {
        "name": "Niger",
        "value": "ne"
      },
      {
        "name": "Nigeria",
        "value": "ng"
      },
      {
        "name": "Niue",
        "value": "nu"
      },
      {
        "name": "Norfolk Island",
        "value": "nf"
      },
      {
        "name": "Northern Mariana Islands",
        "value": "mp"
      },
      {
        "name": "Norway",
        "value": "no"
      },
      {
        "name": "Oman",
        "value": "om"
      },
      {
        "name": "Pakistan",
        "value": "pk"
      },
      {
        "name": "Palau",
        "value": "pw"
      },
      {
        "name": "Palestinian Territory, Occupied",
        "value": "ps"
      },
      {
        "name": "Panama",
        "value": "pa"
      },
      {
        "name": "Papua New Guinea",
        "value": "pg"
      },
      {
        "name": "Paraguay",
        "value": "py"
      },
      {
        "name": "Peru",
        "value": "pe"
      },
      {
        "name": "Philippines",
        "value": "ph"
      },
      {
        "name": "Pitcairn",
        "value": "pn"
      },
      {
        "name": "Poland",
        "value": "pl"
      },
      {
        "name": "Portugal",
        "value": "pt"
      },
      {
        "name": "Puerto Rico",
        "value": "pr"
      },
      {
        "name": "Qatar",
        "value": "qa"
      },
      {
        "name": "Reunion",
        "value": "re"
      },
      {
        "name": "Romania",
        "value": "ro"
      },
      {
        "name": "Russian Federation",
        "value": "ru"
      },
      {
        "name": "Rwanda",
        "value": "rw"
      },
      {
        "name": "Saint Helena",
        "value": "sh"
      },
      {
        "name": "Saint Kitts and Nevis",
        "value": "kn"
      },
      {
        "name": "Saint Lucia",
        "value": "lc"
      },
      {
        "name": "Saint Pierre and Miquelon",
        "value": "pm"
      },
      {
        "name": "Saint Vincent and the Grenadines",
        "value": "vc"
      },
      {
        "name": "Samoa",
        "value": "ws"
      },
      {
        "name": "San Marino",
        "value": "sm"
      },
      {
        "name": "Sao Tome and Principe",
        "value": "st"
      },
      {
        "name": "Saudi Arabia",
        "value": "sa"
      },
      {
        "name": "Senegal",
        "value": "sn"
      },
      {
        "name": "Serbia and Montenegro",
        "value": "cs"
      },
      {
        "name": "Seychelles",
        "value": "sc"
      },
      {
        "name": "Sierra Leone",
        "value": "sl"
      },
      {
        "name": "Singapore",
        "value": "sg"
      },
      {
        "name": "Slovakia",
        "value": "sk"
      },
      {
        "name": "Slovenia",
        "value": "si"
      },
      {
        "name": "Solomon Islands",
        "value": "sb"
      },
      {
        "name": "Somalia",
        "value": "so"
      },
      {
        "name": "South Africa",
        "value": "za"
      },
      {
        "name": "South Georgia and the South Sandwich Islands",
        "value": "gs"
      },
      {
        "name": "Spain",
        "value": "es"
      },
      {
        "name": "Sri Lanka",
        "value": "lk"
      },
      {
        "name": "Sudan",
        "value": "sd"
      },
      {
        "name": "Suriname",
        "value": "sr"
      },
      {
        "name": "Svalbard and Jan Mayen",
        "value": "sj"
      },
      {
        "name": "Swaziland",
        "value": "sz"
      },
      {
        "name": "Sweden",
        "value": "se"
      },
      {
        "name": "Switzerland",
        "value": "ch"
      },
      {
        "name": "Syrian Arab Republic",
        "value": "sy"
      },
      {
        "name": "Taiwan, Province of China",
        "value": "tw"
      },
      {
        "name": "Tajikistan",
        "value": "tj"
      },
      {
        "name": "Tanzania, United Republic of",
        "value": "tz"
      },
      {
        "name": "Thailand",
        "value": "th"
      },
      {
        "name": "Timor-Leste",
        "value": "tl"
      },
      {
        "name": "Togo",
        "value": "tg"
      },
      {
        "name": "Tokelau",
        "value": "tk"
      },
      {
        "name": "Tonga",
        "value": "to"
      },
      {
        "name": "Trinidad and Tobago",
        "value": "tt"
      },
      {
        "name": "Tunisia",
        "value": "tn"
      },
      {
        "name": "Turkey",
        "value": "tr"
      },
      {
        "name": "Turkmenistan",
        "value": "tm"
      },
      {
        "name": "Turks and Caicos Islands",
        "value": "tc"
      },
      {
        "name": "Tuvalu",
        "value": "tv"
      },
      {
        "name": "Uganda",
        "value": "ug"
      },
      {
        "name": "Ukraine",
        "value": "ua"
      },
      {
        "name": "United Arab Emirates",
        "value": "ae"
      },
      {
        "name": "United Kingdom",
        "value": "gb"
      },
      {
        "name": "United States",
        "value": "us"
      },
      {
        "name": "United States Minor Outlying Islands",
        "value": "um"
      },
      {
        "name": "Uruguay",
        "value": "uy"
      },
      {
        "name": "Uzbekistan",
        "value": "uz"
      },
      {
        "name": "Vanuatu",
        "value": "vu"
      },
      {
        "name": "Venezuela",
        "value": "ve"
      },
      {
        "name": "Viet Nam",
        "value": "vn"
      },
      {
        "name": "Virgin Islands, British",
        "value": "vg"
      },
      {
        "name": "Virgin Islands, U.S.",
        "value": "vi"
      },
      {
        "name": "Wallis and Futuna",
        "value": "wf"
      },
      {
        "name": "Western Sahara",
        "value": "eh"
      },
      {
        "name": "Yemen",
        "value": "ye"
      },
      {
        "name": "Zambia",
        "value": "zm"
      },
      {
        "name": "Zimbabwe",
        "value": "zw"
      }
    ]
  },
  {
    "displayName": "Search language",
    "name": "searchLanguage",
    "description": "Restricts search results to pages in a specific language. For example, choosing 'German' results in pages only in German. Passed to Google Search as the <code>lr</code> URL query parameter. <a href='https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list' target='_blank'>Read more here</a>.",
    "required": false,
    "default": "",
    "type": "options",
    "options": [
      {
        "name": "Default",
        "value": ""
      },
      {
        "name": "Arabic",
        "value": "ar"
      },
      {
        "name": "Bulgarian",
        "value": "bg"
      },
      {
        "name": "Catalan",
        "value": "ca"
      },
      {
        "name": "Czech",
        "value": "cs"
      },
      {
        "name": "Danish",
        "value": "da"
      },
      {
        "name": "German",
        "value": "de"
      },
      {
        "name": "Greek",
        "value": "el"
      },
      {
        "name": "English",
        "value": "en"
      },
      {
        "name": "Spanish",
        "value": "es"
      },
      {
        "name": "Estonian",
        "value": "et"
      },
      {
        "name": "Finnish",
        "value": "fi"
      },
      {
        "name": "French",
        "value": "fr"
      },
      {
        "name": "Croatian",
        "value": "hr"
      },
      {
        "name": "Hungarian",
        "value": "hu"
      },
      {
        "name": "Indonesian",
        "value": "id"
      },
      {
        "name": "Icelandic",
        "value": "is"
      },
      {
        "name": "Italian",
        "value": "it"
      },
      {
        "name": "Hebrew",
        "value": "iw"
      },
      {
        "name": "Japanese",
        "value": "ja"
      },
      {
        "name": "Korean",
        "value": "ko"
      },
      {
        "name": "Lithuanian",
        "value": "lt"
      },
      {
        "name": "Latvian",
        "value": "lv"
      },
      {
        "name": "Dutch",
        "value": "nl"
      },
      {
        "name": "Norwegian",
        "value": "no"
      },
      {
        "name": "Polish",
        "value": "pl"
      },
      {
        "name": "Portuguese",
        "value": "pt"
      },
      {
        "name": "Romanian",
        "value": "ro"
      },
      {
        "name": "Russian",
        "value": "ru"
      },
      {
        "name": "Slovak",
        "value": "sk"
      },
      {
        "name": "Slovenian",
        "value": "sl"
      },
      {
        "name": "Serbian",
        "value": "sr"
      },
      {
        "name": "Swedish",
        "value": "sv"
      },
      {
        "name": "Turkish",
        "value": "tr"
      },
      {
        "name": "Chinese (Simplified)",
        "value": "zh-CN"
      },
      {
        "name": "Chinese (Traditional)",
        "value": "zh-TW"
      }
    ]
  },
  {
    "displayName": "Interface Language",
    "name": "languageCode",
    "description": "Language of the Google Search interface (menus, buttons, etc. - not the search results themselves). Passed to Google Search as the <code>hl</code> URL query parameter. From Google Reference: You can use the <code>hl</code> request parameter to identify the language of your graphical interface. The <code>hl</code> parameter value may affect search results, especially on international queries when language restriction (using the <code>lr</code> parameter) is not explicitly specified. <a href='https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list' target='_blank'>Read more here</a>.",
    "required": false,
    "default": "",
    "type": "options",
    "options": [
      {
        "name": "Same as country",
        "value": ""
      },
      {
        "name": "Afrikaans",
        "value": "af"
      },
      {
        "name": "Albanian",
        "value": "sq"
      },
      {
        "name": "Amharic",
        "value": "sm"
      },
      {
        "name": "Arabic",
        "value": "ar"
      },
      {
        "name": "Azerbaijani",
        "value": "az"
      },
      {
        "name": "Basque",
        "value": "eu"
      },
      {
        "name": "Belarusian",
        "value": "be"
      },
      {
        "name": "Bengali",
        "value": "bn"
      },
      {
        "name": "Bihari",
        "value": "bh"
      },
      {
        "name": "Bosnian",
        "value": "bs"
      },
      {
        "name": "Bulgarian",
        "value": "bg"
      },
      {
        "name": "Catalan",
        "value": "ca"
      },
      {
        "name": "Chinese (Simplified)",
        "value": "zh-CN"
      },
      {
        "name": "Chinese (Traditional)",
        "value": "zh-TW"
      },
      {
        "name": "Croatian",
        "value": "hr"
      },
      {
        "name": "Czech",
        "value": "cs"
      },
      {
        "name": "Danish",
        "value": "da"
      },
      {
        "name": "Dutch",
        "value": "nl"
      },
      {
        "name": "English",
        "value": "en"
      },
      {
        "name": "Esperanto",
        "value": "eo"
      },
      {
        "name": "Estonian",
        "value": "et"
      },
      {
        "name": "Faroese",
        "value": "fo"
      },
      {
        "name": "Finnish",
        "value": "fi"
      },
      {
        "name": "French",
        "value": "fr"
      },
      {
        "name": "Frisian",
        "value": "fy"
      },
      {
        "name": "Galician",
        "value": "gl"
      },
      {
        "name": "Georgian",
        "value": "ka"
      },
      {
        "name": "German",
        "value": "de"
      },
      {
        "name": "Greek",
        "value": "el"
      },
      {
        "name": "Gujarati",
        "value": "gu"
      },
      {
        "name": "Hebrew",
        "value": "iw"
      },
      {
        "name": "Hindi",
        "value": "hi"
      },
      {
        "name": "Hungarian",
        "value": "hu"
      },
      {
        "name": "Icelandic",
        "value": "is"
      },
      {
        "name": "Indonesian",
        "value": "id"
      },
      {
        "name": "Interlingua",
        "value": "ia"
      },
      {
        "name": "Irish",
        "value": "ga"
      },
      {
        "name": "Italian",
        "value": "it"
      },
      {
        "name": "Japanese",
        "value": "ja"
      },
      {
        "name": "Javanese",
        "value": "jw"
      },
      {
        "name": "Kannada",
        "value": "kn"
      },
      {
        "name": "Korean",
        "value": "ko"
      },
      {
        "name": "Latin",
        "value": "la"
      },
      {
        "name": "Latvian",
        "value": "lv"
      },
      {
        "name": "Lithuanian",
        "value": "lt"
      },
      {
        "name": "Macedonian",
        "value": "mk"
      },
      {
        "name": "Malay",
        "value": "ms"
      },
      {
        "name": "Malayam",
        "value": "ml"
      },
      {
        "name": "Maltese",
        "value": "mt"
      },
      {
        "name": "Marathi",
        "value": "mr"
      },
      {
        "name": "Nepali",
        "value": "ne"
      },
      {
        "name": "Norwegian",
        "value": "no"
      },
      {
        "name": "Norwegian (Nynorsk)",
        "value": "nn"
      },
      {
        "name": "Occitan",
        "value": "oc"
      },
      {
        "name": "Persian",
        "value": "fa"
      },
      {
        "name": "Polish",
        "value": "pl"
      },
      {
        "name": "Portuguese (Brazil)",
        "value": "pt-BR"
      },
      {
        "name": "Portuguese (Portugal)",
        "value": "pt-PT"
      },
      {
        "name": "Punjabi",
        "value": "pa"
      },
      {
        "name": "Romanian",
        "value": "ro"
      },
      {
        "name": "Russian",
        "value": "ru"
      },
      {
        "name": "Scots Gaelic",
        "value": "gd"
      },
      {
        "name": "Serbian",
        "value": "sr"
      },
      {
        "name": "Sinhalese",
        "value": "si"
      },
      {
        "name": "Slovak",
        "value": "sk"
      },
      {
        "name": "Slovenian",
        "value": "sl"
      },
      {
        "name": "Spanish",
        "value": "es"
      },
      {
        "name": "Sudanese",
        "value": "su"
      },
      {
        "name": "Swahili",
        "value": "sw"
      },
      {
        "name": "Swedish",
        "value": "sv"
      },
      {
        "name": "Tagalog",
        "value": "tl"
      },
      {
        "name": "Tamil",
        "value": "ta"
      },
      {
        "name": "Telugu",
        "value": "te"
      },
      {
        "name": "Thai",
        "value": "th"
      },
      {
        "name": "Tigrinya",
        "value": "ti"
      },
      {
        "name": "Turkish",
        "value": "tr"
      },
      {
        "name": "Ukrainian",
        "value": "uk"
      },
      {
        "name": "Urdu",
        "value": "ur"
      },
      {
        "name": "Uzbek",
        "value": "uz"
      },
      {
        "name": "Vietnamese",
        "value": "vi"
      },
      {
        "name": "Welsh",
        "value": "cy"
      },
      {
        "name": "Xhosa",
        "value": "xh"
      },
      {
        "name": "Zulu",
        "value": "zu"
      }
    ]
  },
  {
    "displayName": "Exact location (Google UULE parameter)",
    "name": "locationUule",
    "description": "The code for the exact location for the Google search. It's passed to Google Search as the <code>uule</code> URL query parameter. You can use the <a href='https://padavvan.github.io/' target='_blank'>UULE code generator</a>. Learn more about <a href='https://moz.com/ugc/geolocation-the-ultimate-tip-to-emulate-local-search' target='_blank'>emulating local search</a>.",
    "required": false,
    "default": "",
    "type": "string"
  },
  {
    "displayName": "Force exact match",
    "name": "forceExactMatch",
    "description": "If checked, the scraper will search for the exact phrase in the query. This is done by wrapping the query in quotes. Note that this may return fewer results. Also note that if you're using operators such as OR or AND, the whole query will be wrapped in quotes, such as <code>\"Windows AND macOS\"</code>. If you want to search for queries such as <code>\"Windows\" AND \"macOS\"</code>, you need to specify them directly in the <code>queries</code> field.",
    "required": false,
    "default": false,
    "type": "boolean"
  },
  {
    "displayName": "Site",
    "name": "site",
    "description": "Limits the search to a specific site, such as: <code>site:example.com</code>. Note that the <code>site</code> filter takes precedence over the <code>relatedToSite</code> filter. If both filters are set, the <code>relatedToSite</code> filter will be ignored and not added to the search queries.",
    "required": false,
    "default": "",
    "type": "string"
  },
  {
    "displayName": "Related to site",
    "name": "relatedToSite",
    "description": "Filters pages related to a specific site, such as: <code>related:example.com</code>. Note that the <code>site</code> filter takes precedence over the <code>relatedToSite</code> filter. If both filters are set, the <code>relatedToSite</code> filter will be ignored and not added to the search queries.",
    "required": false,
    "default": "",
    "type": "string"
  },
  {
    "displayName": "Words in title",
    "name": "wordsInTitle",
    "description": "Filters pages with specific words in the title. The scraper uses the <code>intitle:</code> operator, even for multiple words (e.g. <code>recipe site:allrecipes.com intitle:\"easy apple\" intitle:pie</code>). There's also a <code>allintitle:</code> operator available, but it's problematic when combined with other search filters, so the scraper avoids using it. If you need to use the <code>allintitle:</code> operator specifically, you can include it in your custom queries from the <code>queries</code> field.",
    "required": false,
    "default": {},
    "type": "fixedCollection",
    "typeOptions": {
      "multipleValues": true
    },
    "options": [
      {
        "name": "values",
        "displayName": "Values",
        "values": [
          {
            "displayName": "Value",
            "name": "value",
            "type": "string",
            "default": ""
          }
        ]
      }
    ]
  },
  {
    "displayName": "Words in text",
    "name": "wordsInText",
    "description": "Filters pages with specific words in the text. The scraper uses the <code>intext:</code> operator, even for multiple words (e.g. <code>cartoon site:wikipedia.com intext:cat intext:mouse</code>). There's also a <code>allintext:</code> operator available, but it's problematic when combined with other search filters, so the scraper avoids using it. If you need to use the <code>allintext:</code> operator specifically, you can include it in your custom queries from the <code>queries</code> field.",
    "required": false,
    "default": {},
    "type": "fixedCollection",
    "typeOptions": {
      "multipleValues": true
    },
    "options": [
      {
        "name": "values",
        "displayName": "Values",
        "values": [
          {
            "displayName": "Value",
            "name": "value",
            "type": "string",
            "default": ""
          }
        ]
      }
    ]
  },
  {
    "displayName": "Words in URL",
    "name": "wordsInUrl",
    "description": "Filters pages with specific words in the URL. The scraper uses the <code>inurl:</code> operator, even for multiple words (e.g. <code>recipe site:allrecipes.com inurl:apple inurl:pie</code>). There's also a <code>allinurl:</code> operator available, but it's problematic when combined with other search filters, so the scraper avoids using it. If you need to use the <code>allinurl:</code> operator specifically, you can include it in your custom queries from the <code>queries</code> field.",
    "required": false,
    "default": {},
    "type": "fixedCollection",
    "typeOptions": {
      "multipleValues": true
    },
    "options": [
      {
        "name": "values",
        "displayName": "Values",
        "values": [
          {
            "displayName": "Value",
            "name": "value",
            "type": "string",
            "default": ""
          }
        ]
      }
    ]
  },
  {
    "displayName": "Quick date range",
    "name": "quickDateRange",
    "description": "Filters results from a specific date range. d[number] specifies the number of past days (e.g. the past 10 days can be written as d10). The same applies to hours, weeks, months, and years: h[number], w[number], m[number], y[number]. Example for the past year: 'y1' or even 'y'. The value is passed to Google Search using the <code>tbs</code> URL query parameter, prefixed with <code>qdr:</code>. You should avoid combining this filter with the <code>beforeDate</code> and <code>afterDate</code> filters to prevent conflicts.",
    "required": false,
    "default": "",
    "type": "string"
  },
  {
    "displayName": "Before date",
    "name": "beforeDate",
    "description": "Filters results from before the specified date. Either absolute date (e.g. `2024-05-03`) or relative date from now into the past (e.g. `8 days`, `3 months`). Absolute time is always interpreted in the UTC timezone, not your local timezone - please convert accordingly. Supported relative date & time units: `days`, `weeks`, `months`, `years`. You should avoid combining this filter with the `quickDateRange` filter to prevent conflicts.",
    "required": false,
    "default": "",
    "type": "dateTime"
  },
  {
    "displayName": "After date",
    "name": "afterDate",
    "description": "Filters results from after the specified date. Either absolute date (e.g. `2024-05-03`) or relative date from now into the past (e.g. `8 days`, `3 months`). Absolute time is always interpreted in the UTC timezone, not your local timezone - please convert accordingly. Supported relative date & time units: `days`, `weeks`, `months`, `years`. You should avoid combining this filter with the `quickDateRange` filter to prevent conflicts.",
    "required": false,
    "default": "",
    "type": "dateTime"
  },
  {
    "displayName": "File types",
    "name": "fileTypes",
    "description": "Filters results of specific file types using the <code>filetype:</code> operator, such as <code>filetype:pdf</code>. You can select multiple file types as well. They will be combined with the <code>OR</code> operator, for example: <code>filetype:doc OR filetype:txt</code>. If you need to use a file type that is not in the list (such as a source code file type), you can include it in your custom queries from the <code>queries</code> field, using the <code>filetype:</code> operator.",
    "required": false,
    "default": [],
    "type": "multiOptions",
    "options": [
      {
        "name": "Adobe Portable Document Format (pdf)",
        "value": "pdf"
      },
      {
        "name": "Comma-Separated Values (csv)",
        "value": "csv"
      },
      {
        "name": "Electronic Publication (epub)",
        "value": "epub"
      },
      {
        "name": "Adobe PostScript (ps)",
        "value": "ps"
      },
      {
        "name": "HTML (htm)",
        "value": "htm"
      },
      {
        "name": "HTML (html)",
        "value": "html"
      },
      {
        "name": "Microsoft Excel (xls)",
        "value": "xls"
      },
      {
        "name": "Microsoft Excel (xlsx)",
        "value": "xlsx"
      },
      {
        "name": "Microsoft PowerPoint (ppt)",
        "value": "ppt"
      },
      {
        "name": "Microsoft PowerPoint (pptx)",
        "value": "pptx"
      },
      {
        "name": "Microsoft Word (doc)",
        "value": "doc"
      },
      {
        "name": "Microsoft Word (docx)",
        "value": "docx"
      },
      {
        "name": "OpenOffice presentation (odp)",
        "value": "odp"
      },
      {
        "name": "OpenOffice spreadsheet (ods)",
        "value": "ods"
      },
      {
        "name": "OpenOffice text (odt)",
        "value": "odt"
      },
      {
        "name": "Rich Text Format (rtf)",
        "value": "rtf"
      },
      {
        "name": "Scalable Vector Graphics (svg)",
        "value": "svg"
      },
      {
        "name": "TeX/LaTeX (tex)",
        "value": "tex"
      },
      {
        "name": "Text (txt)",
        "value": "txt"
      },
      {
        "name": "Wireless Markup Language (wml)",
        "value": "wml"
      },
      {
        "name": "Wireless Markup Language (wap)",
        "value": "wap"
      },
      {
        "name": "XML (xml)",
        "value": "xml"
      },
      {
        "name": "XML Paper Specification (xps)",
        "value": "xps"
      },
      {
        "name": "Markdown (md)",
        "value": "md"
      },
      {
        "name": "Readme (readme)",
        "value": "readme"
      },
      {
        "name": "Log file (log)",
        "value": "log"
      },
      {
        "name": "YAML (yml)",
        "value": "yml"
      },
      {
        "name": "YAML (yaml)",
        "value": "yaml"
      },
      {
        "name": "TOML (toml)",
        "value": "toml"
      },
      {
        "name": "Jupyter Notebook (ipynb)",
        "value": "ipynb"
      },
      {
        "name": "SAS (sas)",
        "value": "sas"
      },
      {
        "name": "SQL (sql)",
        "value": "sql"
      },
      {
        "name": "Resource Description Framework (rdf)",
        "value": "rdf"
      },
      {
        "name": "AV1 Image File Format (avif)",
        "value": "avif"
      },
      {
        "name": "Audio Video Interleave (avi)",
        "value": "avi"
      },
      {
        "name": "Matroska Multimedia Container (mkv)",
        "value": "mkv"
      },
      {
        "name": "QuickTime Movie (mov)",
        "value": "mov"
      },
      {
        "name": "Flash Video (flv)",
        "value": "flv"
      },
      {
        "name": "Advanced Systems Format (asf)",
        "value": "asf"
      },
      {
        "name": "Ogg Video (ogv)",
        "value": "ogv"
      }
    ]
  },
  {
    "displayName": "Mobile results",
    "name": "mobileResults",
    "description": "If checked the scraper will return results for mobile version of Google search. Otherwise desktop results are returned.",
    "required": false,
    "default": false,
    "type": "boolean"
  },
  {
    "displayName": "Unfiltered results",
    "name": "includeUnfilteredResults",
    "description": "If checked the lower quality results that Google normally filters out will be included.",
    "required": false,
    "default": false,
    "type": "boolean"
  },
  {
    "displayName": "Save HTML to dataset",
    "name": "saveHtml",
    "description": "If checked the HTML of the Google Search results pages will be stored to the default dataset, under the <code>html</code> property. This is useful if you need to process the HTML, but it makes the dataset large.",
    "required": false,
    "default": false,
    "type": "boolean"
  },
  {
    "displayName": "Save HTML to key-value store",
    "name": "saveHtmlToKeyValueStore",
    "description": "If checked the HTML of the Google Search results pages will be stored to the default key-value store and links to the files stored to the dataset under the <code>htmlSnapshotUrl</code> property. This is useful for debugging since you can easily view the pages in the browser. However, the use of this feature may slow down the Actor.",
    "required": false,
    "default": true,
    "type": "boolean"
  },
  {
    "displayName": "Include icon image data (base64)",
    "name": "includeIcons",
    "description": "If checked all of the results (organicResults, paidResults, suggestedResults) will contain Base64-encoded icon image data if found.",
    "required": false,
    "default": false,
    "type": "boolean"
  }
];

export const properties: INodeProperties[] = [...actorProperties, ...authenticationProperties];