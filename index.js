require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
mongoose.connect(process.env.MOON, {useNewUrlParser: true, useUnifiedTopology: true})
schema = mongoose.Schema({
  original: {type: String, required: true},
  short: Number
})

let url = mongoose.model('Url', schema)
let respon = {}
app.post('/api/shorturl', bodyParser.urlencoded({extended: false}), function(req, res) {
  let input = req.body['url']
  let rex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)
  if(!input.match(rex))
  {
    res.json({error: 'invalid url '})
    return
  }

  respon['original_url'] = input
  let shortt = 1
  url.findOne({})
      .sort({short: 'desc'})
      .exec(function(err, result) {
        if(!err && !undefined)
          shortt = result['short'] + 1
        if(!err)
          url.findOneAndUpdate(
            {original: input},
            {original: input, short:shortt},
            {new: true, upsert: true},
            function(err, urlc) {
              respon['short_url'] = urlc['short']
              res.json(respon)
            }
          )
      })
})

app.get('/api/shorturl/:input', function(req, res) {
  let data = req.params.input
  url.findOne({short:data}, function(err, result) {
    if(!err && result !=undefined)
      res.redirect(result.original)
    else
      res.json('url not found')
      console.log(err)
  })
})
