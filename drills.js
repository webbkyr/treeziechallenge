'use strict';

const { DATABASE } = require('./config');
const knex = require('knex')(DATABASE);
const Treeize = require('treeize');

const tree = new Treeize();

// clear the console before each run
process.stdout.write('\x1Bc');


// Sample select 



knex
  .select('restaurants.id', 'name', 'cuisine as details:cuisine', 'borough as details:borough', 'grades.id as grades:id', 'grades as grades:grade', 'score as grades:score')
  // .count('restaurants')
  .from('restaurants')
  .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
  .where({'cuisine': 'Italian'})
  // .whereIn('address_zipcode', ['10012', '10013', '10014'])
  .orderBy('name', 'asc')
  .limit(5)
  .debug(false)
  // .then(results => console.log(results));
  .then(results => {
    console.log('BEFORE', JSON.stringify(results, null, 1));
    tree.grow(results);
    console.log('AFTER', JSON.stringify(tree.getData(), null, 1));
  
  });


// knex
//   .insert(
//     [{name: 'Bite Cafe',
//       borough: 'Bnodrooklyn', 
//       cuisine: 'coffee', 
//       address_building_number: '123',
//       address_street: 'Atlantic Avenue', 
//       address_zipcode: '11231'}], 'id').into('restaurants')
//   .debug(true);
//   // .then(results => console.log(results));

// knex
//   .returning(['id', 'name'])
//   .insert(
//     [{name: 'Dubz Bakery and Whey',
//       borough: 'Brooklyn', 
//       cuisine: 'Dessert', 
//       address_building_number: '9283',
//       address_street: 'Crenshaw Ave', 
//       address_zipcode: '10023'}]).into('restaurants')
//   .debug(true)
//   .then(console.log);

// knex
//   .returning(['id', 'name'])
//   .insert(
//     [{name: 'Deep Dish Pizza',
//       borough: 'Manhattan', 
//       cuisine: 'American', 
//       address_building_number: '3848',
//       address_street: 'Good Hope Dr', 
//       address_zipcode: '10025'},
//     {name: 'Sugar Shack',
//       borough: 'Bronx',
//       cuisine: 'Ice cream',
//       address_building_number: '8922',
//       address_street: 'Montana Street',
//       address_zipcode: '2000'
//     },
//     {name: 'La Salle',
//       borough: 'Brooklyn',
//       cuisine: 'French',
//       address_building_number: '12039',
//       address_street: '125th and Lexington',
//       address_zipcode: '10038'
//     }]).into('restaurants')
//   .debug(true)
//   .then(console.log);

// knex('restaurants')
//   .where('nyc_restaurant_id', '=', '30191841')
//   .update({
//     name: 'Dj Reynolds Pub and Restaurant'
//   })
//   .then(console.log);

// // DELETE FROM grades WHERE id=10

// knex('grades')
//   .where('id', 100)
//   .del()
//   .then(console.log);

// //this code did NOT prompt an error; the id is no longer in my db 
// knex('grades')
//   .select()
//   .where('id', 22)
//   .then();

knex
  .select('restaurants.id', 'name', 'cuisine', 'borough', 'grades.id as gradeId', 'grade', 'score')
  .from('restaurants')
  .innerJoin('grades', 'restaurants.id', 'grades.restaurant_id')
  .orderBy('name', 'asc')
  .limit(20)
  .then(restaurants => {
    const hydrated = {};
    restaurants.forEach(item => {
      //check if id is in hydrated obj, ensures no n duplications like sql will do
      if ( !(item.id in hydrated) ) {
        //the id is a reference and in those is the key-value pair
        //need to use a number to create references
        hydrated[item.id] = {
          name: item.name,
          cuisine: item.cuisine,
          borough: item.borough,
          grades: []
        };
      }      
      hydrated[item.id].grades.push(
        {
          gradeId: item.gradeId,
          grade: item.grade,
          score: item.score
        });
    });
    // console.log(restaurants);
    // console.log(JSON.stringify(hydrated, null, 1));
  });
// for (let itemizer in restaurants) //for finiding the index
// for (let itemizer of restaurants) //for finiding the data inside



// Destroy the connection pool
knex.destroy().then(() => {
  console.log('database connection closed');
});