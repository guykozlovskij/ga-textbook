![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Mongo Atlas
​
We need to setup an account with Mongo Atlas so that we can have a working database once we deploy to Heroku.
​
We need to gather 3 bits of information as we do this, as we’ll need them later when we do deploy. These are:
​
* Your username
 * Your password
* Your cluster

Store these safely in a bear note or test file as you go
​
### Make an account

1. Create MongoDB Atlas account at mongodb.com
2. Make organization - Name this whatever you want. Here’s an example:
​
![atlas-db-1](https://media.git.generalassemb.ly/user/21993/files/1a126600-28e4-11eb-8c8c-cf0707de3bb8)
​
### Create a project and a cluster

3. Make a project - name this your project
4. Make a cluster using the following settings
	* AWS
	* Ireland
	* M0 Sandbox
	* MongoDB 4.2, no backup
	* Name your cluster, we
	recommend naming it after
	your project, or leaving it as the default Cluster0. __Make sure you remember the cluster name__
​
![altas-db-2](https://media.git.generalassemb.ly/user/21993/files/1e3e8380-28e4-11eb-9c23-8736c47a9d12)
​
### Create cluster
​
5. You’ll then be taken to a screen that looks like this (the mongo dashboard). It’ll take a few minutes to create your cluster, so you’ll need to wait until this is complete.
​
![atlas-db-3](https://media.git.generalassemb.ly/user/21993/files/1f6fb080-28e4-11eb-84f5-02914802ac74)
​
### Getting connected
​
6. Click the ‘connect’ button on this screen, to connect to mongodb. It’ll pop you the window below:
7. Select ‘Allow access from anywhere’, and use the default fields that get filled in
8. Create a user and password. Make sure you make a note of the user and the password (but don’t worry if you forget, you can easily reset it). I used the autogenerate function to create mine below.
​
![atlas-db-4](https://media.git.generalassemb.ly/user/21993/files/21d20a80-28e4-11eb-9e0d-2db9a362fcbb)

9.  The final page will present you with a connection string, but will have placeholder values in it, you should make a copy of this too. It will look something like

```
mongodb+srv://jack:<password>@cluster0.1mdpo.mongodb.net/<dbname>?retryWrites=true&w=majority
```
​
To sum up, make sure you’ve made a note of:

* Your username
* Your password
* Your cluster

Now move to “prep” document.
​
