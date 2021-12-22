import express from 'express';
import { reg } from "./reg";

const app = express();
const POST = 8800;
const SUBDOMAINS = ['@', '*'];
const DOMAIN = process.env.REGRU_DOMAIN;

app.get('/ip_update', async (req, res) => {
  const { ip } = req.query;

  if (ip) {
    const { answer: { domains: [ domain ]} } = await await reg('/zone/get_resource_records', {
      domains: [{dname: DOMAIN}]
    });

    const currentDomain = domain.rrs.find(
      d => d.rectype === 'A' && SUBDOMAINS.includes(d.subname)
    );

    if (currentDomain?.content === ip) {
      return res.send({
        success: true,
        status: "The current ip is now set",
        currentDomain
      });
    }

    try {
      await Promise.all(SUBDOMAINS.map(subdomain => reg('/zone/remove_record', {
        domains: [{dname: DOMAIN}],
        subdomain,
        record_type: "A",
      })));
    } catch (error) {
      res.status(500).send({
        status: 'Error remove records',
        error
      })
    }

    try {
      const answers = await Promise.all(SUBDOMAINS.map(subdomain => reg('/zone/add_alias', {
        domains: [{dname: DOMAIN}],
        subdomain,
        ipaddr: ip,
      })));

      res.send({
        success: true,
        status: "The ip address is successfully updated",
        answers
      })

    } catch (error) {
      res.status(500).send({
        status: 'Error remove records',
        error
      })
    }

  } else {
    res.status(500).send();
  }
});




app.listen(POST, () => {
  console.log(`Server app listening at http://localhost:${POST}`);
})