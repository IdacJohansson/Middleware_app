import express from "express";
const app = express();
const router = express.Router();

app.use(express.json());
app.use("/api", router);

const orders = [
  {
    id: 1,
    name: "Pizza",
    price: 12,
    ingredients: ["tomato", "cheese"],
  },
  {
    id: 2,
    name: "Burger",
    price: 8,
    ingredients: ["beef", "onion", "lettuce"],
  },
  {
    id: 3,
    name: "Salad",
    price: 5,
    ingredients: ["cucumber", "tomato", "basil"],
  },
  {
    id: 4,
    name: "Spaghetti",
    price: 10,
    ingredients: ["pasta", "tomato", "basil"],
  },
];

router.use((req, res, next) => {
  const isValidUser = true; // false
  if (!isValidUser) {
    return res.status(401).json({
      message: "Unauthorized, your are not allowed to get the orders",
    });
  }
  next();
});

router.use((req, res, next) => {
  console.log(`Order received at " ${new Date().toLocaleDateString()}`);
  next();
});

router.get("/orders", (req, res) => {
  res.json(orders);
});

router.post("/orders", (req, res) => {
  try {
    const newOrder = {
      id: orders.length + 1,
      name: req.body.name,
      price: req.body.price,
    };
    if (!newOrder.name || !newOrder.price) {
      return res.status(500).send({ message: "Missing order: price or name" });
    }
    orders.push(newOrder);
    res.json({
      message: `Order received at: ${new Date().toLocaleDateString()}`,
      orders: newOrder,
    });
  } catch (error) {
    console.log(err.stack);
    res
      .status(500)
      .send({ message: "An error occurred while processing the order" });
  }
});

router.put("/orders/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    res.status(500).send({ message: "Order not found " + orderId });
  }
  order.name = req.body.name || order.name;
  order.price = req.body.price || order.price;
  res.json({
    message: `Order updated at: ${new Date().toLocaleDateString()}`,
    order,
  });
});

router.put("/orders/:id/ingredients", (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(500).send({ message: "Order not found " + orderId });
  }
  order.ingredients = req.body.ingredients || order.ingredients;
  res.json({
    message: `Order ingredients updated at: ${new Date().toLocaleDateString()}`,
    order,
  });
});

router.delete("/orders/:id", (req, res) => {
  const orderId = parseInt(req.params.id);
  const order = orders.find((o) => o.id === orderId);
  if (!order) {
    return res.status(404).send({ message: "Order not found " + orderId });
  }
  res.json({ message: "Order deleted" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
