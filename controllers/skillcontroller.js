const User = require('../models/user');
const mydata=require('../data.json');

module.exports.home=(req, res)=>{
    res.render('skill/home');
}

module.exports.rand=(req, res)=>{
    const num=Math.floor(Math.random()*20)+1;
    res.render('skill/random', {num});
}

module.exports.cats=(req, res)=>{
    const cats=['Blue', 'Crazy', 'Naughty', 'Dancy'];
    res.render('skill/cats', {cats})
}

module.exports.subreq=(req, res)=>{

    const {sq}=req.params;
     const data=mydata[sq];
     if(data)
     {
     res.render('skill/subreq', {...data});
     }
     else
     {
         res.render('skill/notfound');
     }
}