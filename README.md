# super-mesh

## Folder Structure
```
supermesh
├── /app
│   ├── /client (angular components / index.html)
│   │       ├── /components
│   │       │           └── common (shared elements)
│   │       └── index.html
│   ├── /server
│   │       ├── /db (mongo database set up & models)
│   │       ├── /io (socket.io)
│   │       ├── /routes (routes)
│   │       │           ├── /admins
│   │       │           ├── /chat
│   │       │           ├── /sessions
│   │       │           ├── /configure (middleware files)
│   │       │           │           ├── error.middleware.js
│   │       │           │           ├── parsing.middleware.js
│   │       │           │           ├── requestState.middleware.js
│   │       │           │           ├── statics.middleware.js
│   │       │           │           ├── index.js (calling all of the middlewares)
│   │       ├── app.js (router base)
│   │       └── start.js (starting server)
├── /dist (output folder for precompiled 'src' folder)
│   ├── /css
│   ├── /img
│   └── /js
└── /src
    ├── /img
    ├── /js
    ├── /scss
    └── /vendor (library)
```

## Models

### Event Model
    - Name (String)
    - Description (String)
    - Logo (String)
    - Theme hex color (String)
    - Map (String)
    - Schedule ref Session (Ref Mongoose Type)
    - duration (Integer)
    - time start (TIME)
    - time end ( TIME)
    - in progress (BOOL)
    - numofparticip Integer)
    - Organizer ( Ref Mongoose Type)
    
    
### Session
    - Name( String)
    - Description( String)
    - Speakers (ref Mongoose Type)
    - Time Start ( Unix time)
    - Time End ( unix Time)
    - Duration ( Int)
    - Location (ref Mongoose Type)
    - Messages (ref Mongoose Type)
    - Participants ( ref Mongoose Type)
    
    
### Speaker
    - Name( String)
    - Bio ( String)
    - Session ref
    - Photo

### Organizer
    - name ( String)
    - phone_number ( String)
    - photo ( String)
    
### Participant
    - username ( String)
    - phone_number ( String)
    - banned  ( Bool)
   
### Location
    - name ( String)
    - coords( Mongoose coordinate)
    - details ( String)
    
### Message
    - upvotes ( Integer)
    - content ( String)
    - Participants (ref Mongoose model)
    
    