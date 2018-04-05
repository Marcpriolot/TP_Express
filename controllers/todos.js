const express = require('express');
const router = express.Router();
const Todos = require('../models/todos');

router.post('/', (req, res) => {
    console.log(req.body);
    Todos.sync({force:false}).then(() => {
        return Todos.create({
            message: req.body.message,
            completion: req.body.completion,
            userId : req.session.userId,
            createdAt: new Date()
        });
    }).then(() => {
        res.format({
            html: () => { res.redirect('/todos') },
            json: () => { res.json({status:'success'}) }
        })
    }).catch((error) => {
        res.send(error);
    });
});

router.get('/add', (req, res) => {
    return res.render('todos/add', {
        title: "Ajouter un todo",
    });
});

router.get('/:todoId', (req, res) => {
    Todos.find({
        where:{
            id:req.params.todoId
        }
    }).then((result) => {
        res.format({
            html: () => {
                return res.render('todos/show', {
                    title: 'Affichage de la todo n°'+req.params.todoId,
                    todo:result.dataValues
                });
            },
            json: () => { res.json(result.dataValues) }
        })
    }).catch((error) => {
        res.send(error);
    });
});

router.get('/:todoId/edit', (req, res) => {
    Todos.find({
        where:{
            id:req.params.todoId
        }
    }).then((result) => {
        return res.render('todos/edit', {
            title: 'Modifier la todo n°'+req.params.todoId,
            todo:result.dataValues
        });
    }).catch((error) => {
        res.send(error);
    });
});

router.get('/', (req, res) => {
    let todos = [];
    let where = {};

    if (req.session.userId !== undefined){
        where.userId = req.session.userId;
    }

    if(req.query.completion !== undefined){
        where.completion = req.query.completion;
    }
    Todos.findAll({
        limit:req.query.limit,
        offset:req.query.offset,
        where:where,
        order: [
            ['completion', 'ASC'],
            ['updatedAt', 'ASC']
        ]
    }).then(result => {
        result.forEach(row => {
            todos.push(row.dataValues) ;
        });
        res.format({
            html: () => {
                    return res.render('todos/', {
                    title: 'Liste des todos : ',
                    todos:todos
                });
                },
            json: () => { res.json(todos); }
        });
    }).catch((error) => {
        res.send(error);
    });
});

router.delete('/:todoId', (req, res) => {
    Todos.destroy({
        where:{
            id:req.params.todoId
        }
    }).then(() => {
        res.format({
            html: () => { res.redirect('/todos')  },
            json: () => { res.json({status:'success'}); }
        });

    }).catch((error) => {
        res.send(error);
    });
});

router.patch('/:todoId', (req, res) => {
    Todos.update({
        message:req.body.message,
        completion: req.body.completion,
        updatedAt:new Date()
    },{
        where:{
            id:req.params.todoId
        }
    }).then(() => {
        res.format({
            html: () => { res.redirect('/todos') },
            json: () => { res.json({status:'success'}); }
        });
    }).catch((error) => {
        res.send(error);
    });
});

module.exports = router;