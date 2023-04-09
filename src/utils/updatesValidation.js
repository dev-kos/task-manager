const updatesValidation = (validUpdates, updates, res) => {
  const isValidUpdates = updates.every((update) =>
    validUpdates.includes(update)
  );

  if (!isValidUpdates) {
    return res.status(400).send({ error: "Not valid updates" });
  }
};

module.exports = updatesValidation;
