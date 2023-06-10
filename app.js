if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
// const ejsMate = require('ejs-mate');
const mongoose=require('mongoose');
const methodOverride = require('method-override');
const catchAsync = require('./errorHandlers/catchAsync');
const ExpressError=require('./errorHandlers/expresserror');
const bcrypt=require('bcrypt');
const session = require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const localStrategy=require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const User=require('./models/user');
const userRoutes=require('./routes/userRoutes');
const skillRoutes=require('./routes/skillRoutes');
const playRoutes=require('./routes/playRoutes');
const reviewRoutes=require('./routes/reviewRoutes');

const MongoStore = require('connect-mongo');
mongoose.set('strictQuery', true);

const dbUrl =  process.env.DB_URL ||'mongodb://localhost:27017/loginDemo';

// const dbUrl= 'mongodb://localhost:27017/loginDemo';

const db = async () => {
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    .then(() => {
        console.log("Database Connected!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })
}

    // const db = mongoose.connection;
    // db.on("error", console.error.bind(console, "connection error:"));
    // db.once("open", () => {
    //     console.log("Database connected");
    // })


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})


const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'", "'unsafe-inline'", "https://www.google.com/maps/"],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            "form-action":["'self'", "https://www.google.com"],
            //  'frame-ancestors': ["'self'"],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dm3dtfqhe/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use(mongoSanitize({
    replaceWith: '_'
}))


app.use('/', skillRoutes);
app.use('/', userRoutes);
app.use('/plays', playRoutes);
app.use('/plays/:id/reviews', reviewRoutes);




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = 3000;

db().then(() => {
app.listen(process.env.PORT || port, ()=>{
    console.log('Listening now');
    })
})

