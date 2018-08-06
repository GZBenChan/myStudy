var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const mysql = require('./../database');
var moment = require('moment');
var sd = require('silly-datetime');
var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

function logAudit(req, res, next) {
        if (!req.session.user) {
        res.redirect('/login');
        return;
    }
};

router.post('/login', function(req, res, next) {
    var name = req.body.name;
    var password = req.body.password;
    var hash = crypto.createHash('md5');
    hash.update(password);
    password = hash.digest('hex');
    var query = 'select * from author where authorName =' + mysql.escape(name) + 'AND authorPassword=' + mysql.escape(password);
    console.log(query);
    mysql.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
            return;
        }
        var user=rows[0];
        if (!user) {
            res.render('login', {message: 'user name or password error'});
            return;
        }
        req.session.user = user;
        console.log(req.session.user);
        console.log(time);
        res.redirect('/');
    });
});

router.post('/edit', function(req, res, next){
    var title = req.body.title;
    var content = req.body.content;
    var author = req.session.user.authorName;
    var query = 'insert article set articleTitle=' + mysql.escape(title) + ', articleAuthor=' + mysql.escape(author) + ', articleContent=';
    query += mysql.escape(content) + ', articleTime=CURDATE()';
    mysql.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/');
    });
});

router.post('/create-todo', function(req, res, next){
    console.log('data ', req.body);
    var todo = {
      task: req.body.task,
      date: moment().format('YYYY/MM/DD'),
      complete: false,
      uid: 'sd9f87sdf76s7d6fsdf67sd',
      due_date: moment().add(7, "days").format('YYYY/MM/DD')
    }
    var title = req.body.title;
    var content = req.body.content;
    var author = req.session.user;
    var query = `INSERT INTO todos(task, date, complete, uid, due_date) VALUES('${todo.task}', '${todo.date}', ${todo.complete}, '${todo.uid}', '${todo.due_date}')`;
    console.log(query);
    mysql.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
            return;
        }
        res.send({
            success: true,
            todo: todo
          });
    });
});

router.post('/save-todo', function(req, res, next){
    console.log('data ', req.body);
    var id = req.body.id;
    var task = req.body.task;
    var query = `UPDATE todos SET task = "${task}" WHERE id = ${id}`;
    console.log(query);
    mysql.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
            return;
        }
        res.send({
            success: true,
            id: id
          });
    });
});

router.post('/complete-todo', function(req, res, next){
    console.log('data ', req.body);
    var id = req.body.id;
    var query = `UPDATE todos SET complete = true WHERE id = ${id}`;
    console.log(query);
    mysql.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
            return;
        }
        res.send({
            success: true,
            id: id
          });
    });
});

router.post('/incomplete-todo', function(req, res, next){
    console.log('data ', req.body);
    var id = req.body.id;
    var query = `UPDATE todos SET complete = false WHERE id = ${id}`;
    console.log(query);
    mysql.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
            return;
        }
        res.send({
            success: true,
            id: id
          });
    });
});

router.post('/delete-todo', function(req, res, next){
    console.log('data ', req.body);
    var id = req.body.id;
    var query = `DELETE FROM todos WHERE id = ${id}`;
    console.log(query);
    mysql.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
            return;
        }
        res.send({
            success: true,
            id: id
          });
    });
});

router.get('/todos', function(req, res, next) {
    var query = 'SELECT * FROM todos';
    mysql.query(query, function(err, rows, fields) {
        var todos = rows;
        res.render("todos.ejs", {todos: todos, user: req.session.user});
    });
});

router.get('/', function(req, res, next) {
    var query = 'SELECT * FROM article ORDER BY articleID DESC';
    mysql.query(query, function(err, rows, fields) {
        var articles = rows;
        articles.forEach(function(ele){
            var year = ele.articleTime.getFullYear();
            var month = ele.articleTime.getMonth() + 1 > 10 ? ele.articleTime.getMonth() : '0' + (ele.articleTime.getMonth() + 1);
            var date = ele.articleTime.getDate() > 10 ? ele.articleTime.getDate() : '0' + ele.articleTime.getDate();
            ele.articleTime = year + '-' + month + '-' + date;
        });
        res.render("index", {articles: articles, user: req.session.user});
    });
});

router.get('/login', function(req, res, next) {
  res.render('login', {message: '', user:req.session.user});
});

router.get('/articles/:articleID', function(req, res, next) {
    var articleID = req.params.articleID;
    var query = 'select * from article where articleID=' + mysql.escape(articleID);
    mysql.query(query, function(err, rows, fields) {
        if (err) {
            console.log(err);
            return ;
        }
        var query = 'update article set articleClick=articleClick+1 WHERE articleID=' + mysql.escape(articleID);
        var article = rows[0];
        mysql.query(query, function(err, rows, fields) {
            if (err) {
                console.log(err);
                return;
            }
            var year = article.articleTime.getFullYear();
            var month = article.articleTime.getMonth() + 1 > 10 ? article.articleTime.getMonth() : '0' + (article.articleTime.getMonth() + 1);
            var date = article.articleTime.getDate() > 10 ? article.articleTime.getDate(): '0' + article.articleTime.getDate();
            article.articleTime = year + '-' + month + '-' + date;
            res.render('article', {article:article, user:req.session.user});
        });
    });
});

router.get('/edit', function(req, res, next){
    var user = req.session.user;
    if (!user) {
        res.redirect('/login');
        return;
    }
    res.render('edit',{user:req.session.user});
});

router.get('/friends', function(req, res, next) {
    res.render('friends', {user:req.session.user});
});

router.get('/about', function(req, res, next) {
    res.render('about', {user:req.session.user});
});

router.get('/logout', function(req, res, next) {
    req.session.user = null;
    res.redirect('/');
});

router.get('/modify/:articleID', function(req, res, next){
    var articleID = req.params.articleID;
    var user = req.session.user;
    var query = 'select * from article where articleID=' + mysql.escape(articleID);
    if (!user) {
        res.redirect('/login');
        return;
    }
    mysql.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
            return;
        }
        var article = rows[0];
        var title = article.articleTitle;
        var content = article.articleContent;
        console.log(title, content);
        res.render('modify', {user: user, title: title, content: content});
    });
});

router.post('/modify/:articleID', function(req, res, next) {
    var articleID = req.params.articleID;
    var user = req.session.user;
    var title = req.body.title;
    var content = req.body.content;
    var query = "UPDATE article set articleTitle=" + mysql.escape(title) + ', articleContent=' + mysql.escape(content) + 'WHERE articleID=' + mysql.escape(articleID);
    mysql.query(query, function(err, rows, fields){
        if (err) {
            console.log(err);
            return;
        }
        res.redirect('/');
    });
});

router.get('/delete/:articleID', function(req, res, next){
    logAudit(req, res, next);
    var articleID = req.params.articleID;
    var query = 'delete from article where articleID=' + mysql.escape(articleID);
    mysql.query(query, function(err, rows, fields){
        res.redirect('/')
    });
});


module.exports = router;
