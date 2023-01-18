

const { MongoClient } = require("mongodb");
require("dotenv").config();
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const { MONGODB_URI, MONGODB__PRODUCTION_URI } = process.env;



/**
 * constants
 */
const client = new MongoClient(process.env.NODE_ENV === "production" ? MONGODB__PRODUCTION_URI : MONGODB_URI);

async function main() {
  try {
    await client.connect();
    const db = client.db();
    const results = await db.collection("workouts").find({}).count();

    /**
     * If existing records then delete the current collections
     */
    if (results) {
      db.dropDatabase();
    }

    /**
     * This is just a fun little loader module that displays a spinner
     * to the command line
     */
    const load = loading("importing your muscles").start();

    /**
     * Import the JSON data into the database
     */

    const data = await fs.readFile(path.join(__dirname, "gym.json"), "utf8");
    await db.collection("workouts").insertMany(JSON.parse(data));



    const gymFriendsRef = await db.collection("workouts").aggregate([
      { $match: { friend_name: { $ne: null } } },
      {
        $group: {
          _id: "$friend_name",
          workouts: { $sum: 1 },
        },

      },
      {
        $project: {
          _id: 0,
          name: '$_id',
          workouts: '$workouts'
        },
      },
    ]);
    /**
     * Below, we output the results of our aggregate into a
     * new collection
     */
    const gymFriends = await gymFriendsRef.toArray();
    await db.collection("friends").insertMany(gymFriends);

    /** This data manipulation is to reference each document in the
     * tastings collection to a taster id. Further to this we also take the opportunity to
     * tidy up points (converting it to a int) and regions, adding them to a an array
     */

    const updatedGymFriendsRef = db.collection("friends").find({});
    const updatedGymFriends = await updatedGymFriendsRef.toArray();
    updatedGymFriends.forEach(async ({ _id, name }) => {
      await db.collection("workouts").updateMany({ friend_name: name }, [
        {
          $set: {
            friend_id: _id,
            categories: ["$category_1", "$category_2"],
            calories: { $toInt: "$calories" },
          },
        },
      ]);
    });


    /**
     * we can get rid of region_1/2 off our root document, since we've
     * placed them in an array
     */
    await db
      .collection("workouts")
      .updateMany({}, { $unset: { category_1: "", category_2: " " } });

    /**
     * Finally, we remove nulls regions from our collection of arrays
     * */
    await db
      .collection("workouts")
      .updateMany({ categories: { $all: [null] } }, [
        { $set: { categories: [{ $arrayElemAt: ["$categories", 0] }] } },
      ])


    db.collection("workouts").aggregate([
      { $group: { _id: "$time" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "times" }
    ]).toArray()



    await db.collection("workouts").aggregate([
      { $group: { _id: "$rep" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "reps" }
    ]).toArray()

    await db.collection("workouts").aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories" } },
      { $project: { name: '$_id', _id: 0 } },
      { $out: "categories" }
    ]).toArray();


    await db.collection("workouts").aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories" } },
      { $project: { name: "$_id", "_id": 0 } },
      { $out: "categories" }
    ]).toArray()



    load.stop();
    console.info(
      `Your Muscles have loaded. Welcome!`
    );


    process.exit();
  } catch (error) {
    console.error("error:", error);
    process.exit();
  }
}

main();
