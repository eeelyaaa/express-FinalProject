// GO TO http://localhost:3000/ OR http://localhost:3000/users/login TO LOGIN

var express = require('express');
var router = express.Router();
var models = require('../models');
const mysql = require('mysql2');
var authService = require('../services/auth');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.get('/signup', function (req, res, next) {
  res.render('signup', {});
});

router.get('/login', function (req, res, next) {
  res.render('login', {});
})

router.post('/login', function (req, res, next) {
  models.users.findOne({
    where: {
      Username: req.body.Username
    }
  }).then(user => {
    if (!user) {
      console.log('User not found')
      return res.status(401).json({
        message: "Login Failed"
      });
    } else {
      let passwordMatch = authService.comparePasswords(req.body.Password, user.Password);
      if (passwordMatch) {
        let token = authService.signUser(user);
        res.cookie('jwt', token);
        res.redirect('/users/profile');
        console.log('Logged in');
      } else {
        console.log('Wrong password');
        res.send('Wrong password');
      }
    }
  });
});
// router.get('/profile', function (req, res, next) {
//   let token = req.cookies.jwt;
//   if (token) {
//     authService.verifyUser(token)
//       .then(user => {
//         if (user) {
//           res.render('profile', { user });
//         } else {
//           res.status(401);
//           res.send('Invalid authentication token');
//         }
//       });
//   } else {
//     res.status(401);
//     res.send('Must be logged in');
//   }
// });

router.get('/edit', function(req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then(user => {
      if (!user) {
        res.send('Must be logged in');
      } else {
        models.posts.findAll({where: {UserId: user.UserId}}).then(foundPosts => {
          models.posts.findOne({where: {PostTitle: foundPosts.PostTitle}}).then(post => {
            res.redirect('/');
          });
        });
      }
    })
  }
});

router.post('/delete', function(req,res,next) {
  
});



router.get('/profile', function (req,res,next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then(user => {
      models.posts.findAll({where: {UserId: user.UserId}}).then(foundPosts =>{
        if (foundPosts) {
          res.render('profile', {user, foundPosts});
        }
      })
    })
  }
});

router.get('/logout', function (req, res, next) {
  res.cookie('jwt', "", { expires: new Date(0) });
  res.render('login', {});
});

router.get('/admin', function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
    authService.verifyUser(token).then(user => {
      if (user.Admin) {
        res.render('admin');
      } else {
        res.send('Unauthorized');
      }
    })
  }
});

router.post('/signup', function (req, res, next) {
  models.users
    .findOrCreate({
      where: {
        Username: req.body.Username
      },
      defaults: {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Email: req.body.Email,
        Password: authService.hashPassword(req.body.Password)
      }
    })
    .spread(function (result, created) {
      if (created) {
        res.render('login', {});
      } else {
        res.send('This user already exists');
      }
    });
});

// router.post('/post', function (req, res, next) {
//   let token = req.cookies.jwt;
//   models.posts.findOrCreate({
//       where: {
//         PostTitle: req.body.PostTitle,
//         PostBody: req.body.PostBody
//       },
//       defaults: {
        
//       }
//   }).spread(function (result, created) {
//     if (created) {
//       res.redirect('/users/profile');
//     } else {
//       res.send('already exists bud');
//     }
//   });
// });

router.post('/post', function (req, res, next) {
  let token = req.cookies.jwt;
  if (token) {
      authService.verifyUser(token).then(user => {
          if (user) {
              models.posts
                  .findOrCreate({
                      where: {
                          UserId: user.UserId,
                          PostTitle: req.body.PostTitle,
                          PostBody: req.body.PostBody
                      }
                  })
                  .spread((result, created) => res.redirect('/users/profile'));
          } else {
              res.status(401);
              res.send('Sorry, please log in');
          }
      });
  } else {
      res.status(401);
      res.send('Must be logged in');
  }
});

// findOrCreate({
//   where: {
//     PostTitle: req.body.PostTitle,
//     PostBody: req.body.PostBody
//   },
//   defaults: {
    
//   }

module.exports = router;
