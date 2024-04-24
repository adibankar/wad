const express = require('express');


const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


var credentials = {}; 
app.get('/',(req, res) => {
    res.sendFile(__dirname + "/public/home.html");
})

app.get('/login',(req,res)=>{
    console.log('credentials: ', credentials);
    res.sendFile(__dirname + "/public/login.html"); 
});

app.post('/logout',(req,res)=>{
    res.redirect('/login')
})

app.post('/login', (req,res ) => {
    console.log(credentials)
    console.log(req.body);
    if(req.body.email === credentials.email && req.body.password === credentials.password){
        console.log('Login Successfull');
        res.redirect('/');
    }
    else{
        console.log('Invalid Credentials');
    }
})

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/public/signup.html');
});

app.post('/signup', (req, res) => {
   
    console.log(req.body);
    credentials.name = req.body.name;
    credentials.dob = req.body.dob;
    credentials.email = req.body.email;
    credentials.dept = req.body.dept;
    credentials.password = req.body.password;

    res.redirect('/login');
});


app.listen(3300,()=>{
    console.log("Server is running on port 3000");
})












// const express = require('express');
// const app = express();
// const PORT = 3300;

// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));

// let users = [];


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/home.html');
// });

// app.get('/login', (req, res) => {
//     res.sendFile(__dirname + '/public/login.html');
// });


// app.post('/login', (req, res) => {
//     const { email, password } = req.body;
//     const user = users.find(user => user.email === email && user.password === password);
//     if (user) {
//         console.log('Login successful');
//         res.redirect('/');
//     } else {
//         console.log('Invalid credentials');
//         res.redirect('/login');
//     }
// });


// app.get('/signup', (req, res) => {
//     res.sendFile(__dirname + '/public/signup.html');
// });

// app.post('/signup', (req, res) => {
//     const { name, dob, email, dept, password } = req.body;

//     users.push({ name, dob, email, dept, password });
//     console.log('User registered:', req.body);
//     res.redirect('/login');
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
