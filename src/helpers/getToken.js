export const getByToken = (req) => {
  const [, token] = req.headers?.authorization?.split(" ") || [];
  return token;
};
