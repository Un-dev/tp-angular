import fastify from 'fastify';
// see axios doc on how to use it
import axios from 'axios';

const app = fastify({ logger: true });

app.get('/:countryCode', async (req, res) => {
  let catFacts = []
  let foxImage
  let holidays

  await axios.get('https://cat-fact.herokuapp.com/facts')
  .then(response => {
    response.data.forEach(fact => catFacts.length<3 && fact ? catFacts.push(fact.text) : null)
  })
  .catch(e => {
    catFacts = null
    console.log(e)
  })

  await axios.get('https://randomfox.ca/floof/')
  .then(response => {
    foxImage = response.data.image ? response.data.image : null
  })
  .catch(e => {
    foxImage = null
    console.log(e)
  })

  await axios.get(`https://date.nager.at/api/v2/publicholidays/${new Date().getFullYear()}/${req.params.countryCode ? req.params.countryCode : 'FR'}`)
  .then(response => {
    holidays = response.data ? response.data : null
  })
  .catch(e => {
    holidays = null
    console.log(e)
  })

  res.status(200).send(JSON.stringify({
    catFacts: catFacts,
    foxImage: foxImage,
    holidays: holidays
  }, null, 2))
});

// Run the server!
const start = async () => {
  try {
    await app.listen(5000);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
