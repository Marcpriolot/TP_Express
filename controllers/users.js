const express = require('express');
const router = express.Router();
const Users = require('../models/users');
const bcrypt = require('bcrypt');
const db = require('../db');


router.post('/', (req, res) => {
    Users.sync({force:false}).then(() => {
        return Users.create({
            name: req.body.name,
            pwd: bcrypt.hashSync(req.body.pwd,bcrypt.genSaltSync(10)),
            createdAt: new Date()
        });
    }).then(() => {
        res.format({
            html: () => { res.redirect('/users') },
            json: () => { res.json({status:'success'}) }
        })
    }).catch((error) => {
        res.send(error);
    });
});

router.get('/add', (req, res) => {
    return res.render('users/add', {
       title: 'Ajouter un utilisateur :'
    });
});

router.get('/login', (req, res) => {
    return res.render('users/login', {
        title: 'Connexion'
    })
});

router.get('/', (req, res) => {
    let users = [];
    let where = {};

    Users.findAll({
        limit:req.query.limit,
        offset:req.query.offset
    }).then(result => {
        result.forEach(row => {
            users.push(row.dataValues) ;
        });
        console.log(users);
        res.format({
            html: () => {
                return res.render('users', {
                    title: 'Liste des utilisateurs :',
                    users: users
                })
            },
            json: () => { res.json(users); }
        });
    }).catch((error) => {
        res.send(error);
    });
});

router.get('/:userId', (req, res) => {
    Users.find({
        where:{
            id:req.params.userId
        }
    }).then((result) => {
        res.format({
            html: () => {
                return res.render('users/:userId', {
                   title: 'Utilisateur n°'+req.params.userId,
                   user: result.dataValues
                });
            },
            json: () => { res.json(result.dataValues) }
        })
    }).catch((error) => {
        res.send(error);
    });
});

router.get('/:userId/edit', (req, res) => {
    Users.find({
        where:{
            id:req.params.userId
        }
    }).then((result) => {
        return res.render('users/edit', {
           title: 'Modification de l\'utilisateur n°' + req.params.userId,
           user: result.dataValues
        });
    }).catch((error) => {
        res.send(error);
    });
});


router.delete('/:userId', (req, res) => {
    Users.destroy({
        where:{
            id:req.params.userId
        }
    }).then(() => {
        res.format({
            html: () => { res.redirect('/users')  },
            json: () => { res.json({status:'success'}); }
        });

    }).catch((error) => {
        res.send(error);
    });
});

router.patch('/:userId', (req, res) => {
    Users.update({
        name:req.body.name,
        pwd: bcrypt.hashSync(req.body.pwd, bcrypt.genSaltSync(10)),
        updatedAt:new Date()
    },{
        where:{
            id:req.params.userId
        }
    }).then(() => {
        res.format({
            html: () => { res.redirect('/users') },
            json: () => { res.json({status:'success'}); }
        });
    }).catch((error) => {
        res.send(error);
    });
});


router.post('/login', (req, res) => {
    Users.find({
        where:{
            name:req.body.name
        }
    }).then((result) => {
        if(bcrypt.compareSync(req.body.pwd, result.dataValues.pwd)){
            req.session.userId = result.dataValues.id;
            res.send('Connexion réussie');
        }
        else {
            res.send('Connexion échouée');
        }
    }).catch((error) => {
        res.send(error);
    });
});

module.exports = router;