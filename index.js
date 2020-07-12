const inquire = require("inquirer");
const axios = require("axios");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

//Initial prompt for user GitHub email
function promptUser(){
    inquire.prompt([
        {
            type:"input",
            name:"username",
            message:"Please input your Github username."
        }
    ])  
        //Cue async back to save retrieve avatar and email via Github 
        .then(function({username}){
            const queryURL = `http://api.github.com/users/${username}`;
            axios.get(queryURL).then(function(response){
                console.log(response.data.avatar_url);
                console.log(response.data.email);
                const results = {
                    avatarURL: response.data.avatar_url,
                    email: response.data.email,
                    
                }
                console.log("Grabbing your details from Github...");
                console.log("Loading...");
                projectQuestions(results)

            });
    });
}; 

/*Questions about User Project details*/
function projectQuestions() {
    inquire.prompt([
    {
        type: "input",
        name: "projectTitle",
        message: "Enter your project title?",
    },
    {
        type: "checkbox",
        message: "Select your table of contents?",
        name: "tableOfContents",
        choices: [
            "Project Title",
            "Description",
            "Installation",
            "Technology Used",
            "Usage",
            "License",
            "Contributors",
            "Tests",
            "Acknowledgments"
        ]
    },
    {
        type: "input",
        name: "description",
        message: "Describe your project in a couple of sentences"
    },
    {
        type: "input",
        name: "technologyUsed",
        message: "What technologies did you use to build your project? ",
    },
    {
        type: "input",
        name: "frameworkUsed",
        message: "What frameworks did you use to build your project?",
    },
    {
        type: "input",
        name: "deployment",
        message: "Add any additional notes about how to deploy this on a live system."
    },
    {
        type: "list",
        name: "license",
        message: "Select the licenses appropriate for this project?",
        choices: [
            "MIT",
            "GPL 3.0",
            "Apache 2.0",
            "GPL 2.0",
            "BSD 3",
            "LGPL 2.1",
            "MS-Pl",
            "BSD 2"
        ]
    },
    {
        type: "input",
        name: "contributors",
        message: "Enter the list of contributors."
    },
    {
        type: "input",
        name: "tests",
        message: "Which tests did you include, if any?"
    }
    ])
    .then(function(res){
        /*console.log(userInput)*/
        const readme = `
        # **README GENERATOR**
    
        # Title of Project
        ${res.projectTitle}
        
        ## Description    
        ${res.description}
        
        ## Table of Contents
        ${res.tableOfContents}
        
        ### Installed packages 
        ${res.frameworkUsed}
    
        ### Technology used during build
        ${res.technologyUsed}
    
        ### Deployment Instructions 
        ${res.deployment}
    
        ### License${res.license}
    
        #### Badges
        [![Social]
        
        ### GitHub Username of Primary Developer
        ${res.email}
    
        ### Contributors
        ${res.contributors}
        `;

        fs.writeFile("test.md", readme, function(err){
            if (err){
                throw err;
            }
            console.log("saved!")
        })
    })
}

promptUser();
