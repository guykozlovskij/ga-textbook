![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# React App Deployment with Netlify

Before following this guide, make sure you have completed “Netlify Account & Netlify CLI Installation”

## Preparing your App for deployment

- *If your project uses `react-router-dom`*, create a file inside the `public` directory named `_redirects` and place the following inside.

```
/*  /index.html   200
```

- Run the following commands from your project route.

  - `npm run build` - builds a production version of the app ready to be deployed.

  - If successful, you should be then prompted to install a package called “serve” to test your build locally. This can be installed with `npm i serve -G` or with yarn `yarn global add serve`. _This is a one time installation, once you have done it you will never need to again and can skip this step in future_.

  - `serve -s build` actual command to run the build version, was installed with the command above. It will tell you a port where your App is being run, navigate to that port in your browser and test your App is working like you would expect

## Netlify Deploy Commands

- `netlify deploy` from our projects root folder, this starts the deployment process

  - Go thought the set up questions
    - `Create & configure a new site`
    - Pick you team
    - add site name (optional, no spaces or capitals)
    - When prompted for a publish directory type `build` then enter.
    - If successful, you will be given a staging URL to view your site, again visit this in your browser and test your site.

- `netlify deploy -—prod` will make the live version of your site deploy, again specify the publish directory as `build`
