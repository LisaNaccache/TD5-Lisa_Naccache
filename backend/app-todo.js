"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app = express();
app.use(express.json()); // => to parse request body with http header "content-type": "application/json"
var swaggerJsdoc = require("swagger-jsdoc"); // * as swaggerJsdoc from 'swagger-jsdoc'
var swaggerUi = require("swagger-ui-express");
var jsDocOptions = {
    definition: {
        openapi: '3.0.0', // Specify the OpenAPI version
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'Documentation for Express API with Swagger',
        },
        components: {
            schemas: {
                Todo: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        title: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                    },
                },
                TodoNoId: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                    },
                },
                // Define other schemas as needed
                LearningPackage: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        category: {
                            type: 'string',
                        },
                        targetAudience: {
                            type: 'string',
                        },
                        difficulty: {
                            type: 'integer',
                            minimum: 1,
                            maximum: 20
                        },
                    },
                },
                UserPackageLearning: {
                    type: 'object',
                    properties: {
                        startDate: {
                            type: 'string',
                            format: 'date'
                        },
                        expectedEndDate: {
                            type: 'string',
                            format: 'date'
                        },
                        minutesPerDayObjective: {
                            type: 'integer',
                        },
                    },
                },
                UserLearningFact: {
                    type: 'object',
                    properties: {
                        timesReviewed: {
                            type: 'integer',
                        },
                        confidenceLevel: {
                            type: 'integer',
                        },
                        lastReviewedDate: {
                            type: 'string',
                            format: 'date'
                        },
                    },
                },
            },
        },
    },
    apis: ['app-todo.js'],
};
var apiDoc = swaggerJsdoc(jsDocOptions);
console.log('api-doc json:', JSON.stringify(apiDoc, null, 2));
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiDoc));
app.get('/api/liveness', function (req, res) {
    res.send('OK !!!');
});
var idGenerator = 1;
function newId() {
    return idGenerator++;
}
var todos = [
    { id: newId(), title: 'Learn TypeScript' },
    { id: newId(), title: 'Learn Angular' },
    { id: newId(), title: 'Learn NodeJs' },
    { id: newId(), title: 'Learn Express' },
];
var learningPackages = [
    {
        id: 1,
        title: "Learn TypeScript",
        description: "An introduction to TypeScript language and its core concepts.",
        category: "Programming",
        targetAudience: "Developers",
        difficulty: 5
    },
    {
        id: 2,
        title: "Learn NodeJs",
        description: "Learn the basics of Node.js and how to create a server.",
        category: "Backend Development",
        targetAudience: "Web Developers",
        difficulty: 6
    },
    {
        id: 3,
        title: "Learn Html",
        description: "Learn the fundamentals of HTML for web development.",
        category: "Frontend Development",
        targetAudience: "Beginners",
        difficulty: 3
    },
    {
        id: 4,
        title: "Learn Angular",
        description: "An introduction to Angular framework for building dynamic web applications.",
        category: "Frontend Frameworks",
        targetAudience: "Frontend Developers",
        difficulty: 7
    }
];
/**
 * @openapi
 * /api/todos:
 *   get:
 *     description: Get all todos
 *     responses:
 *       200:
 *         description: An array of Todo
 *         schema:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Todo'
 */
app.get('/api/todos', function (req, res) {
    console.log('handle http GET /api/todos');
    res.send(todos);
});
/**
 * @openapi
 * /api/todos:
 *   post:
 *     description: save a new Todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TodoNoId'
 *     responses:
 *       200:
 *         description: An array of Todo
 *         schema:
 *           $ref: '#/components/schemas/Todo'
 */
app.post('/api/todos', function (req, res) {
    var item = req.body;
    console.log('handle http POST /api/todos', item);
    item.id = newId();
    todos.push(item);
    res.send(item);
});
/**
 * @openapi
 * /api/todos:
 *   put:
 *     description: update an existing todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
 *     responses:
 *       200:
 *         description: An array of Todo
 *         schema:
 *           $ref: '#/components/schemas/Todo'
 */
app.put('/api/todos', function (req, res) {
    var item = req.body;
    console.log('handle http PUT /api/todos', item);
    var id = item.id;
    var idx = todos.findIndex(function (x) { return x.id === id; });
    if (idx !== -1) {
        var found = todos[idx];
        if (item.title) {
            found.title = item.title;
        }
        if (item.description) {
            found.description = item.description;
        }
        res.send(found);
    }
    else {
        res.status(404).send('Todo entity not found by id:' + id);
    }
});
/**
 * @openapi
 * /api/todos/{id}:
 *   get:
 *     description: get a todo by its id
 *     parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the Todo to get
 *           schema:
 *             type: number
 *     responses:
 *       200:
 *         description: the todo
 *         schema:
 *           $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found
 */
app.get('/api/todos/:id', function (req, res) {
    var id = +req.params['id'];
    console.log('handle http GET /api/todos/:id', id);
    var idx = todos.findIndex(function (x) { return x.id === id; });
    if (idx !== -1) {
        var found = todos[idx];
        res.send(found);
    }
    else {
        res.status(404).send('Todo entity not found by id:' + id);
    }
});
/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     description: delete an existing Todo by its id
 *     parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the Todo to delete
 *           schema:
 *             type: number
 *     responses:
 *       200:
 *         description: the deleted Todo
 *         schema:
 *           $ref: '#/components/schemas/Todo'
 *       404:
 *         description: when the Todo was not found
 */
app.delete('/api/todos/:id', function (req, res) {
    var id = +req.params['id'];
    console.log('handle http DELETE /api/todos/:id', id);
    var idx = todos.findIndex(function (x) { return x.id === id; });
    if (idx !== -1) {
        var found = todos.splice(idx, 1)[0];
        res.send(found);
    }
    else {
        res.status(404).send('Todo entity not found by id:' + id);
    }
});
// Endpoint LearningPackage
/**
 * @openapi
 * /api/package:
 *   get:
 *     description: Get all learning packages
 *     responses:
 *       200:
 *         description: An array of LearningPackage
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LearningPackage'
 */
app.get('/api/package', function (req, res) {
    res.status(200).json(learningPackages);
});
/**
 * @openapi
 * /api/package/{id}:
 *   get:
 *     description: Get a learning package by its id
 *     parameters:
 *         - name: id
 *           in: path
 *           required: true
 *           description: The ID of the Learning Package to get
 *           schema:
 *             type: number
 *     responses:
 *       200:
 *         description: the learning package
 *         schema:
 *           $ref: '#/components/schemas/LearningPackage'
 *       404:
 *         description: Learning Package not found
 */
app.get('/api/package/:id', function (req, res) {
    var id = +req.params['id'];
    console.log('handle http GET /api/package/:id', id);
    var idx = learningPackages.findIndex(function (x) { return x.id === id; });
    if (idx !== -1) {
        var found = learningPackages[idx];
        res.send(found);
    }
    else {
        res.status(404).send('Todo entity not found by id:' + id);
    }
});
// app.patch()
console.log('starting...');
app.listen(3000, function () {
    console.log('Ok, started port 3000, please open http://localhost:3000/swagger-ui');
});