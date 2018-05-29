const express = require('express');
const service = require('./tracker.js');

const app = express();
const port = (process.env.PORT || 3000);

app.get('/api/:track', (req, res) => {

  let trackid = req.params.track;

  service.checkRegx(trackid)
    .then(list => {
      return service.gatData(list, trackid)
    })
    .then(editor => {
      return service.editMap(editor)
     })
    .then(data => {
      res.json(data);
      res.end();
    }).catch(err => console.log(err));
})

app.listen(port, () => {
  console.log("App listening on post " + port);
})
