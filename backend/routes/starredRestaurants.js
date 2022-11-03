const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {
  const { id } = req.params;
  //Find the restaurant with the matching id
  const restaurant = STARRED_RESTAURANTS.find(
    (restaurant) => restaurant.id === id
  );

  //if the restaurant doesnt exist, let the client know
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }
  res.json(restaurant);
});

/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {
  const { body } = req;
  const { id } = body;
  //find the restaurant in the list of starred restaurant
  const restaurant = ALL_RESTAURANTS.find((restaurant) => restaurant.id === id);
  //if the restaurant doesnt exist sent a status code to the client to let it know the restaurant was not found
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }
  //generate a unique id for the new starred restaurant
  const newId = uuidv4();

  //create a record for the new starred restaurant
  const newStarredRestaurant = {
    id: newId,
    restaurantId: restaurant.id,
    comment: null,
  };

  //push the new record into starred_restaurants
  STARRED_RESTAURANTS.push(newStarredRestaurant);
  //success status code and send the restaurant data to the front end
  res.sendStatus(200).sendStatus({
    id: newStarredRestaurant.id,
    comment: newStarredRestaurant.comment,
    name: restaurant.name,
  });
});
/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
//use the .filter() method to remove this restaurant from the list of starred restaurants and save this list in a variable
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const newListOfStarredRestaurants = STARRED_RESTAURANTS.filter(
    (restaurant) => restaurant.id !== id
  );
  //the user tried to unstar a restaurant that isnt currently starred.
  if (STARRED_RESTAURANTS.length === newListOfStarredRestaurants.length) {
    res.sendStatus(400);
    return;
  }
  //reassign starred_restaurants with the updated list of starred restaurants that you stored in a variable
  STARRED_RESTAURANTS = newListOfStarredRestaurants;
  res.sendStatus(200);
});
/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put(".:id", (req, res) => {
  const { id } = req.params;
  const { newComment } = req.body;
  //find the restaurant in the list of starred restaurants
  const restaurant = STARRED_RESTAURANTS.find(
    (restauraunt) => restaurant.id === id
  );
  //if the restaurant doesnt exist send a status code
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }
  //otherwise update the restaurants comment with the comment included in the request body
  restaurant.comment = newComment;
  //send a success status code to the client.
  res.sendStatus(200);
});
module.exports = router;
