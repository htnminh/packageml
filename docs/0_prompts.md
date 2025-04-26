- [Research process](#research-process)
- [Plan and design process](#plan-and-design-process)
  - [Plan](#plan)
  - [UI design](#ui-design)
  - [User flow design](#user-flow-design)

# Research process

```
list all possible machine learning algorithms that are available in python packages (like sklearn) and is lightweight enough to run a few of them concurrently on a machine of this specification on digitalocean: 4 GB Memory / 2 Intel vCPUs / 120 GB Disk + 100 GB / SGP1 - Docker on Ubuntu 22.04 
```
```
my product/project name is "AutoExplainML" (can you suggest some better names?)
in this product, technologically, i want to implement: a frontend for a website and a web app, a backend to handle user accounts, logging and other data (you name them), an api (for the backend to handle frontend requests and external requests in rest api form). all of this should be deployable on that droplet above using only one docker compose file. and yeah of course i will manage all the code inside one github repo.
functionally, as the core, i want it to be able to: (from both frontend and external ones) get data, run ml algorithms on algorithms the user chose (or return some message if it couldn't) or automatically chose using AI, return the result, and some explainations about that result using AI, along with some visualizations. the user can also handle their own datasets, algorithms metadata (like hyperparameters), run histories, and a few more that i can't think of now (you name them for me).
this product is for a solo project, so it doesn't need to be completely full-fledged. it doesn't need to be deployed in enterprises, so keep it not too complicated.
also, do a deep research and help me answer this 3 questions for the project i described so i can fill in a form:
- Identify the problem: clearly state the problems that society is facing that the application is trying to solve. (a short paragraph between 10 and 15 sentences)

- Similar applications: Survey some similar applications, what points in those similar applications do not solve the stated social problem (a list of no more than 7 bullet points, each app write in a bullet point)

- Features that help solve the problem: List 1-3 main features that you think can solve the stated problem (exactly 3 bullet points, you can describe each feature in 1 or 2 sentences)
```
```
- anyone who wants to run machine learning without complicated python setup and hardware. as stated, we help them run it via rest api and the web interface.
- accessibility to ML, explainability, managability. we provide: easy to run, easy to understand, easy to manage.
- frontend should be html, css, and some minimal javascript to make the website feel modern and interactive. backend should be pure python. the database i choose is mysql. and as mentioned, one docker compose, and one github repo for all of them.
ask me 3 more questions. i want to make sure you understand want i mean.
```
```
so... summarize the above research and help me do this:

- Identify the problem: clearly state the problems that society is facing that the application is trying to solve. (a short paragraph between 10 and 15 sentences)

- Similar applications: Survey some similar applications, what points in those similar applications do not solve the stated social problem (a list of no more than 7 bullet points, each app write in a bullet point)

- Features that help solve the problem: List 1-3 main features that you think can solve the stated problem (exactly 3 bullet points, you can describe each feature in 1 or 2 sentences)
```
```
i do feel that the problem statement is too long. cut that by one third.
```
```
suggest some alternatives to the name "AutoExplainML". it feels a bit too leaning towards explaining.
```
```
how about LitePocketML?
```
```
how about PackageLM?
```
```
sorry, i meant PackageML. is it good enough now?
```
```
"Machine‑learning’s benefits remain locked away from most individuals and small organisations because installing libraries, securing hardware, and writing code are daunting hurdles. Even “free” cloud notebooks still demand Python skills, while hiring data‑science talent is costly. Those who do train models often face the “black‑box” dilemma—predictions arrive without context, eroding trust and raising ethical concerns. Commercial AutoML tools promise help but tie users to expensive, proprietary clouds and still assume technical literacy. None provide a lightweight, self‑hosted option that one person can spin up on modest hardware. As a result, teachers, NGOs, and small businesses miss out on data‑driven insights that could improve lives and services. PackageML bridges this gap with a no‑code web interface, automatic or user‑chosen algorithms, and clear natural‑language explanations, all packaged in a single Docker‑Compose stack small enough for a hobby‑grade server. By slashing technical barriers and adding transparency, the platform democratises trustworthy ML for everyone.
"	"- Google Colab — removes local setup headaches but still requires Python coding, has limited session runtimes, and cannot be self‑hosted.
- Kaggle Notebooks — excellent for competitive data scientists, yet coding skills are mandatory and sessions shut down after inactivity.
- H2O Driverless AI — powerful AutoML with explanations, but it is commercial, needs large memory/CPU, and cannot run cheaply on a 4 GB droplet.
- DataRobot — enterprise‑oriented, licence‑based, and cloud‑locked; too costly and heavyweight for individuals or small NGOs.
- Azure ML Studio (Designer) — low‑code drag‑and‑drop, yet tied to Azure pricing, quotas, and a confined set of algorithms; no simple offline deployment.
- IBM Watson AutoAI — automates pipelines but limits algorithm choice and forces users onto IBM Cloud subscriptions.
- RapidMiner Studio — desktop GUI lowers coding needs, but it is memory‑hungry, assumes data‑prep know‑how, and lacks one‑click explanatory reports.
"	"- Zero‑install, single‑docker deployment – the whole stack (frontend, API, backend, MySQL) fits into one Docker‑Compose file and runs on a 8 GB / 4‑vCPU server, slashing infrastructure cost and setup time.
- No‑code modelling with auto‑or manual algorithm selection – users upload data, pick an algorithm (or let the system choose), adjust hyper‑parameters in simple forms, and launch jobs via web UI or REST; no Python required.
- Built‑in explainability and run history – every model returns plain‑language explanations, key feature importances, and quick visualisations, while all datasets, parameter sets, and results are stored for easy comparison and audit.
"

i changed some parts.

now, i want you to add a little bit. one more functionality is the model context protocol server. add them to 3 answers above without changing their lengths
```
```
you are stressing too much on mcp in similar applications. i want you to stress about it more in the problem statement. feel free to cutout some parts. stress about it less in similar applications. the last part is ok.
then, make sure that it sounds natural. 
```



# Plan and design process
## Plan

```
let's do another exercise. the exercise instruction is:
"""

Plan:

Define the app idea:
Pick a niche or problem that interests you.
Propose a web app that solves that problem or provides value to users.
For example: Recipe management app, vocabulary learning app, reading progress tracking app, etc.


Describe the app in detail:
State the goal of the app: What does this app do for users?
Define the target audience: Who will use this app?
List the main functions of the app: What features does the app have? (For example: create new recipes, search for recipes, save favorite recipes, etc.)


Make a list of specific features:
Break down the main functions into smaller, more specific features.
For example:
The "Create New Recipe" function might include the following features:
- Enter a recipe name
- Enter a list of ingredients
- Enter step-by-step instructions
- Upload a photo of the dish
- Save the recipe
"""
do this with my PackageML app.

for the "Define the app idea" part, write a paragraph in 12 sentences or less.
"Describe the app in detail", besides the 3 questions stated, add some (probably around 3) more questions of our own to clarify things that you think is necessary. answer each in 3 sentences or less. do not mention functionalities/features here, we have the next part for that.
for this "Make a list of specific features" part, write in the format that they provided.
```
```
your first part is no where near 10 sentences. let's do it this way: the first paragraph has around 5 sentences in the beginning to show the "niche", as stated in the instruction. the second has around 7 to show the proposal like what you wrote. don't write the niche in the end anymore. 

i think you wrote "artifacts" as "artefacts", fix that.
"but scales down to 4 GB for light workloads." - no we don't do this.
"MIT-style licence", nope we go hardcore gnu gpl v3. 
the main functions sound a bit off, you should order them by importance. the most important functionality is train model (don't put auto select here, split it out), then manage datasets, auto-select, etc. the rest are good.
change the "question" column to "aspect", "answer" to "detail". and write the entries consistently, you are mixing questions and nouns in that column.

write the list of features exactly the same as what as listed above.
in the details,
remember that all of these features will be deployed as an api (rest). the dataset management already have none of that specification.
an mcp server also serves those apis.
no 2 factor authentication yet. too complicated for now.
"Webhook support for real-time notification on completed runs" - no, the user just check the status themselves for now.
```

## UI design
```
for this task, help me write all the code for the frontend in the /frontend directory. write frontend only for these 2 screens. we will add more screens and backend integration later.

@photo_2025-04-25_11-01-29.jpg is the website, design a website that is eye-catchy in the first sight that way.

@photo_2025-04-25_11-01-32.jpg is the screen after they have logged in. i don't know what to call it, manage board? make it looks that way, and, make the screen clickable on sidebar immediately. it doesn't have to link to the website, yet.

remember, this is just a broad design. feel absolutely free to imagine more components on your 2 screens when you write. refer to current good practices in UI design.

please refer to @1_research.md and @2_plan_design.md  to understand what am i building
```
```
run the commands to help me install npm on windows.
```
```
the main page in @frontend  looks a bit lacking. can you expand with more showing functionalities, utilities, and/or something that makes the main page website fulfilling? refer to @1_research.md @2_plan_design.md to see what we are building.

do just that, we will do more later.
```
```
a few problems, fix it by:
- "Import CSV/Excel files via web UI or API" - yes, and we also support upload of json files too. api works with it all the time. include it. "web" only, not "web UI". sounds a bit too technical.
- completely omit the "User Success Stories" section.
- remove that docker compose file on the main website.
- the second button should be "Sign Up" instead of "try demo"
- "Deploy PackageML today and transform your data into actionable insights" - change "deploy" to "Use"
```

## User flow design
