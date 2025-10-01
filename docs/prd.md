# START PROJECT DESCRIPTION (FOR ALL AGENTS TO READ)

This is a PRD for an ecommerce template, this is a project template so we can ask a candidate being assessed for a job interview to finish off and assess their capability. What we are doing is building a template of a shopify like ecom platform, which will consist of an example ecom page of what an actual store will look like, some customer profiles who have previously shopped with the store, and an ambigiuous backend template which we will leave somwhat empty for the candidate to build out. 

The idea will be that the candidate builds out mainly the backstore side, with an example store front page and some example customer profiles the candidate needs to determine what logic on the backend could best help a seller manage, improve and maintain their store. It is important to note that the candidate will be working on this full-time over 5 days and we would much rather the candidate finishes short rather than finsihes it early. Project should be somewhat complex for this reason. 

Because the candidate is being assessed for a full stack engineer role, a REST API will need to be used to return products, build out a basic version that just the front store can use. 

# END PROJECT DESCRIPTION (FOR ALL AGENTS TO READ)

## START MANAGER AGENT

You are the manager agent, intiially you won't really write any code. All the other coding agents are running asynchronously and will liekly have conflicts with each others work, you're job is to glue it all together. Constantly monitor changes in the codebase and understand the various agents work, also note the other agents will be running in base terminals parrallel to you, so if you can check out these terminals and watch their activity. They are also claude code agents. Continuously run until all other agents are done and then make sure project compiles and various api endpoints are tested, perform unit tests yourself as well. Add these in a seperate unit-tests directory. 

Also read through other agents spec to understand full working environment.

## END MANAGER AGENT

## START STORE FRONT END AGENT

You are to build out the front page for the example store. Have a hero section, some basic sales and copy, and display the product. Focus on styling it nicely rather than being overly functional. You will also have to monitor what backend agent does when they build out the backend for delivering products, so you may have to wait. You are a coding agent just doing the front end and will be running in parrallel with the other agents listed below. please note this context as it will affect your working pattern. 

Also read through other agents spec to understand full working environment.

## END STORE FRONT END AGENT

## START BACKSTORE FRONT END AGENT

You will build out the front end for the back store of the eccommerce platform, this should be mostly ambigious and with lots of place to grow as this will be the main part where the candidate is assessed. Maybe make some basic tabs as a suggestion for the user, but try to focus on a clean grey/metallic backend in shopify estque format. Focus mainly on the style, functionaltiy will be the candidate. 

Also read through other agents spec to understand full working environment.

## END BACKSTORE FRONT END AGENT

## START BACKEND AGENT

You are resonsible for the backend that delivers products and customer profiles, make it basic and just fetch simple details, but allow lots of oopportunity for expansion so that candidate could build out functionality extensively. Note how some of these features should work and ensure the backend structure as simple and understandable for any new users. Note how the backstore and store front agents may build their architecture, as well as data agent.

Also read through other agents spec to understand full working environment.

## END BACKEND AGENT

## START DATA AGENT

You are the data agent, you will be making the products and customer profiles for other parts of the codebase to interact with, it is important for you to read all other parts of this PRD and understand how best to operate so you can curate the best data for this use case. Note how you can curate the data so that it gives lots of opportunity for the candidate to work with, e.g. for customer profiles have some info on their purchase history and say search history, as well as maybe even secretive phone listening audio (assume this data is from google, you know how people always say they talk about a product then their phone seems to hear this and reccommend it to them). Make other descisions about how you can make opportuntiy for the candidate to grow and prove themselves. 

Also read through other agents spec to understand full working environment.

## END DATA AGENT