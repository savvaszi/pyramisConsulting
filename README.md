# Pyramis Consulting

This project is configured to automatically deploy via Dokploy whenever changes are pushed to the `master` branch.

## Directus CMS Integration

The frontend has been set up to fetch data dynamically from your Directus backend at `https://cms.pyramis.com.cy`.

### Required Directus Setup
1. Log into your Directus dashboard.
2. Go to **Settings > Roles & Permissions** and ensure the **Public** role has **Read** access to the `home_page` collection.
3. Create a **Singleton** Collection named `home_page`.  
   Make sure you tick the "Treat as a single object" box when creating the collection.
4. Add the following fields to the `home_page` collection:
   - File Name: `hero_title` (Type: String)
   - File Name: `hero_subtitle` (Type: Text)
   - File Name: `service_1_title` (Type: String)
   - File Name: `service_1_description` (Type: Text)
   - File Name: `service_2_title` (Type: String)
   - File Name: `service_2_description` (Type: Text)
   - File Name: `service_3_title` (Type: String)
   - File Name: `service_3_description` (Type: Text)

Once you populate these fields in Directus and hit Save, any visitor landing on the page will automatically see the changes pulled live from your CMS!
