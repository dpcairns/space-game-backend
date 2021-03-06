const client = require('../lib/client');
// import our seed data:
const locations = require('./locations.js');
const usersData = require('./users.js');
const events = require('./events.js');
const shipChoices = require('./shipchoices.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();



    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
    const user = users[0].rows[0];
    
    await Promise.all(
      locations.map(location => {
        return client.query(`
                    INSERT INTO locations (location_name, location_type,location_image, location_description, event_id)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [location.location_name, location.location_type, location.location_image, location.location_description, location.event_id]);
      })
    );

    await Promise.all(
      events.map(event => {
        return client.query(`
                    INSERT INTO events (planet_id, event_name, event_image, event_description, event_choices)
                    VALUES ($1, $2, $3, $4, $5);
                `,
        [event.planet_id, event.event_name, event.event_image, event.event_description, event.event_choices]);
      })
    );

    await Promise.all(
      shipChoices.map(ship => {
        return client.query(`
                    INSERT INTO shipchoices (ship_name, ship_fuel, ship_hull, base_combat, base_diplomacy, base_science, used_item_slots, max_item_slots)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
                `,
        [ship.ship_name, ship.ship_fuel, ship.ship_hull, ship.base_combat, ship.base_diplomacy, ship.base_science, ship.used_item_slots, ship.max_item_slots]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
