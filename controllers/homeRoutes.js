const router = require("express").Router();
const { User, Category, Card, Comment } = require("../models");
const withAuth = require("../utils/auth");
var geoip = require("geoip-lite");
const sequelize = require("sequelize");
const { getDistanceFromLatLonInKm } = require("../utils/geo");

router.get("/", async (req, res) => {
  try {
    var forwardedIpsStr = req.header("x-forwarded-for");
    // var ip = '';
    var ip = "207.97.227.239";
    var geo = geoip.lookup(ip);
    var lat = parseFloat(geo.ll[0]);
    var lon = parseFloat(geo.ll[1]);
    // console.log(geo);

    if (forwardedIpsStr) {
      ip = forwardedIps = forwardedIpsStr.split(",")[0];
    }
    // Get all categories and JOIN with user data
    const cardData = await Card.findAll();
    // // Serialize data so the template can read it
    // const card = cardData.map((card) => card.get({ plain: true }));

    const cards = cardData.map((card) => {
      if (
        getDistanceFromLatLonInKm(
          lat,
          lon,
          parseFloat(card.event_location_lat),
          parseFloat(card.event_location_lon)
        ) < 920.00
      )
        return card.get({ plain: true });
    });

    // const location = sequelize.literal(`ST_GeomFromText('POINT(${lat} ${lon})', 4326)`);
    // var distance = sequelize.fn('ST_Distance_Sphere', sequelize.literal('event_location'), location);

    // const cardData = await Card.findAll({
    //   attributes: [[sequelize.fn('ST_Distance_Sphere', sequelize.literal('event_location'), location),'distance']],
    //   order: distance,
    //   limit: 10,
    //   logging: console.log
    // })
    // .then(function(instance){
    //   console.log('instance: ', instance);
    // })
    // // const cardData = await Card.findAll(query)
    // console.log('cardData: ', cardData)

    console.log("cards: ", cards);
    // console.log('cardData: ', cardData)

    // Pass serialized data and session flag into template
    res.render("homepage", { cards: cards });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/cards/:id", async (req, res) => {
  try {
    const cardData = await Card.findByPk(req.params.id, {
      include: [
        {
          model: User,
          model: Comment,
        },
      ],
    });
    const card = cardData.get({ plain: true });

    res.render("viewcard", { ...card });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name"],
        },
      ],
    });

    const category = categoryData.get({ plain: true });

    res.render("category", {
      ...category,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get("/profile", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: {
        exclude: ["password"],
      },
    });

    const user = userData.get({ plain: true });

    res.render("profile", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/login", (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect("/profile");
    return;
  }

  res.render("login");
});

module.exports = router;
