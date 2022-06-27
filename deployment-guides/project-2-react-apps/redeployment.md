![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Redeployment with Netlify

- Work as normal `yarn start` in `src` folder etc.

- `yarn build` to rebuild the app when you have finished making your update.

- `serve -s build` to test it, make sure it’s working as expected.

- `netlify deploy` to redeploy a staging test version of the site, visit the staging URL and test that is working as expected.

- `netlify deploy -—prod` to redeploy the live production version
