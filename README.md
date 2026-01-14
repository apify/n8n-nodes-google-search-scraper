# n8n Nodes - Google Search Results Scraper

This is an n8n community node that integrates Apify's [Google Search Results Scraper](https://apify.com/apify/google-search-scraper) with your n8n workflows, enabling you to extract structured data from Google Search Engine Results Pages (SERPs) directly within your automation workflows.

[Apify](https://apify.com) is a platform for developers to build, deploy, and publish web automation tools, while [n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) tool for AI workflow automation that allows you to connect various services.

## Table of contents

- [Installation on self hosted instance](#installation-self-hosted)
- [Installation for development and contributing](#installation-development-and-contributing)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)
- [Release](#releasing-a-new-version)
- [Version History](#version-history)
- [Troubleshooting](#troubleshooting)

## Installation (self-hosted)

To install the Google Search Results Scraper community node directly from the n8n Editor UI:

1. Open your n8n instance.
2. Go to **Settings > Community Nodes**
3. Select **Install**.
4. Enter the npm package name: `n8n-nodes-google-search-scraper` to install the latest version. To install a specific version (e.g 1.0.0) enter `n8n-nodes-google-search-scraper@1.0.0`.
5. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes and select **Install**
6. The node is now available to use in your workflows.

> **Note:** This community node only works on self-hosted n8n instances. It is not available for n8n Cloud.

## Installation (development and contributing)

### ⚙️ Prerequisites

- **Node.js**: 22.x or higher (required)
- **npm**: 10.8.2 or higher (required)

Verify your versions:

```bash
node --version  # Should be v22.x.x or higher
npm --version   # Should be 10.8.2 or higher
```

If you use `nvm`, the project includes a `.nvmrc` file. Simply run:

```bash
nvm use
```

### 1. Clone and Install Dependencies

Clone the repository and install dependencies:

```bash
git clone https://github.com/apify/n8n-nodes-apify.git
cd n8n-nodes-apify
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is required due to n8n's complex peer dependency tree.

### 2. Build the Node Package

```bash
npm run build
```

### 3. Start Development Server

Start the n8n development server with your node linked:

```bash
npm run dev
```

---

### 🔁 Making changes

If you make any changes to your custom node locally, remember to rebuild and restart:

```bash
npm run build
```

---

## Self-hosted n8n: Public webhook URL for triggers

This configuration is required for our service's trigger functionality to work correctly.

By default, when running locally n8n generates webhook URLs using `localhost`, which external services cannot reach. To fix this:

1. **Set your webhook URL**  
In the same shell or Docker environment where n8n runs, export the `WEBHOOK_URL` to a publicly-accessible address. For example:
  ```bash
  export WEBHOOK_URL="https://your-tunnel.local"
  ```
2. **Restart n8n** 
  ```bash
npm run dev
  ```

## Operations

This node provides a single operation:

### Run scraper

Execute the Google Search Results Scraper and extract structured data from Google Search Engine Results Pages (SERPs).

**What you can extract:**
- **Organic search results**: titles, URLs, descriptions, and emphasized keywords
- **Paid advertising results**: extract Google Ads data when enabled
- **Related queries**: capture "People Also Ask" sections
- **Product information**: ratings, review counts, and pricing data
- **AI-generated content**: Extract data from Google AI Mode and Perplexity AI search
- **Business lead enrichment**: Gather names, emails, job titles, and LinkedIn profiles with lead enrichment

**Configuration options:**
- Search by keywords or direct Google Search URLs
- Support for advanced search operators (site:, filetype:, daterange:, etc.)
- Configure interface language and search language independently
- Set exact location using UULE parameter for precise geo-targeting
- Select mobile or desktop result preferences
- Date range filtering for time-sensitive searches

**AI integration:**
The Google Search Results Scraper integrates seamlessly with n8n's AI tools, enabling workflows such as:
- Scrape Google search results and use AI to summarize key findings
- Extract competitor data and analyze trends with language models
- Gather research information and generate comprehensive reports
- Monitor search rankings and alert on changes using AI-powered analysis

## Credentials

This node requires Apify API authentication:

**API key authentication**
- Configure your Apify API key in the n8n credentials section under `apifyApi`
- You can find your API key in your [Apify account settings](https://console.apify.com/account/integrations)

![auth](./docs/auth.png)


## Compatibility

- **n8n**: Version 1.57.0 and higher
- **Node.js**: 22.x or higher
- **npm**: 10.8.2 or higher

## Usage

### Basic setup

1. **Install the node**: Follow the [installation instructions](#installation-self-hosted) above.
2. **Configure credentials**: Add your Apify API key in n8n's credentials section.
3. **Create a workflow**: Add the Google Search Results Scraper node to your n8n workflow.
4. **Configure your search**:
   - Enter your search query or Google Search URL
   - Select geographic location and language preferences
   - Choose which data to extract (organic results, ads, related queries, etc.)
5. **Execute the workflow**: Run the workflow to scrape Google search results.

### Example use cases

**SEO and performance tracking**
- Monitor how your website performs on Google for specific queries over time
- Track your search rankings and visibility for target keywords
- Analyze Google algorithm trends and identify patterns in search results

**Search volume and trend analysis**
- Monitor how frequently search terms are used on Google
- Compare search term usage against total search volume
- Identify trending topics and seasonal patterns

**Competitive intelligence**
- Monitor your competition in both organic and paid results
- Analyze display ads for specific keywords
- Track competitor positioning and ad copy strategies

**Lead generation**
- Generate business leads with the built-in business leads enrichment add-on
- Extract contact information for targeted outreach
- Build prospect lists based on search criteria

**Content and URL discovery**
- Build URL lists for specific keywords
- Scrape web pages containing particular phrases
- Identify content opportunities based on search results

**AI and algorithm optimization**
- Monitor AI overview summaries to see how your site performs
- Track brand visibility with Google AI mode add-on
- Improve AEO (Answer Engine Optimization) and GEO (Generative Engine Optimization) strategies

![workflow](./docs/workflow.png)

## Resources

- [Google Search Results Scraper on Apify](https://apify.com/apify/google-search-scraper)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Apify API Documentation](https://docs.apify.com)

# Releasing a New Version

This project uses a GitHub Actions workflow to automate the release process, including publishing to npm. Here's how to trigger a new release.

**Prerequisites (for all methods):**

* Ensure your target branch on GitHub is up-to-date with all changes you want to include in the release.
* Decide on the new version number, following semantic versioning (e.g., `vX.Y.Z`).
* Prepare your release notes detailing the changes.
* If you're using CLI to release, make sure you have the [GitHub CLI (`gh`)](https://cli.github.com/) installed and authenticated (`gh auth login`).

---

## Method 1: Using the GitHub Web UI (Recommended for ease of use)

1.  **Navigate to GitHub Releases:**
	* Go to your repository's "Releases" tab

2.  **Draft a New Release:**
	* Click the **"Draft a new release"** button.

3.  **Create or Choose a Tag:**
	* In the "Choose a tag" dropdown:
		* **Type your new tag name** (e.g., `v1.2.3`).
		* If the tag doesn't exist, GitHub will prompt you with an option like **"Create new tag: v1.2.3 on publish."** Click this.
		* Ensure the **target branch** selected for creating the new tag is correct. This tag will point to the latest commit on this target branch.

4.  **Set Release Title and Notes:**
	* Set the "Release title" (e.g., `vX.Y.Z` or a more descriptive title).
	* For the release notes in the description field, you have a few options:
		* **Write your prepared release notes.**
		* **Click the "Generate release notes" button:** GitHub will attempt to automatically create release notes based on merged pull requests since the last release. You can then review and edit these auto-generated notes.

5.  **Publish the Release:**
	* Click the **"Publish release"** button.

		*Upon publishing, GitHub creates the tag from your specified branch and then creates the release. This "published" release event triggers the automated workflow.*

---

## Post-Release: Automated Workflow & Verification

After creating and publishing the GitHub Release:

1.  **Automated Workflow Execution:**
	* The "Release & Publish" GitHub Actions workflow will automatically trigger.
	* It will perform:
		1.  Code checkout.
		2.  Version extraction (`X.Y.Z`) from the release tag.
		3.  Build and test processes.
		4.  Update `package.json` and `package-lock.json` to version `X.Y.Z`.
		5.  Commit these version changes back to the branch the release was targeted from with a message like `chore(release): set version to X.Y.Z [skip ci]`.
		6.  Publish the package `n8n-nodes-google-search-scraper@X.Y.Z` to npm.

2.  **Verify the Package on npm:**
		After the workflow successfully completes (check the "Actions" tab in your GitHub repository):
	* Verify the new version on npm:
			```bash
			npm view n8n-nodes-google-search-scraper version
			```
		This should print `X.Y.Z`.

## Version history

Track changes and updates to the node here.

## Troubleshooting

### Common issues

1. **Authentication errors**
	- Verify your API key is correct

2. **Resource Not Found**
	- Verify the resource ID format
	- Check if the resource exists in your Apify account
	- Ensure you have access to the resource

3. **Operation failures**
	- Check the input parameters
	- Verify resource limits (memory, timeout)
	- Review Apify Console for detailed error messages

### Getting help

If you encounter issues:
1. Check the [Google Search Results Scraper documentation](https://apify.com/apify/google-search-scraper)
2. Review the [Apify API documentation](https://docs.apify.com)
3. Review the [n8n Community Nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
4. Open an issue in the GitHub repository
