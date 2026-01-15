const Event = require("./event.model");
const redis = require("../../config/redis");

exports.createEvent = async (req, res) => {
  const event = await Event.create({
    ...req.body,
    createdBy: req.user.id
  });
  await redis.del("events:all");
  res.status(201).json(event);
};

exports.getEvents = async (req, res) => {
const cacheKey = "events:all";
  const cachedEvents = await redis.get(cacheKey);
  if (cachedEvents) {
    return res.json(JSON.parse(cachedEvents));
  }
  const events = await Event.find().sort({ createdAt: -1 });
  await redis.set(cacheKey, JSON.stringify(events), "EX", 60);

  res.json(events);
};

exports.updateEvent = async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json(event);
};

exports.deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.json({ message: "Event deleted successfully" });
};
