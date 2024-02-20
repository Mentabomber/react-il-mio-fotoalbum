Major issues / bugs / fixes


- When logged in on the home page fix the modify button

- Reloading while logged in makes the login malfunction and I can't seem to figure out why, am I losing the user data when reloading? 
(actually still looking to trigger this bug, sometimes it works sometimes it doesnt)
Failed to load resource: the server responded with a status of 404 (Not Found)
:3307/me:1 
        
        
       Failed to load resource: the server responded with a status of 404 (Not Found)

        2fetchApi.js:21 Uncaught (in promise) Error: La rotta richiesta non è stata trovata
            at fetchApi (fetchApi.js:21:11)
            at async fetchLoggedUser (AuthContext.jsx:52:22)
            at async initializeData (AuthContext.jsx:62:7)

-- FIXED function and root to localhost:3307/me was missing on the back-end side 

Minor issues / bugs / fixes

- Registration needs validations (password needs to be x letters with special chars etc)

- When Logged in Login and register buttons must disappear

-- FIXED

- Random image close to the displayed user email must be also changed into the avatar of the user or a default no img

- Update Site logo

